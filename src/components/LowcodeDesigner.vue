<template>
  <div class="lowcode_designer">
    <!-- 头部区域 -->
    <header class="designer-header">
      <div class="header-content">
        <!-- 左侧：Logo图标 -->
        <div class="header-left">
          <el-icon class="logo-icon">
            <component :is="'Document'" />
          </el-icon>
        </div>
        <!-- 中间：标题居中 -->
        <div class="header-title">
          <h2 class="logo-text">Icent 工业低代码平台</h2>
        </div>
        <!-- 右侧：操作按钮 -->
        <div class="header-buttons">
          <!-- 保存配置 -->
          <el-button type="primary" @click="saveConfig" class="custom-header-btn">
            <el-icon class="btn-icon">
              <component :is="'DocumentChecked'" />
            </el-icon>
            <span>保存配置</span>
          </el-button>
          <!-- 预览表单 -->
          <el-button type="success" @click="previewForm" class="custom-header-btn">
            <el-icon class="btn-icon">
              <component :is="'View'" />
            </el-icon>
            <span>预览表单</span>
          </el-button>
          <!-- 加载配置 -->
          <el-button type="info" @click="loadConfig" class="custom-header-btn">
            <el-icon class="btn-icon">
              <component :is="'Upload'" />
            </el-icon>
            <span>加载配置</span>
          </el-button>
          <!-- 清空配置 -->
          <el-button type="warning" @click="clearConfig" class="custom-header-btn">
            <el-icon class="btn-icon">
              <component :is="'Delete'" />
            </el-icon>
            <span>清空配置</span>
          </el-button>
          <!-- 导出JSON -->
          <el-button type="default" @click="exportConfig" class="custom-header-btn export-btn">
            <el-icon class="btn-icon">
              <component :is="'Download'" />
            </el-icon>
            <span>导出JSON</span>
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
              :class="{ dragging: isDragging && draggingComponentId === item.id }"
              draggable="true"
              @dragstart="(e) => handleDragStart(e, item)"
              @dragend="handleDragEnd"
              title="拖拽到画布添加组件"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.iconName" />
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
              :class="{ dragging: isDragging && draggingComponentId === item.id }"
              draggable="true"
              @dragstart="(e) => handleDragStart(e, item)"
              @dragend="handleDragEnd"
              title="拖拽到画布添加组件"
            >
              <el-icon :size="18" class="component-icon">
                <component :is="item.iconName" />
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
          :class="{ 'drag-over': isDragOver }"
          @dragover.prevent
          @dragenter.prevent="isDragOver = true"
          @dragleave.prevent="isDragOver = false"
          @drop="(e) => { handleDrop(e); isDragOver = false }"
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
                  <component :is="item.iconName" />
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
                <el-icon>
                  <component :is="'CircleClose'" />
                </el-icon>
              </el-button>
            </div>
          </div>

          <!-- 画布空状态 -->
          <div v-if="canvasComponents.length === 0" class="designer-empty canvas-empty">
            <el-icon class="designer-empty-icon empty-icon">
              <component :is="'Document'" />
            </el-icon>
            <p class="designer-empty-text empty-text">从左侧组件库拖拽组件到此处开始设计</p>
          </div>
        </div>
      </section>

      <!-- 右侧属性面板 -->
      <aside class="property-panel">
        <h3 class="panel-title">组件属性</h3>
        <div v-if="!selectedComponent.id" class="panel-empty designer-empty">
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
                @input="debouncedUpdateComponent" 
                placeholder="请输入组件名称"
              />
            </el-form-item>
            <el-form-item label="字段标识" prop="key">
              <el-input 
                v-model="selectedComponent.key" 
                @input="debouncedUpdateComponent" 
                placeholder="请输入唯一字段标识"
              />
            </el-form-item>
            <el-form-item label="是否必填" prop="required">
              <el-switch 
                v-model="selectedComponent.required" 
                @change="debouncedUpdateComponent" 
                active-text="是"
                inactive-text="否"
              />
            </el-form-item>
            <el-form-item label="默认值" prop="defaultValue">
              <el-input 
                v-model="selectedComponent.defaultValue" 
                @input="debouncedUpdateComponent" 
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
                @input="debouncedUpdateComponent" 
                placeholder="如：℃、mm、kg 等"
              />
            </el-form-item>
            <!-- 下拉/设备选择器选项配置 -->
            <el-form-item 
              v-if="['select', 'device'].includes(selectedComponent.type)"
              label="选项配置"
              prop="optionsStr"
            >
              <el-input 
                v-model="selectedComponent.optionsStr" 
                @input="handleOptionsChange" 
                placeholder="多个选项用英文逗号分隔，如：选项1,选项2,选项3"
              />
            </el-form-item>
          </el-form>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, shallowRef, onMounted, defineProps, watch, defineExpose, computed } from 'vue'
