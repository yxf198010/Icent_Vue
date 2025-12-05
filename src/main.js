import { createApp } from 'vue'
import App from './App.vue'
// 引入 Element Plus 核心库及样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
// 引入全局样式
import './style.css'

// 导入 Element Plus 官方图标（2025年确认可用）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 创建 Vue 应用实例
const app = createApp(App)

// 安装 Element Plus 插件
app.use(ElementPlus)

// 批量注册所有 Element Plus 图标（推荐，避免遗漏）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 全局配置
app.config.globalProperties.$ELEMENT = {
  size: 'small',
  zIndex: 3000
}

// 挂载应用
app.mount('#app')