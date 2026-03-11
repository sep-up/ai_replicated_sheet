import axios from 'axios'

var baseURL = import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_NGINX_PATH
          : `${localStorage.getItem('baseUrl')}/factory/v1`

var request = axios.create({
  baseURL: baseURL,
  timeout: 10000
})

request.interceptors.request.use(
  function(config) {
    config.headers['Authorization'] = localStorage.getItem('Token-Type') || 'Bearer' + ' ' + localStorage.getItem('Token')
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  function(response) {
    var res = response.data
    if (res.code === 200) {
      return res
    } else {
      return Promise.reject(new Error(res.message || '请求失败'))
    }
  },
  function(error) {
    return Promise.reject(error)
  }
)

export default request
