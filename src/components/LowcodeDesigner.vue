<!-- src/components/LowcodeDesigner.vue -->
<template>
  <div class="lowcode-designer">
    <!-- 头部区域 -->
    <header class="designer-header">
      <div class="header-content">
        <el-icon class="logo-icon"><HomeFilled /></el-icon>
        <h2 class="logo-text">Icent 工业低代码平台</h2>
        <div class="header-buttons">
          <!-- 修复：图标改用组件标签形式，而非 :icon 变量形式 -->
          <el-button type="primary" @click="saveConfig">
            <el-icon><Save /></el-icon>
            保存配置
          </el-button>
          <el-button type="success" @click="previewForm">
            <el-icon><View /></el-icon>
            预览表单
          </el-button>
          <el-button type="info" @click="loadConfig">
            <el-icon><Upload /></el-icon>
            加载配置
          </el-button>
        </div>
      </div>
    </header>

    <!-- 主体区域：左侧组件库 + 中间画布 + 右侧属性面板 -->
    <main class="designer-main">
      <!-- 左侧组件库 -->
      <aside class="component-library">
        <h3 class="library-title">工业组件库</h3>
        <div class="component-tabs">
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
          <!-- 基础组件列表 -->
          <div v-if="activeTab === 'basic'" class="component-list">
            <div 
              v-for="item in basicComponents" 
              :key="item.id"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragEnd"
              title="拖拽到画布添加组件"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="component-name">{{ item.name }}</span>
            </div>
          </div>

          <!-- 工业组件列表 -->
          <div v-if="activeTab === 'industrial'" class="component-list">
            <div 
              v-for="item in industrialComponents" 
              :key="item.id"
              class="component-item"
              draggable="true"
              @dragstart="handleDragStart(item)"
              @dragend="handleDragEnd"
              title="拖拽到画布添加组件"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.icon" />
              </el-icon>
              <span class="component-name">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 中间设计画布 -->
      <section class="canvas-container">
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
              <div class="component-info">
                <el-icon :size="20" class="canvas-component-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span class="canvas-component-name">{{ item.name }}</span>
                <span class="canvas-component-type">({{ item.type }})</span>
              </div>
              <el-button 
                size="small" 
                type="danger"
                class="delete-btn"
                @click.stop="deleteComponent(index)"
                title="删除组件"
              >
                <el-icon><CircleClose /></el-icon>
              </el-button>
            </div>
          </div>

          <!-- 画布空状态 -->
          <div v-if="canvasComponents.length === 0" class="canvas-empty">
            <el-icon class="empty-icon"><Operation /></el-icon>
            <p class="empty-text">从左侧组件库拖拽组件到此处开始设计</p>
          </div>
        </div>
      </section>

      <!-- 右侧属性面板 -->
      <aside class="property-panel">
        <h3 class="panel-title">组件属性</h3>
        <div v-if="!selectedComponent.id" class="panel-empty">
          <el-empty description="请在画布中选中一个组件" />
        </div>
        <div v-else class="panel-content">
          <el-form 
            :model="selectedComponent" 
            label-width="80px" 
            size="small"
            @submit.prevent
          >
            <el-form-item label="组件名称" prop="name">
              <el-input 
                v-model="selectedComponent.name" 
                @input="updateComponent" 
                placeholder="请输入组件名称"
              />
            </el-form-item>
            <el-form-item label="字段标识" prop="key">
              <el-input 
                v-model="selectedComponent.key" 
                @input="updateComponent" 
                placeholder="请输入唯一字段标识"
              />
            </el-form-item>
            <el-form-item label="是否必填" prop="required">
              <el-switch 
                v-model="selectedComponent.required" 
                @change="updateComponent" 
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="默认值" prop="defaultValue">
              <el-input 
                v-model="selectedComponent.defaultValue" 
                @input="updateComponent" 
                placeholder="请输入默认值"
              />
            </el-form-item>
            <el-form-item 
              v-if="['number', 'temperature'].includes(selectedComponent.type)"
              label="单位"
              prop="unit"
            >
              <el-input 
                v-model="selectedComponent.unit" 
                @input="updateComponent" 
                placeholder="如：℃、mm、kg 等"
              />
            </el-form-item>
          </el-form>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
