// src/utils/request.js
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 创建axios实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 对接vite代理
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 可添加token等请求头
    // config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  (error) => {
    ElMessage.error('请求异常，请稍后重试')
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data
    // 假设后端返回格式：{ code: 200, msg: '成功', data: {} }
    if (res.code !== 200) {
      ElMessage.error(res.msg || '请求失败')
      return Promise.reject(res)
    }
    return res
  },
  (error) => {
    ElMessage.error(error.message || '服务器异常')
    return Promise.reject(error)
  }
)

export default request