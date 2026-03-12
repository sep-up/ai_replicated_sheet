// 统一处理 Cookie

import { CacheKey } from '@@/constants/cache-key'
import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get(CacheKey.TokenKey)
}

export function setToken(token: string) {
  Cookies.set(CacheKey.TokenKey, token)
}

export function removeToken() {
  Cookies.remove(CacheKey.TokenKey)
}