// 确保导入语句完整且无语法错误
import { ref, onMounted, defineProps, watch, defineExpose } from 'vue'
import { ElMessage, ElMessageBox, ElEmpty, ElIcon } from 'element-plus'

// 定义 props 接收初始化画布组件（供父组件传递历史配置）
const props = defineProps({
  initCanvasComponents: {
    type: Array,
    default: () => []
  }
})

// ===== 组件库定义 =====
const basicComponents = ref([
  { id: 1, name: '文本输入框', type: 'text', key: 'textInput', icon: 'Edit', required: false, defaultValue: '', unit: '' },
  { id: 2, name: '数值输入框', type: 'number', key: 'numberInput', icon: 'DataAnalysis', required: false, defaultValue: '', unit: '' },
  { id: 3, name: '日期选择器', type: 'date', key: 'datePicker', icon: 'Calendar', required: false, defaultValue: '', unit: '' },
  { id: 4, name: '下拉选择器', type: 'select', key: 'selectInput', icon: 'Bottom', required: false, defaultValue: '', options: [], unit: '' },
  { id: 5, name: '复选框', type: 'checkbox', key: 'checkbox', icon: 'Checked', required: false, defaultValue: false, unit: '' }
])

const industrialComponents = ref([
  { id: 6, name: '温度输入框', type: 'temperature', key: 'temperature', icon: 'HotWater', required: true, defaultValue: '', unit: '℃' },
  { id: 7, name: '设备选择器', type: 'device', key: 'deviceSelect', icon: 'Setting', required: true, defaultValue: '', options: ['设备1', '设备2'], unit: '' },
  { id: 8, name: '批次输入框', type: 'batch', key: 'batchId', icon: 'Grid', required: true, defaultValue: '', unit: '' }
])

// ===== 响应式状态管理 =====
const activeTab = ref('basic') // 当前激活的组件库标签
const draggingComponent = ref(null) // 正在拖拽的组件
const canvasComponents = ref([]) // 画布中的组件列表
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
}) // 当前选中的组件

// 监听 props 变化，加载初始化数据（支持编辑页加载历史配置）
watch(() => props.initCanvasComponents, (newVal) => {
  if (newVal && newVal.length > 0) {
    // 深拷贝避免修改父组件数据
    canvasComponents.value = JSON.parse(JSON.stringify(newVal))
    ElMessage.success('已加载历史表单配置！')
  }
}, { immediate: true })

// ===== 生命周期钩子 =====
onMounted(() => {
  // 页面加载时尝试从本地存储加载配置（仅新建页面生效，编辑页由 props 覆盖）
  if (props.initCanvasComponents.length === 0) {
    loadConfig()
  }
})

// ===== 拖拽逻辑 =====
const handleDragStart = (item) => {
  // 深拷贝组件，避免修改原数据，生成唯一 ID
  draggingComponent.value = JSON.parse(JSON.stringify(item))
  draggingComponent.value.id = Date.now() + Math.floor(Math.random() * 1000) // 增强唯一性
  // 设置拖拽数据（增强兼容性）
  if (event?.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify(draggingComponent.value))
  }
}

const handleDragEnd = () => {
  // 拖拽结束清空状态
  draggingComponent.value = null
}

const handleDrop = () => {
  if (draggingComponent.value) {
    // 添加组件到画布
    canvasComponents.value.push(draggingComponent.value)
    ElMessage.success(`已添加「${draggingComponent.value.name}」组件`)
    draggingComponent.value = null
  }
}

// ===== 画布交互逻辑 =====
const selectComponent = (item, index) => {
  // 选中组件，记录索引
  selectedComponent.value = { ...item, index }
}

const updateComponent = () => {
  // 更新画布中的组件属性
  const idx = selectedComponent.value.index
  if (idx >= 0 && idx < canvasComponents.value.length) {
    canvasComponents.value[idx] = { ...selectedComponent.value }
    ElMessage.info('组件属性已更新')
  }
}

