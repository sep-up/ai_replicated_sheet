import axios from 'axios'

const getBaseURL = () => {
  if (import.meta.env.DEV) {
    return '/factory/v1/jy-app/'
  }
  const baseUrl = localStorage.getItem('baseUrl')
  return baseUrl ? `${baseUrl}/factory/v1/jy-app` : '/factory/v1/jy-app/'
}

const request = axios.create({
  baseURL: getBaseURL(),
  timeout: 10000
})

request.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default request
