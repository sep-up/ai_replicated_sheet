import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { getToken, getTokenType } from '@@/utils/cache/localStorage.ts'
import axios from 'axios'
import { get, merge } from 'lodash-es'

/** 创建请求实例 */
function createInstance() {
  // 创建一个 axios 实例命名为 instance
  const instance = axios.create()
  // 请求拦截器
  instance.interceptors.request.use(
    // 发送之前
    (config) => {
      // 设置token
      // if (store.getters.token) {
      config.headers.Authorization = `${getTokenType()} ${getToken()}`
      // }
      // pad 端的baseUrl 可能会随时改变
      config.baseURL
        = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_NGINX_PATH
          : `${localStorage.getItem('baseUrl')}/factory/v1`
      return config
    },
    // 发送失败
    error => Promise.reject(error)
  )
  // 响应拦截器（可根据具体业务作出相应的调整）
  instance.interceptors.response.use(
    (response) => {
      if (response.data.code !== '200') {
        if (response.data.code === '3002') {
          // 回退到登录页
        } else if (response.data.code === '3005' || response.data.code === '3007') {
          // 登录过期 回退到登录页
        } else {
          // 错误提示
          // Notify({ type: 'danger', message: response.data.message })
          return response
        }
        return Promise.reject(new Error(response.data.message || 'Error'))
      } else {
        return response
      }
    },
    (error) => {
      // status 是 HTTP 状态码
      const status = get(error, 'response.status')
      const message = get(error, 'response.data.message')
      switch (status) {
        case 400:
          error.message = '请求错误'
          break
        case 401:
          // Token 过期时
          error.message = message || '未授权'
          // logout()
          break
        case 403:
          error.message = message || '拒绝访问'
          break
        case 404:
          error.message = '请求地址出错'
          break
        case 408:
          error.message = '请求超时'
          break
        case 500:
          error.message = '服务器内部错误'
          break
        case 501:
          error.message = '服务未实现'
          break
        case 502:
          error.message = '网关错误'
          break
        case 503:
          error.message = '服务不可用'
          break
        case 504:
          error.message = '网关超时'
          break
        case 505:
          error.message = 'HTTP 版本不受支持'
          break
      }
      ElMessage.error(error.message)
      return Promise.reject(error)
    }
  )
  return instance
}

/** 创建请求方法 */
function createRequest(instance: AxiosInstance) {
  return <T>(config: AxiosRequestConfig): Promise<T> => {
    const token = getToken()
    // 默认配置
    const defaultConfig: AxiosRequestConfig = {
      // 接口地址
      baseURL:
        import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_NGINX_PATH
          : `${localStorage.getItem('baseUrl')}/factory/v1`,
      // 请求头
      headers: {
        // 携带 Token
        'Authorization': token ? `Bearer ${token}` : undefined,
        'Content-Type': 'application/json'
      },
      // 请求体
      data: {},
      // 请求超时
      timeout: 5000,
      // 跨域请求时是否携带 Cookies
      withCredentials: false
    }
    // 将默认配置 defaultConfig 和传入的自定义配置 config 进行合并成为 mergeConfig
    const mergeConfig = merge(defaultConfig, config)
    return instance(mergeConfig)
  }
}

/** 用于请求的实例 */
const instance = createInstance()

/** 用于请求的方法 */
export const request = createRequest(instance)
