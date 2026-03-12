import { CacheKey } from '@@/constants/cache-key'

export function getToken() {
  return localStorage.getItem(CacheKey.TokenKey)
}

export function setToken(token: string) {
  return localStorage.setItem(CacheKey.TokenKey, token)
}

export function setTokenType(tokenType: string) {
  return localStorage.setItem(CacheKey.TokenTypeKey, tokenType)
}

export function removeTokenTypeKey() {
  return localStorage.removeItem(CacheKey.TokenTypeKey)
}

export function getTokenType() {
  return localStorage.getItem(CacheKey.TokenTypeKey)
}

export function removeToken() {
  return localStorage.removeItem(CacheKey.TokenKey)
}

export function setFreshToken(freshToken: string) {
  return localStorage.setItem(CacheKey.FreshTokenKey, freshToken)
}

export function getFreshToken() {
  return localStorage.getItem(CacheKey.FreshTokenKey)
}

export function removeFreshToken() {
  return localStorage.removeItem(CacheKey.FreshTokenKey)
}

export function getUserinfo() {
  return localStorage.getItem(CacheKey.Userinfo)
}

export function setUserinfo(userinfo: string) {
  return localStorage.setItem(CacheKey.Userinfo, userinfo)
}

export function removeUserinfo() {
  return localStorage.removeItem(CacheKey.Userinfo)
}

export function getBaseUrl() {
  return localStorage.getItem(CacheKey.BaseUrl)
}

export function setBaseUrl(baseUrl: string) {
  return localStorage.setItem(CacheKey.BaseUrl, baseUrl)
}

export function removeBaseUrl() {
  return localStorage.removeItem(CacheKey.BaseUrl)
}

export function getConnectedBluetooth() {
  return localStorage.getItem(CacheKey.ConnectedBluetooth)
}

export function setConnectedBluetooth(connectedBluetooth: string) {
  return localStorage.setItem(CacheKey.ConnectedBluetooth, connectedBluetooth)
}

export function removeConnectedBluetooth() {
  return localStorage.removeItem(CacheKey.ConnectedBluetooth)
}

export function getLastPrint() {
  return JSON.parse(localStorage.getItem(CacheKey.LastPrintConnectInfo) || '{}')
}
export function setLastPrint(info: any) {
  return localStorage.setItem(CacheKey.LastPrintConnectInfo, JSON.stringify(info))
}

const CurrentConnectedBluetoothList = 'currentConnectedBluetoothList'

export function setCurrentConnectedBluetoothList(currentConnectedBluetoothList: string) {
  return sessionStorage.setItem(CurrentConnectedBluetoothList, currentConnectedBluetoothList)
}

export function getCurrentConnectedBluetoothList() {
  return sessionStorage.getItem(CurrentConnectedBluetoothList)
}

const PrintInstruction = 'printInstruction'
export function getPrintInstruction() {
  return localStorage.getItem(PrintInstruction)
}

export function setPrintInstruction(printInstruction: string) {
  return localStorage.setItem(PrintInstruction, printInstruction)
}
