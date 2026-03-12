import type * as Users from './type'
import { request } from '@/http/axios'

/** 获取当前登录用户详情 */
export function getCurrentUserApi() {
  return request<Users.CurrentUserResponseData>({
    url: 'users/me',
    method: 'get'
  })
}

/** 获取用户信息 */
export function getUserInfoApi() {
  return request({
    url: `/api/users/info`,
    method: 'get'
  })
}