import { ElMessage, ElMessageBox, ElEmpty, ElIcon, ElButton, ElInput, ElSwitch, ElForm, ElFormItem } from 'element-plus'
import { debounce } from 'lodash-es'

// ========== 类型定义 ==========
const COMPONENT_TYPES = {
  TEXT: 'text',
  NUMBER: 'number',
  DATE: 'date',
  SELECT: 'select',
  CHECKBOX: 'checkbox',
  TEMPERATURE: 'temperature',
  DEVICE: 'device',
  BATCH: 'batch'
}

const ICON_CONFIG = {
  [COMPONENT_TYPES.TEXT]: 'Edit',
  [COMPONENT_TYPES.NUMBER]: 'DataAnalysis',
  [COMPONENT_TYPES.DATE]: 'Calendar',
  [COMPONENT_TYPES.SELECT]: 'ArrowDown',
  [COMPONENT_TYPES.CHECKBOX]: 'Check',
  [COMPONENT_TYPES.TEMPERATURE]: 'DataAnalysis',
  [COMPONENT_TYPES.DEVICE]: 'Setting',
  [COMPONENT_TYPES.BATCH]: 'Grid'
}

// ========== 工具函数 ==========
const generateId = () => Date.now() + Math.floor(Math.random() * 1000)

const restoreComponentIcon = (component) => {
  const iconName = ICON_CONFIG[component.type] || 'Edit'
  return { ...component, iconName }
}

// ========== Props ==========
const props = defineProps({
  initCanvasComponents: {
    type: Array,
    default: () => []
  }
})

// ========== 组件数据 ==========
const basicComponents = shallowRef([
  { id: 1, name: '文本输入框', type: COMPONENT_TYPES.TEXT, key: 'textInput', required: false, defaultValue: '', unit: '', options: [], iconName: 'Edit' },
  { id: 2, name: '数值输入框', type: COMPONENT_TYPES.NUMBER, key: 'numberInput', required: false, defaultValue: '', unit: '', options: [], iconName: 'DataAnalysis' },
  { id: 3, name: '日期选择器', type: COMPONENT_TYPES.DATE, key: 'datePicker', required: false, defaultValue: '', unit: '', options: [], iconName: 'Calendar' },
  { id: 4, name: '下拉选择器', type: COMPONENT_TYPES.SELECT, key: 'selectInput', required: false, defaultValue: '', options: [], optionsStr: '', iconName: 'ArrowDown' },
  { id: 5, name: '复选框', type: COMPONENT_TYPES.CHECKBOX, key: 'checkbox', required: false, defaultValue: false, unit: '', options: [], iconName: 'Check' }
])

const industrialComponents = shallowRef([
  { id: 6, name: '温度输入框', type: COMPONENT_TYPES.TEMPERATURE, key: 'temperature', required: true, defaultValue: '', unit: '℃', options: [], optionsStr: '设备1,设备2', iconName: 'DataAnalysis' },
  { id: 7, name: '设备选择器', type: COMPONENT_TYPES.DEVICE, key: 'deviceSelect', required: true, defaultValue: '', options: ['设备1', '设备2'], optionsStr: '设备1,设备2', iconName: 'Setting' },
  { id: 8, name: '批次输入框', type: COMPONENT_TYPES.BATCH, key: 'batchId', required: true, defaultValue: '', unit: '', options: [], iconName: 'Grid' }
])

