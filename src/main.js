import { createApp } from 'vue'
import LowcodeDesigner from './components/LowcodeDesigner.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'

console.log('%c [Vue 初始化] 开始创建应用实例', 'color: #409EFF; font-weight: bold')
console.log('挂载目标容器 #app 是否存在:', !!document.getElementById('app'))
console.log('Element Plus 插件是否加载:', !!ElementPlus)
console.log('LowcodeDesigner 组件是否加载:', !!LowcodeDesigner)

let appInstance = null
try {
  appInstance = createApp(LowcodeDesigner)
  console.log('%c [Vue 初始化] 应用实例创建成功', 'color: #67C23A; font-weight: bold')
} catch (createError) {
  console.error('%c [Vue 初始化] 应用实例创建失败', 'color: #F56C6C; font-weight: bold', createError)
  throw createError
}

try {
  // 安装 Element Plus 插件
  appInstance.use(ElementPlus)
  console.log('%c [Vue 配置] Element Plus 插件安装成功', 'color: #67C23A; font-weight: bold')
  
  // 全局配置 Element Plus
  appInstance.config.globalProperties.$ELEMENT = {
    size: 'small',
    zIndex: 3000
  }
  console.log('%c [Vue 配置] Element Plus 全局配置完成', 'color: #67C23A; font-weight: bold')

  // 全局错误处理
  appInstance.config.errorHandler = (err, instance, info) => {
    console.error('%c [Vue 全局错误]', 'color: #F56C6C; font-weight: bold', { err, instance, info })
    try {
      const { ElMessage } = require('element-plus')
      ElMessage.error(`系统出错：${err.message || '未知错误'}`)
    } catch (e) {
      console.warn('Element Plus 消息组件加载失败，无法展示错误提示', e)
    }
  }
  console.log('%c [Vue 配置] 全局错误处理器已注册', 'color: #67C23A; font-weight: bold')

} catch (configError) {
  console.error('%c [Vue 配置] 插件/配置安装失败', 'color: #F56C6C; font-weight: bold', configError)
  throw configError
}

// 增强型挂载逻辑
const mountApp = (retryCount = 0, maxRetries = 10, retryDelay = 200) => {
  if (retryCount >= maxRetries) {
    console.error('%c [Vue 挂载] 失败：超过最大重试次数', 'color: #F56C6C; font-weight: bold')
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

  const appContainer = document.getElementById('app')
  
  if (appContainer) {
    try {
      appContainer.innerHTML = ''
      appInstance.mount(appContainer)
      console.log('%c [Vue 挂载] 成功！', 'color: #67C23A; font-weight: bold', {
        container: appContainer,
        containerId: appContainer.id,
        containerClass: appContainer.className,
        containerPosition: appContainer.getBoundingClientRect()
      })
      
      setTimeout(() => {
        const mountedContent = appContainer.innerHTML
        if (mountedContent.trim() === '') {
          console.warn('%c [Vue 挂载] 警告：容器已挂载但内容为空', 'color: #E6A23C; font-weight: bold')
          console.log('请检查 LowcodeDesigner 组件是否有模板内容')
        } else {
          console.log('%c [Vue 挂载] 验证通过：组件内容已渲染', 'color: #67C23A; font-weight: bold')
        }
      }, 500)
      
    } catch (mountError) {
      console.error('%c [Vue 挂载] 失败：挂载过程出错', 'color: #F56C6C; font-weight: bold', mountError)
      console.log(`%c [Vue 挂载] 第 ${retryCount + 1} 次重试...`, 'color: #E6A23C; font-weight: bold')
      setTimeout(() => mountApp(retryCount + 1, maxRetries, retryDelay), retryDelay)
    }
  } else {
    console.log(`%c [Vue 挂载] 第 ${retryCount + 1} 次重试：未找到 #app 容器`, 'color: #E6A23C; font-weight: bold')
    setTimeout(() => mountApp(retryCount + 1, maxRetries, retryDelay), retryDelay)
  }
}

// 启动挂载逻辑
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  mountApp()
} else {
  document.addEventListener('DOMContentLoaded', mountApp)
  window.addEventListener('load', () => {
    console.log('%c [Vue 初始化] 页面完全加载完成', 'color: #409EFF; font-weight: bold')
    mountApp()
  })
}

// 全局暴露应用实例
window.VueAppInstance = appInstance
console.log('%c [Vue 初始化] 初始化流程完成，应用实例已暴露到 window.VueAppInstance', 'color: #409EFF; font-weight: bold')