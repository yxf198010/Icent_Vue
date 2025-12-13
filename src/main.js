import { createApp } from 'vue'
import LowcodeDesigner from './components/LowcodeDesigner.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'

// ===================== 核心优化：防止重复挂载 =====================
// 全局实例缓存，用于卸载旧实例
let globalAppInstance = null

// ===================== 日志辅助函数（增强样式） =====================
const log = (type, msg, data) => {
  const colorMap = {
    info: '#409EFF',
    success: '#67C23A',
    warning: '#E6A23C',
    error: '#F56C6C'
  }
  console.log(
    `%c [Vue 初始化] ${msg}`,
    `color: ${colorMap[type]}; font-weight: bold`,
    data || ''
  )
}

// ===================== 初始化前置检查 =====================
log('info', '开始创建应用实例')
const appContainer = document.getElementById('app')
log('info', `挂载目标容器 #app 是否存在: ${!!appContainer}`)
log('info', `Element Plus 插件是否加载: ${!!ElementPlus}`)
log('info', `LowcodeDesigner 组件是否加载: ${!!LowcodeDesigner}`)

// ===================== 卸载旧实例（关键修复） =====================
if (window.VueAppInstance) {
  log('warning', '检测到已有应用实例，先卸载旧实例')
  window.VueAppInstance.unmount()
  window.VueAppInstance = null
  globalAppInstance = null
}

// ===================== 创建唯一Vue实例（整合所有配置） =====================
try {
  // 统一创建App实例（替换原有的双实例逻辑）
  globalAppInstance = createApp(App)
  log('success', '应用实例创建成功')
} catch (createError) {
  log('error', '应用实例创建失败', createError)
  throw createError
}

// ===================== 统一配置插件（整合所有配置） =====================
try {
  // 1. 安装Element Plus
  globalAppInstance.use(ElementPlus)
  log('success', 'Element Plus 插件安装成功')

  // 2. 全局配置Element Plus
  globalAppInstance.config.globalProperties.$ELEMENT = {
    size: 'small',
    zIndex: 3000
  }
  log('success', 'Element Plus 全局配置完成')

  // 3. 注册所有Element Plus图标（修复原代码图标缺失问题）
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    globalAppInstance.component(key, component)
  }
  log('success', 'Element Plus 图标全局注册完成')

  // 4. 安装路由（修复原代码路由仅在第二个实例安装的问题）
  globalAppInstance.use(router)
  log('success', '路由插件安装成功')

  // 5. 全局错误处理器（增强版）
  globalAppInstance.config.errorHandler = (err, instance, info) => {
    log('error', '全局错误捕获', { err, instance, info })
    try {
      const { ElMessage } = require('element-plus')
      ElMessage.error(`系统出错：${err.message || '未知错误'}`)
    } catch (e) {
      log('warning', 'Element Plus 消息组件加载失败，无法展示错误提示', e)
    }
  }
  log('success', '全局错误处理器已注册')

} catch (configError) {
  log('error', '插件/配置安装失败', configError)
  throw configError
}

// ===================== 增强型挂载逻辑（保留原重试机制） =====================
const mountApp = (retryCount = 0, maxRetries = 10, retryDelay = 200) => {
  if (retryCount >= maxRetries) {
    log('error', '挂载失败：超过最大重试次数')
    // 创建错误提示DOM
    const errorElement = document.createElement('div')
    errorElement.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      padding: 20px;
      background: #fef0f0;
      border: 1px solid #f56c6c;
      border-radius: 4px;
      color: #f56c6c;
      font-family: sans-serif;
      z-index: 9999;
    `
    errorElement.innerHTML = `
      <h3>Vue 应用挂载失败</h3>
      <p>无法找到 #app 容器或挂载超时</p>
      <p>请检查：</p>
      <ul>
        <li>Django 模板中是否包含 &lt;div id="app"&gt;&lt;/div&gt;</li>
        <li>JS 脚本是否在 DOM 加载完成后执行</li>
        <li>是否有重复的 #app 元素 ID</li>
      </ul>
    `
    document.body.appendChild(errorElement)
    return
  }

  const targetContainer = document.getElementById('app')
  
  if (targetContainer) {
    try {
      // 清空容器内容，避免残留
      targetContainer.innerHTML = ''
      // 挂载唯一实例
      globalAppInstance.mount(targetContainer)
      
      log('success', '挂载成功！', {
        container: targetContainer,
        containerId: targetContainer.id,
        containerClass: targetContainer.className,
        containerPosition: targetContainer.getBoundingClientRect()
      })
      
      // 延迟验证挂载内容
      setTimeout(() => {
        const mountedContent = targetContainer.innerHTML
        if (mountedContent.trim() === '') {
          log('warning', '挂载警告：容器已挂载但内容为空')
          log('info', '请检查 App 组件或 LowcodeDesigner 组件是否有模板内容')
        } else {
          log('success', '验证通过：组件内容已渲染')
        }
      }, 500)
      
    } catch (mountError) {
      log('error', '挂载失败：挂载过程出错', mountError)
      log('warning', `第 ${retryCount + 1} 次重试...`)
      setTimeout(() => mountApp(retryCount + 1, maxRetries, retryDelay), retryDelay)
    }
  } else {
    log('warning', `第 ${retryCount + 1} 次重试：未找到 #app 容器`)
    setTimeout(() => mountApp(retryCount + 1, maxRetries, retryDelay), retryDelay)
  }
}

// ===================== 触发挂载（确保DOM加载完成） =====================
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp()
} else {
  document.addEventListener('DOMContentLoaded', mountApp)
  window.addEventListener('load', () => {
    log('info', '页面完全加载完成')
    mountApp()
  })
}

// ===================== 全局暴露实例（便于调试/卸载） =====================
window.VueAppInstance = globalAppInstance
log('info', '初始化流程完成，应用实例已暴露到 window.VueAppInstance')

// ===================== 路由钩子（保留原日志逻辑） =====================
router.afterEach((to, from) => {
  log('info', `路由切换：${from.path} -> ${to.path}`)
  const appContent = document.getElementById('app')?.innerHTML
  if (appContent && appContent.trim().length > 0) {
    log('success', '路由切换验证：组件内容已渲染')
  } else {
    log('warning', '路由切换警告：容器内无渲染内容')
  }
})