// ========== 响应式状态 ==========
const activeTab = ref('basic')
const isDragging = ref(false)
const draggingComponentId = ref(null)
const isDragOver = ref(false)
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
  optionsStr: '',
  index: -1,
  iconName: 'Edit'
})

// ========== 计算属性（用于双向绑定 optionsStr）==========
// 注意：我们不在 selectedComponent 上直接使用 computed，而是通过 handleOptionsChange 同步
// 因为 selectedComponent 是 ref 对象，computed 无法直接代理其内部属性

// ========== 拖拽 & 交互逻辑 ==========
const handleDragStart = (event, component) => {
  isDragging.value = true
  draggingComponentId.value = component.id
  event.dataTransfer.setData('text/plain', JSON.stringify(component))
  event.dataTransfer.effectAllowed = 'copy'
}

const handleDragEnd = () => {
  isDragging.value = false
  draggingComponentId.value = null
}

const handleDrop = (event) => {
  const data = event.dataTransfer.getData('text/plain')
  if (!data) return
  try {
    const parsed = JSON.parse(data)
    const newComponent = {
      ...parsed,
      id: generateId(),
      iconName: ICON_CONFIG[parsed.type] || 'Edit'
    }
    canvasComponents.value.push(newComponent)
    selectComponent(newComponent, canvasComponents.value.length - 1)
  } catch (err) {
    console.error('拖拽解析失败:', err)
    ElMessage.error('拖拽组件失败')
  }
}

const selectComponent = (component, index) => {
  selectedComponent.value = {
    ...component,
    index,
    optionsStr: component.options ? component.options.join(',') : ''
  }
}

const deleteComponent = (index) => {
  canvasComponents.value.splice(index, 1)
  if (selectedComponent.value.index === index) {
    selectedComponent.value = { id: '' }
  } else if (selectedComponent.value.index > index) {
    selectedComponent.value.index--
  }
}

// 更新画布中的组件（防抖）
const updateComponentInCanvas = () => {
  const idx = selectedComponent.value.index
  if (idx >= 0 && idx < canvasComponents.value.length) {
    // 同步 options
    if (['select', 'device'].includes(selectedComponent.value.type)) {
      canvasComponents.value[idx].options = selectedComponent.value.optionsStr
        ? selectedComponent.value.optionsStr.split(',').map(s => s.trim()).filter(Boolean)
        : []
    }
    // 更新其他字段
    Object.assign(canvasComponents.value[idx], {
      name: selectedComponent.value.name,
      key: selectedComponent.value.key,
      required: selectedComponent.value.required,
      defaultValue: selectedComponent.value.defaultValue,
      unit: selectedComponent.value.unit,
      optionsStr: selectedComponent.value.optionsStr
    })
  }
}

const debouncedUpdateComponent = debounce(() => {
  updateComponentInCanvas()
}, 300)

const handleOptionsChange = () => {
  // 不立即更新，等待防抖统一处理
  debouncedUpdateComponent()
}

// ========== 配置操作逻辑 ==========
const saveConfig = () => {
  localStorage.setItem('lowcode_form_config', JSON.stringify(canvasComponents.value))
  ElMessage.success('配置已保存到本地存储！')
}

const loadConfig = () => {
  const saved = localStorage.getItem('lowcode_form_config')
  if (saved) {
    try {
      const parsed = JSON.parse(saved).map(restoreComponentIcon)
      canvasComponents.value = parsed
      selectedComponent.value = { id: '' }
      ElMessage.success('已从本地加载配置！')
    } catch (err) {
      ElMessage.error('加载配置失败：' + err.message)
    }
  } else {
    ElMessage.info('暂无保存的配置')
  }
}

const previewForm = () => {
  ElMessageBox.alert(
    `<pre>${JSON.stringify(canvasComponents.value, null, 2)}</pre>`,
    '表单配置预览（JSON）',
    {
      dangerouslyUseHTMLString: true,
      confirmButtonText: '关闭'
    }
  )
}

const clearConfig = () => {
  ElMessageBox.confirm('确定要清空所有组件吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    canvasComponents.value = []
    selectedComponent.value = { id: '' }
    localStorage.removeItem('lowcode_form_config')
    ElMessage.success('配置已清空')
  }).catch(() => {})
}

