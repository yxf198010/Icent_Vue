<template>
  <div class="lowcode-designer">
    <!-- 头部 -->
    <header class="designer-header">
      <div class="header-content">
        <el-icon class="logo-icon"><HomeFilled /></el-icon>
        <h2 class="logo-text">Icent 工业低代码平台</h2>
        <div class="header-buttons">
          <el-button type="primary" @click="saveConfig">保存配置</el-button>
          <el-button type="success" @click="previewForm">预览表单</el-button>
        </div>
      </div>
    </header>

    <!-- 主体区域 -->
    <main class="designer-main">
      <!-- 左侧组件库 -->
      <div class="component-library">
        <h3 class="library-title">工业组件库</h3>
        <div class="component-tabs-native">
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'basic' }"
            @click="activeTab = 'basic'"
          >
            基础组件
          </button>
          <button 
            class="tab-btn" 
            :class="{ active: activeTab === 'industrial' }"
            @click="activeTab = 'industrial'"
          >
            工业组件
          </button>
        </div>
        <div class="component-list-container">
          <!-- 基础组件 -->
          <div v-if="activeTab === 'basic'" class="component-list">
            <div 
              v-for="item in basicComponents" 
              :key="item.id"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragEnd"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="component-name">{{ item.name }}</span>
            </div>
          </div>

          <!-- 工业组件 -->
          <div v-if="activeTab === 'industrial'" class="component-list">
            <div 
              v-for="item in industrialComponents" 
              :key="item.id"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragEnd"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="component-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 画布 -->
      <div class="canvas-container">
        <h3 class="canvas-title">设计画布（拖拽组件到此处）</h3>
        <div 
          class="canvas"
          @dragover.prevent
          @drop="handleDrop"
        >
          <div class="canvas-list">
            <div 
              v-for="(item, index) in canvasComponents" 
              :key="item.id"
              class="canvas-component"
              :class="{ selected: selectedComponent.id === item.id }"
              @click="selectComponent(item, index)"
            >
              <el-icon :size="20" class="canvas-component-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="canvas-component-name">{{ item.name }}</span>
              <el-button 
                size="small" 
                type="danger"
                :icon="CircleClose"
                class="delete-btn"
                @click.stop="deleteComponent(index)"
              />
            </div>
          </div>

          <!-- 空状态提示 -->
          <div v-if="canvasComponents.length === 0" class="canvas-empty">
            <el-icon class="empty-icon"><Operation /></el-icon>
            <p class="empty-text">从左侧组件库拖拽组件到此处开始设计</p>
          </div>
        </div>
      </div>

      <!-- 属性面板 -->
      <div class="property-panel">
        <h3 class="panel-title">组件属性</h3>
        <div v-if="!selectedComponent.id" class="panel-empty">
          <p>请在画布中选中一个组件</p>
        </div>
        <div v-else class="panel-content">
          <el-form :model="selectedComponent" label-width="80px" size="small">
            <el-form-item label="组件名称">
              <el-input v-model="selectedComponent.name" @input="updateComponent" />
            </el-form-item>
            <el-form-item label="字段标识">
              <el-input v-model="selectedComponent.key" @input="updateComponent" />
            </el-form-item>
            <el-form-item label="是否必填">
              <el-switch v-model="selectedComponent.required" @change="updateComponent" />
            </el-form-item>
            <el-form-item label="默认值">
              <el-input v-model="selectedComponent.defaultValue" @input="updateComponent" />
            </el-form-item>
            <el-form-item 
              v-if="selectedComponent.type === 'number' || selectedComponent.type === 'temperature'"
              label="单位"
            >
              <el-input v-model="selectedComponent.unit" @input="updateComponent" />
            </el-form-item>
          </el-form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// ===== 组件定义（图标名必须与 main.js 中注册的一致）=====
const basicComponents = ref([
  { id: 1, name: '文本输入框', type: 'text', key: 'textInput', icon: 'Edit', required: false, defaultValue: '' },
  { id: 2, name: '数值输入框', type: 'number', key: 'numberInput', icon: 'DataAnalysis', required: false, defaultValue: '', unit: '' },
  { id: 3, name: '日期选择器', type: 'date', key: 'datePicker', icon: 'Calendar', required: false, defaultValue: '' },
  { id: 4, name: '下拉选择器', type: 'select', key: 'selectInput', icon: 'Bottom', required: false, defaultValue: '', options: [] },
  { id: 5, name: '复选框', type: 'checkbox', key: 'checkbox', icon: 'Checked', required: false, defaultValue: false }
])