const deleteComponent = (index) => {
  // 删除画布中的组件
  ElMessageBox.confirm(
    '确定要删除该组件吗？此操作不可撤销！',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    canvasComponents.value.splice(index, 1)
    // 如果删除的是当前选中的组件，清空选中状态
    if (selectedComponent.value.index === index) {
      selectedComponent.value = { id: '' }
    }
    ElMessage.success('组件已删除')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// ===== 配置操作逻辑 =====
const saveConfig = () => {
  // 保存配置到本地存储
  if (canvasComponents.value.length === 0) {
    return ElMessage.warning('请先添加组件再保存！')
  }
  try {
    localStorage.setItem('icentFormConfig', JSON.stringify(canvasComponents.value))
    ElMessage.success('表单配置已成功保存到本地！')
  } catch (error) {
    ElMessage.error('保存失败：' + error.message)
  }
}

const loadConfig = () => {
  // 从本地存储加载配置
  try {
    const savedConfig = localStorage.getItem('icentFormConfig')
    if (savedConfig) {
      canvasComponents.value = JSON.parse(savedConfig)
      ElMessage.success('已加载本地保存的配置！')
    } else {
      ElMessage.info('暂无本地配置，可开始创建新表单')
    }
  } catch (error) {
    ElMessage.error('加载配置失败：' + error.message)
  }
}

const previewForm = () => {
  // 预览表单配置
  if (canvasComponents.value.length === 0) {
    return ElMessage.warning('请先添加组件再预览！')
  }
  ElMessageBox.alert(
    `<pre style="text-align: left; max-height: 60vh; overflow-y: auto;">${JSON.stringify(canvasComponents.value, null, 2)}</pre>`,
    '表单结构预览',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭',
      customClass: 'form-preview-modal'
    }
  )
}

// 暴露内部数据和方法给父组件（如编辑页通过 ref 访问）
defineExpose({
  canvasComponents,
  saveConfig,
  loadConfig,
  previewForm
})
</script>

<style scoped>
/* 设计器整体布局 */
.lowcode-designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: #f5f7fa;
  overflow: hidden;
}

/* 头部样式 */
.designer-header {
  background-color: #1989fa;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
  width: 100%;
  box-sizing: border-box;
}

.logo-icon {
  margin-right: 10px;
  font-size: 20px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
}

.header-buttons {
  display: flex;
  gap: 10px;
}

/* 主体布局：响应式网格 */
.designer-main {
  display: grid;
  grid-template-columns: minmax(240px, 280px) 1fr minmax(280px, 320px);
  gap: 10px;
  padding: 10px;
  flex: 1;
  overflow: hidden;
  width: 100%;
  box-sizing: border-box;
}

/* 左侧组件库样式 */
.component-library {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.library-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #f0f0f0;
}

.component-tabs {
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
  transition: all 0.2s;
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
  transition: background-color 0.2s;
}

.component-item:hover {
  background-color: #e8f4f8;
}

.component-icon {
  color: #1989fa;
}

/* 画布样式 */
.canvas-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.2s;
}

.canvas-component.selected {
  border: 2px solid #1989fa;
  box-shadow: 0 2px 8px rgba(25, 137, 250, 0.2);
}

.canvas-component:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.component-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.canvas-component-icon {
  color: #1989fa;
}

.canvas-component-type {
  font-size: 12px;
  color: #999;
  margin-left: 5px;
}

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
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 10px;
  color: #ccc;
}

.empty-text {
  font-size: 14px;
}

/* 属性面板样式 */
.property-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
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
  padding: 20px;
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

/* 预览弹窗样式 */
:deep(.form-preview-modal .el-message-box__content) {
  padding: 0;
}

:deep(.form-preview-modal pre) {
  margin: 0;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

/* 响应式适配：小屏幕下调整布局 */
@media (max-width: 1200px) {
  .designer-main {
    grid-template-columns: minmax(200px, 240px) 1fr minmax(240px, 280px);
  }
}

@media (max-width: 768px) {
  .designer-main {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    overflow-y: auto;
  }

  .component-library, .property-panel {
    height: auto;
    max-height: 200px;
  }

  .canvas-container {
    height: 400px;
  }

  .header-content {
    flex-direction: column;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .header-buttons {
    width: 100%;
    justify-content: center;
  }
}
</style>