const exportConfig = () => {
  const dataStr = JSON.stringify(canvasComponents.value, null, 2)
  const blob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lowcode_form_config.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ========== 监听初始化 ==========
watch(() => props.initCanvasComponents, (newVal) => {
  if (newVal && newVal.length > 0) {
    try {
      const copiedComponents = JSON.parse(JSON.stringify(newVal)).map(restoreComponentIcon)
      canvasComponents.value = copiedComponents
      ElMessage.success('已加载历史表单配置！')
    } catch (error) {
      console.error('加载初始化配置失败：', error)
      ElMessage.error('加载配置失败：' + error.message)
    }
  }
}, { immediate: true, deep: true })

onMounted(() => {
  console.log('%c [LowcodeDesigner] 组件已挂载', 'color: #409EFF; font-weight: bold')
  if (props.initCanvasComponents.length === 0) {
    loadConfig()
  }
})

// ========== 暴露方法 ==========
defineExpose({
  canvasComponents,
  saveConfig,
  loadConfig,
  previewForm,
  clearConfig,
  exportConfig,
  selectComponent,
  deleteComponent
})
</script>

<!-- 全局注册 Element Plus 图标 -->
<script>
import * as ElementPlusIcons from '@element-plus/icons-vue'

export default {
  components: {
    ...ElementPlusIcons
  }
}
</script>

<style scoped lang="scss">
.lowcode_designer {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

.designer-header {
  background: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  padding: 0;
  z-index: 100;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 60px;
}

.header-left .logo-icon {
  font-size: 24px;
  color: #409eff;
}

.header-title .logo-text {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.header-buttons {
  display: flex;
  gap: 12px;
}

.custom-header-btn {
  display: flex;
  align-items: center;
  gap: 6px;

  &.export-btn {
    // 强制移除默认边框（包括 hover 前后）
    border: none !important;
    background-color: #c5d8f5;
    color: #ffffff;

    &:hover {
      background-color: #e9effa;
      color: #ffffff;
      border: none !important; // 再次强调无边框
    }

    // 防止 focus 时出现 outline 或边框（可选）
    &:focus,
    &:active {
      border: none !important;
      outline: none;
    }
  }
}

.btn-icon {
  font-size: 16px;
}

.designer-main {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.component-library, .property-panel {
  width: 240px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
}

.library-title, .panel-title {
  padding: 12px 16px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid #eee;
}

.component-tabs {
  padding: 8px 16px;
  display: flex;
  gap: 8px;
}

.tab-btn {
  flex: 1;
  padding: 6px 0;
  border: none;
  background: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
}

.tab-btn.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.component-list-container {
  flex: 1;
  overflow-y: auto;
  padding: 0 8px;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 12px 0;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: #f9fafc;
  border: 1px dashed #d9dfe6;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
  min-height: 60px;
}

.component-item:hover {
  border-color: #409eff;
  background: #ecf5ff;
}

.component-item.dragging {
  opacity: 0.6;
}

.component-icon {
  margin-bottom: 6px;
  color: #409eff;
}

.component-name {
  font-size: 12px;
  color: #333;
  text-align: center;
}

.canvas-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.canvas-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.canvas {
  flex: 1;
  background: #fff;
  border-radius: 8px;
  border: 2px dashed #d9dfe6;
  position: relative;
  overflow: hidden;
}

.canvas.drag-over {
  border-color: #409eff;
  background-color: #f0f9ff;
}

.canvas-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.canvas-component {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f9fafc;
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.canvas-component.selected {
  border-color: #409eff;
  background: #ecf5ff;
}

.component-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.canvas-component-icon {
  color: #409eff;
}

.canvas-component-name {
  font-weight: 500;
  color: #333;
}

.canvas-component-type {
  font-size: 12px;
  color: #999;
}

.delete-btn {
  padding: 6px !important;
}

.designer-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #c0c4cc;
}

.empty-text {
  margin: 0;
  font-size: 14px;
}

.panel-content {
  padding: 16px;
  overflow-y: auto;
  flex: 1;
}

.panel-empty {
  padding: 24px;
}
</style>