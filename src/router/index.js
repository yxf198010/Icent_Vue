import { createRouter, createWebHistory } from 'vue-router'
// 导入表单设计器首页组件
import FormDesignerHome from '@/views/FormDesignerHome.vue'

// 定义路由规则（移除 TypeScript 类型提示）
const routes = [
  // 根路由重定向到低代码设计器主路径
  {
    path: '/',
    redirect: '/lowcode_designer'
  },
  // 低代码设计器首页（核心路径）
  {
    path: '/lowcode_designer',
    name: 'lowcode_designer-home',
    component: FormDesignerHome,
    meta: {
      title: '工业低代码设计器', // 页面标题，可在路由守卫中使用
      keepAlive: true // 是否缓存组件（可选）
    }
  },
  // 表单编辑页（带动态 ID 参数）
  {
    path: '/lowcode_designer/form-edit/:id',
    name: 'lowcode_designer-edit',
    // 懒加载组件，优化首屏加载速度
    component: () => import('@/views/lowcodeEdit.vue'),
    meta: {
      title: '编辑工业表单',
      requiresId: true // 标记需要 ID 参数
    },
    // 路由参数校验
    props: (route) => ({
      formId: route.params.id || ''
    })
  },
  // 404 兜底路由（匹配所有未定义路径）
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    // 懒加载 404 组件（可自行创建 NotFound.vue）
    component: () => import('@/views/NotFound.vue'),
    meta: {
      title: '页面未找到'
    }
  }
]

// 创建路由实例
const router = createRouter({
  // 基础路径配置（与 Vite 配置一致，确保路径匹配）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // 路由切换时滚动到顶部
  scrollBehavior: (to, from, savedPosition) => {
    return savedPosition || { top: 0 }
  }
})

// 全局前置路由守卫：处理页面标题、参数校验等
router.beforeEach((to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // 校验编辑页 ID 参数
  if (to.meta.requiresId && !to.params.id) {
    // 无 ID 时重定向到首页
    next({ name: 'lowcode_designer-home' })
    return
  }

  // 正常放行
  next()
})

// 全局后置路由守卫：可用于埋点、日志记录等
router.afterEach((to, from) => {
  // 示例：打印路由切换日志（生产环境可注释）
  console.log(`路由切换：${from.path} -> ${to.path}`)
})

export default router