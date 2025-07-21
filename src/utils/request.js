// src/utils/request.ts
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/user' // ✅ 注意路径需匹配你的项目结构

const request = axios.create({
  baseURL: 'http://10.10.5.8:8080',
  timeout: 5000,
})

// 请求拦截器：自动注入 Bearer Token
request.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const token = userStore.token || localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器：统一处理错误和登录跳转
request.interceptors.response.use(
  response => response,
  error => {
    const userStore = useUserStore()

    if (error.response) {
      const { status } = error.response

      if (status === 401 || status === 403) {
        ElMessage.error('登录已过期，请重新登录')
        userStore.logout()
        window.location.href = '/login'
      } else {
        ElMessage.error(error.response.data.message || '请求出错')
      }
    } else {
      ElMessage.error('无法连接服务器')
    }

    return Promise.reject(error)
  }
)

export default request