const industrialComponents = ref([
  { id: 6, name: '温度输入框', type: 'temperature', key: 'temperature', icon: 'HotWater', required: true, defaultValue: '', unit: '℃' }, // ← 使用 HotWater
  { id: 7, name: '设备选择器', type: 'device', key: 'deviceSelect', icon: 'Setting', required: true, defaultValue: '', options: ['设备1', '设备2'] },
  { id: 8, name: '批次输入框', type: 'batch', key: 'batchId', icon: 'Grid', required: true, defaultValue: '', unit: '' }
])

// ===== 响应式状态 =====
const activeTab = ref('basic')
const draggingComponent = ref(null)
const canvasComponents = ref([])
const selectedComponent = ref({
  id: '',
  name: '',
  type: '',
  key: '',
  required: false,
  defaultValue: '',
  unit: '',
  options: [],
  index: -1
})

// ===== 拖拽逻辑 =====
const handleDragStart = (item) => {
  draggingComponent.value = JSON.parse(JSON.stringify(item))
  draggingComponent.value.id = Date.now()
}
const handleDragEnd = () => {
  draggingComponent.value = null
}
const handleDrop = () => {
  if (draggingComponent.value) {
    canvasComponents.value.push(draggingComponent.value)
    draggingComponent.value = null
  }
}

// ===== 画布交互 =====
const selectComponent = (item, index) => {
  selectedComponent.value = { ...item, index }
}
const updateComponent = () => {
  const idx = selectedComponent.value.index
  if (idx >= 0 && idx < canvasComponents.value.length) {
    canvasComponents.value[idx] = { ...selectedComponent.value }
  }
}
const deleteComponent = (index) => {
  canvasComponents.value.splice(index, 1)
  if (selectedComponent.value.index === index) {
    selectedComponent.value = { id: '' }
  }
}

// ===== 操作 =====
const saveConfig = () => {
  if (canvasComponents.value.length === 0) return ElMessage.warning('请先添加组件再保存！')
  localStorage.setItem('formConfig', JSON.stringify(canvasComponents.value))
  ElMessage.success('表单配置已保存到本地！')
}
const previewForm = () => {
  if (canvasComponents.value.length === 0) return ElMessage.warning('请先添加组件再预览！')
  ElMessageBox.alert(
    `<pre>${JSON.stringify(canvasComponents.value, null, 2)}</pre>`,
    '表单结构预览',
    { dangerouslyUseHTMLString: true }
  )
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body, #app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.lowcode-designer {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  background-color: #f5f7fa;
}

/* 头部 */
.designer-header {
  background-color: #1989fa;
  color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}
.logo-icon { margin-right: 10px; font-size: 20px; }
.logo-text { font-size: 18px; font-weight: 600; }
.header-buttons { display: flex; gap: 10px; }

/* 主体布局 */
.designer-main {
  display: grid;
  grid-template-columns: 280px 1fr 320px;
  gap: 10px;
  padding: 10px;
  flex: 1;
  overflow: hidden;
}

/* 左侧组件库 */
.component-library {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.library-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
.component-tabs-native {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid #f0f0f0;
}
.tab-btn {
  flex: 1;
  padding: 8px 0;
  background: #f5f7fa;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}
.tab-btn.active {
  background: #1989fa;
  color: white;
}
.tab-btn:hover:not(.active) {
  background: #e8f4f8;
  color: #1989fa;
}
.component-list-container {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  min-height: 0;
}
.component-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: move;
}
.component-icon { color: #1989fa; }

/* 画布 */
.canvas-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.canvas-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
.canvas {
  flex: 1;
  padding: 20px;
  background: #fafafa;
  position: relative;
  overflow-y: auto;
}
.canvas-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.canvas-component {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 14px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  cursor: pointer;
}
.canvas-component.selected {
  border: 2px solid #1989fa;
  box-shadow: 0 2px 8px rgba(25,137,250,0.2);
}
.canvas-component-icon { color: #1989fa; }
.delete-btn {
  opacity: 0;
  transition: opacity 0.2s;
  padding: 6px !important;
}
.canvas-component:hover .delete-btn {
  opacity: 1;
}
.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #999;
}
.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  color: #ccc;
}

/* 属性面板 */
.property-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.panel-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}
.panel-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
}
.panel-content {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
}
.el-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* 滚动条美化 */
*::-webkit-scrollbar { width: 6px; height: 6px; }
*::-webkit-scrollbar-thumb { background: #dcdfe6; border-radius: 3px; }
</style>