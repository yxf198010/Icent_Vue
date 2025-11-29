// src/main.js
import { createApp } from 'vue'
import App from './App.vue'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// ✅ 只导入 Element Plus 官方存在的图标（2025年确认可用）
import {
  HomeFilled,
  Edit,
  DataAnalysis,
  Calendar,
  Bottom,
  Checked,
  HotWater,       // 替代不存在的 Thermometer
  Setting,
  Grid,
  Operation,      // 替代不存在的 Drag
  CircleClose
} from '@element-plus/icons-vue'

const app = createApp(App)

// 使用 Element Plus
app.use(ElementPlus)

// 全局注册图标组件（模板中可直接用 <HotWater /> 等）
app.component('HomeFilled', HomeFilled)
app.component('Edit', Edit)
app.component('DataAnalysis', DataAnalysis)
app.component('Calendar', Calendar)
app.component('Bottom', Bottom)
app.component('Checked', Checked)
app.component('HotWater', HotWater)
app.component('Setting', Setting)
app.component('Grid', Grid)
app.component('Operation', Operation)
app.component('CircleClose', CircleClose)

// 挂载应用
app.mount('#app')