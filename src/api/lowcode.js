// frontend/src/api/lowcode.js
import axios from 'axios'
import Cookies from 'js-cookie' // 提前导入，避免拦截器中动态import的异步问题

// 配置后端接口基础路径（Django后端地址）
// 优先从环境变量读取，未配置则使用固定地址
const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'

// 创建axios实例
const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
})

// 请求拦截器（添加CSRF Token，适配Django的CSRF防护）
instance.interceptors.request.use(
  (config) => {
    // 获取Django的csrftoken（Cookie中存储）
    const csrftoken = Cookies.get('csrftoken')
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken
    }
    return config
  },
  (error) => {
    // 请求错误处理
    console.error('请求拦截器错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器（统一处理后端返回结果）
instance.interceptors.response.use(
  (response) => {
    // 直接返回响应数据（简化业务层调用）
    return response.data
  },
  (error) => {
    // 统一错误处理
    console.error('接口请求失败：', error.response || error.message)
    // 可根据后端状态码添加自定义错误提示
    if (error.response?.status === 401) {
      alert('登录状态失效，请重新登录')
    } else if (error.response?.status === 403) {
      alert('无权限执行该操作')
    } else if (error.response?.status === 500) {
      alert('服务器内部错误，请稍后重试')
    }
    return Promise.reject(error)
  }
)

// ===================== 模型相关接口 =====================
// 1. 获取模型列表（分页/搜索）
export const getModelListApi = (params) => {
  return instance.get('/lowcode/api/model/list/', {
    params // 分页参数：page_num、page_size；搜索参数：name、status等
  })
}

// 2. 创建模型接口
export const createModelApi = (data) => {
  return instance.post('/lowcode/api/model/create/', data)
}

// 3. 删除单个模型
export const deleteModelApi = (id) => {
  return instance.delete(`/lowcode/api/model/${id}/`) // 适配Django的RESTful风格（结尾加/）
}

// 4. 批量删除模型
export const batchDeleteModelApi = (ids) => {
  return instance.delete('/lowcode/api/model/batch-delete/', {
    data: ids // delete请求传body需用data参数
  })
}

// ===================== 辅助接口 =====================
// 1. 获取角色列表接口
export const getRoleListApi = () => {
  return instance.get('/lowcode/api/role/list/')
}

// 2. 检测数据库表是否存在
export const checkTableExistsApi = (tableName) => {
  return instance.get('/lowcode/api/table/check/', {
    params: { table_name: tableName }
  })
}

// ===================== 扩展接口（可选） =====================
// 编辑模型接口（按需添加）
export const editModelApi = (id, data) => {
  return instance.put(`/lowcode/api/model/${id}/`, data)
}

// 获取单个模型详情
export const getModelDetailApi = (id) => {
  return instance.get(`/lowcode/api/model/${id}/`)
}

// 模型升级接口
export const upgradeModelApi = (id, data) => {
  return instance.post(`/lowcode/api/model/${id}/upgrade/`, data)
}