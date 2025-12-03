// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// 导入表单设计器首页组件（需确保 views 目录下有这个 Vue 文件）
import FormDesignerHome from '@/views/FormDesignerHome.vue'

// 创建路由实例
const router = createRouter({
  // 🔥 关键：History 模式 + 基础路径（与 vite.config.js 的 base 一致，都是 /form-designer/）
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // 对应 Django 路径：/form-designer/（表单设计器首页）
      name: 'form-designer-home',
      component: FormDesignerHome // 首页组件
    },
    {
      path: '/form-edit/:id', // 对应 Django 路径：/form-designer/form-edit/1/（表单编辑页，带 ID 参数）
      name: 'form-edit',
      // 懒加载组件（优化性能，访问时才加载）
      component: () => import('@/views/FormEdit.vue')
    }
  ]
})

// 导出路由实例（供 main.js 导入）
export default router