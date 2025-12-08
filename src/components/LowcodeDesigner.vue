<template>
  <div class="lowcode_designer">
    <!-- 头部区域 -->
    <header class="designer-header">
      <div class="header-content">
        <!-- 左侧：Logo图标 -->
        <div class="header-left">
          <el-icon class="logo-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            </el-icon>
            <span>保存配置</span>
          </el-button>
          <!-- 预览表单 -->
          <el-button type="success" @click="previewForm" class="custom-header-btn">
            <el-icon class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </el-icon>
            <span>预览表单</span>
          </el-button>
          <!-- 加载配置 -->
          <el-button type="info" @click="loadConfig" class="custom-header-btn">
            <el-icon class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" x2="12" y1="3" y2="15"></line>
              </svg>
            </el-icon>
            <span>加载配置</span>
          </el-button>
          <!-- 清空配置 -->
          <el-button type="warning" @click="clearConfig" class="custom-header-btn">
            <el-icon class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 5H9l-7 7 7 7h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z"></path>
                <line x1="18" x2="12" y1="9" y2="15"></line>
                <line x1="12" x2="18" y1="9" y2="15"></line>
              </svg>
            </el-icon>
            <span>清空配置</span>
          </el-button>
          <!-- 导出JSON - 修改type为primary系的补充色 -->
          <el-button type="default" @click="exportConfig" class="custom-header-btn export-btn">
            <el-icon class="btn-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" x2="12" y1="15" y2="3"></line>
              </svg>
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
                <svg :class="item.iconClass" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <use :href="`#${item.iconId}`"></use>
                </svg>
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
                <svg :class="item.iconClass" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <use :href="`#${item.iconId}`"></use>
                </svg>
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
                  <svg :class="item.iconClass" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <use :href="`#${item.iconId}`"></use>
                  </svg>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="15" x2="9" y1="9" y2="15"></line>
                    <line x1="9" x2="15" y1="9" y2="15"></line>
                  </svg>
                </el-icon>
              </el-button>
            </div>
          </div>

          <!-- 画布空状态 -->
          <div v-if="canvasComponents.length === 0" class="designer-empty canvas-empty">
            <el-icon class="designer-empty-icon empty-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" x2="8" y1="13" y2="13"></line>
                <line x1="16" x2="8" y1="17" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
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
              prop="options"
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

    <!-- SVG 雪碧图定义（统一管理图标） -->
    <svg style="display: none;">
      <symbol id="icon-edit" viewBox="0 0 24 24">
        <path d="M20 14.66V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5.34"></path>
        <polygon points="18 2 22 6 12 16 8 16 8 12 18 2"></polygon>
      </symbol>
      <symbol id="icon-data-analysis" viewBox="0 0 24 24">
        <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7a2 2 0 0 1-2-2V2a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v4a2 2 0 0 1-2 2H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2z"></path>
        <polyline points="16 2 16 8 8 8 8 2"></polyline>
      </symbol>
      <symbol id="icon-calendar" viewBox="0 0 24 24">
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2"></rect>
        <line x1="16" x2="16" y1="2" y2="6"></line>
        <line x1="8" x2="8" y1="2" y2="6"></line>
        <line x1="3" x2="21" y1="10" y2="10"></line>
      </symbol>
      <symbol id="icon-arrow-down-bold" viewBox="0 0 24 24">
        <path d="M12 5v14M5 12l7 7 7-7"></path>
      </symbol>
      <symbol id="icon-check" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"></polyline>
      </symbol>
      <symbol id="icon-thermometer" viewBox="0 0 24 24">
        <path d="M15 14.5c0 2.5-5 2.5-5 0V9a3 3 0 0 1 5 0z"></path>
        <path d="M12 9v-4"></path>
        <path d="M8 18.5c0 2.5 5 2.5 5 0V9a3 3 0 0 0-5 0z"></path>
        <path d="M11 2v2"></path>
        <path d="M16 2v2"></path>
        <path d="M13 9v-4"></path>
      </symbol>
      <symbol id="icon-setting" viewBox="0 0 24 24">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </symbol>
      <symbol id="icon-grid" viewBox="0 0 24 24">
        <rect width="7" height="7" x="3" y="3" rx="1"></rect>
        <rect width="7" height="7" x="14" y="3" rx="1"></rect>
        <rect width="7" height="7" x="14" y="14" rx="1"></rect>
        <rect width="7" height="7" x="3" y="14" rx="1"></rect>
      </symbol>
    </svg>
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
  [COMPONENT_TYPES.TEXT]: { iconId: 'icon-edit', iconClass: 'icon-edit' },
  [COMPONENT_TYPES.NUMBER]: { iconId: 'icon-data-analysis', iconClass: 'icon-data-analysis' },
  [COMPONENT_TYPES.DATE]: { iconId: 'icon-calendar', iconClass: 'icon-calendar' },
  [COMPONENT_TYPES.SELECT]: { iconId: 'icon-arrow-down-bold', iconClass: 'icon-arrow-down-bold' },
  [COMPONENT_TYPES.CHECKBOX]: { iconId: 'icon-check', iconClass: 'icon-check' },
  [COMPONENT_TYPES.TEMPERATURE]: { iconId: 'icon-thermometer', iconClass: 'icon-thermometer' },
  [COMPONENT_TYPES.DEVICE]: { iconId: 'icon-setting', iconClass: 'icon-setting' },
  [COMPONENT_TYPES.BATCH]: { iconId: 'icon-grid', iconClass: 'icon-grid' }
}

// ========== 工具函数 ==========
const generateId = () => {
  return Date.now() + Math.floor(Math.random() * 1000).toString()
}

const restoreComponentIcon = (component) => {
  const iconConfig = ICON_CONFIG[component.type] || ICON_CONFIG[COMPONENT_TYPES.TEXT]
  return {
    ...component,
    iconId: iconConfig.iconId,
    iconClass: iconConfig.iconClass
  }
}

const customDebounce = (fn, delay = 300) => {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

// ========== 接收Props ==========
const props = defineProps({
  initCanvasComponents: {
    type: Array,
    default: () => []
  }
})

// ========== 响应式状态 ==========
const basicComponents = shallowRef([
  { id: 1, name: '文本输入框', type: COMPONENT_TYPES.TEXT, key: 'textInput', required: false, defaultValue: '', unit: '', options: [], ...ICON_CONFIG[COMPONENT_TYPES.TEXT] },
  { id: 2, name: '数值输入框', type: COMPONENT_TYPES.NUMBER, key: 'numberInput', required: false, defaultValue: '', unit: '', options: [], ...ICON_CONFIG[COMPONENT_TYPES.NUMBER] },
  { id: 3, name: '日期选择器', type: COMPONENT_TYPES.DATE, key: 'datePicker', required: false, defaultValue: '', unit: '', options: [], ...ICON_CONFIG[COMPONENT_TYPES.DATE] },
  { id: 4, name: '下拉选择器', type: COMPONENT_TYPES.SELECT, key: 'selectInput', required: false, defaultValue: '', options: [], optionsStr: '', ...ICON_CONFIG[COMPONENT_TYPES.SELECT] },
  { id: 5, name: '复选框', type: COMPONENT_TYPES.CHECKBOX, key: 'checkbox', required: false, defaultValue: false, unit: '', options: [], ...ICON_CONFIG[COMPONENT_TYPES.CHECKBOX] }
])

const industrialComponents = shallowRef([
  { id: 6, name: '温度输入框', type: COMPONENT_TYPES.TEMPERATURE, key: 'temperature', required: true, defaultValue: '', unit: '℃', options: [], ...ICON_CONFIG[COMPONENT_TYPES.TEMPERATURE] },
  { id: 7, name: '设备选择器', type: COMPONENT_TYPES.DEVICE, key: 'deviceSelect', required: true, defaultValue: '', options: ['设备1', '设备2'], optionsStr: '设备1,设备2', ...ICON_CONFIG[COMPONENT_TYPES.DEVICE] },
  { id: 8, name: '批次输入框', type: COMPONENT_TYPES.BATCH, key: 'batchId', required: true, defaultValue: '', unit: '', options: [], ...ICON_CONFIG[COMPONENT_TYPES.BATCH] }
])

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
  iconId: '',
  iconClass: ''
})

// ========== 计算属性 ==========
const selectedOptionsStr = computed({
  get() {
    return selectedComponent.value.options.join(',')
  },
  set(val) {
    selectedComponent.value.options = val ? val.split(',').map(item => item.trim()) : []
  }
})

// ========== 监听逻辑 ==========
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

// ========== 生命周期 ==========
onMounted(() => {
  console.log('%c [LowcodeDesigner] 组件已挂载', 'color: #409EFF; font-weight: bold')
  if (props.initCanvasComponents.length === 0) {
    loadConfig()
  }
})

// ========== 拖拽逻辑 ==========
const handleDragStart = (e, item) => {
  try {
    isDragging.value = true
    draggingComponentId.value = item.id
    const dragData = { ...item, id: generateId() }
    
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', JSON.stringify(dragData))
      e.dataTransfer.effectAllowed = 'copy'
    }
    
    e.target.style.opacity = '0.7'
    console.log(`%c [拖拽] 开始拖拽组件：${item.name}`, 'color: #67C23A')
  } catch (error) {
    console.error('%c [拖拽] 拖拽开始失败', 'color: #F56C6C', error)
    ElMessage.error('拖拽失败：' + error.message)
  }
}

const handleDragEnd = (e) => {
  isDragging.value = false
  draggingComponentId.value = null
  e.target.style.opacity = '1'
  console.log('%c [拖拽] 拖拽结束', 'color: #909399')
}

const handleDrop = (e) => {
  try {
    let componentData = null
    
    if (e.dataTransfer && e.dataTransfer.getData) {
      const data = e.dataTransfer.getData('text/plain')
      componentData = JSON.parse(data)
    }
    
    if (componentData) {
      const newComponent = restoreComponentIcon(componentData)
      canvasComponents.value.push(newComponent)
      ElMessage.success(`已添加「${newComponent.name}」组件`)
    }
  } catch (error) {
    console.error('%c [拖拽] 放置组件失败', 'color: #F56C6C', error)
    ElMessage.error('添加组件失败：' + error.message)
  }
}

// ========== 画布交互逻辑 ==========
const selectComponent = (item, index) => {
  selectedComponent.value = { 
    ...item, 
    index,
    optionsStr: item.options ? item.options.join(',') : ''
  }
  console.log(`%c [画布] 选中组件：${item.name}`, 'color: #409EFF')
}

const updateComponent = () => {
  const idx = selectedComponent.value.index
  if (idx >= 0 && idx < canvasComponents.value.length) {
    const { index, ...componentData } = selectedComponent.value
    canvasComponents.value[idx] = { ...componentData }
    if (import.meta.env.DEV) {
      ElMessage.info('组件属性已更新')
    }
  }
}

const debouncedUpdateComponent = customDebounce(updateComponent, 300)

const handleOptionsChange = () => {
  selectedComponent.value.options = selectedComponent.value.optionsStr 
    ? selectedComponent.value.optionsStr.split(',').map(item => item.trim()) : []
  debouncedUpdateComponent()
}

const deleteComponent = (index) => {
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
    if (selectedComponent.value.index === index) {
      selectedComponent.value = {
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
        iconId: '',
        iconClass: ''
      }
    }
    ElMessage.success('组件已删除')
  }).catch(() => {
    ElMessage.info('已取消删除操作')
  })
}

// ========== 配置操作逻辑 ==========
const saveConfig = () => {
  if (canvasComponents.value.length === 0) {
    return ElMessage.warning('请先添加组件再保存！')
  }
  
  try {
    const saveData = canvasComponents.value.map(({ iconId, iconClass, ...rest }) => rest)
    localStorage.setItem('icentFormConfig', JSON.stringify(saveData))
    ElMessage.success('表单配置已成功保存到本地！')
  } catch (error) {
    console.error('%c [配置] 保存失败', 'color: #F56C6C', error)
    ElMessage.error('保存失败：' + error.message)
  }
}

const loadConfig = () => {
  try {
    const savedConfig = localStorage.getItem('icentFormConfig')
    if (savedConfig) {
      const parsedConfig = JSON.parse(savedConfig).map(restoreComponentIcon)
      canvasComponents.value = parsedConfig
      ElMessage.success('已加载本地保存的配置！')
    } else {
      ElMessage.info('暂无本地配置，可开始创建新表单')
    }
  } catch (error) {
    console.error('%c [配置] 加载失败', 'color: #F56C6C', error)
    ElMessage.error('加载配置失败：' + error.message)
  }
}

const previewForm = () => {
  if (canvasComponents.value.length === 0) {
    return ElMessage.warning('请先添加组件再预览！')
  }
  
  try {
    ElMessageBox.alert(
      `<pre style="text-align: left; max-height: 60vh; overflow-y: auto;">${JSON.stringify(canvasComponents.value, null, 2)}</pre>`,
      '表单结构预览',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '关闭',
        customClass: 'form-preview-modal'
      }
    )
  } catch (error) {
    console.error('%c [预览] 预览失败', 'color: #F56C6C', error)
    ElMessage.error('预览失败：' + error.message)
  }
}

const clearConfig = () => {
  ElMessageBox.confirm(
    '确定要清空所有配置吗？此操作不可撤销！',
    '清空确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    canvasComponents.value = []
    selectedComponent.value = {
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
      iconId: '',
      iconClass: ''
    }
    localStorage.removeItem('icentFormConfig')
    ElMessage.success('已清空所有配置！')
  }).catch(() => {
    ElMessage.info('已取消清空操作')
  })
}

const exportConfig = () => {
  if (canvasComponents.value.length === 0) {
    return ElMessage.warning('请先添加组件再导出！')
  }
  
  try {
    const exportData = canvasComponents.value.map(({ iconId, iconClass, ...rest }) => rest)
    const configData = JSON.stringify(exportData, null, 2)
    const blob = new Blob([configData], { type: 'application/json; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = `icent_form_config_${new Date().toISOString().slice(0, 10)}.json`
    link.style.display = 'none'
    
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    ElMessage.success('配置已成功导出为JSON文件！')
  } catch (error) {
    console.error('%c [导出] 导出失败', 'color: #F56C6C', error)
    ElMessage.error('导出失败：' + error.message)
  }
}

// ========== 暴露方法给父组件 ==========
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

<style scoped lang="scss">
/* 全局CSS变量 */
:root {
  --primary-color: #409EFF;
  --success-color: #67C23A;
  --info-color: #909399;
  --warning-color: #E6A23C;
  --export-color: #36CFCC; /* 新增导出按钮颜色 */
  --default-color: #303133;
  --secondary-color: #f5f7fa;
  --card-bg-color: #ffffff;
  --text-color: #303133;
  --text-light-color: #909399;
  --border-color: #e4e7ed;
  --shadow-color: rgba(0, 0, 0, 0.1);
  --hover-shadow: 0 6px 16px rgba(64, 158, 255, 0.2);
  --export-hover-shadow: 0 6px 16px rgba(54, 207, 204, 0.2);
  --hover-scale: 1.05;
  --transition-base: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --drag-over-color: rgba(64, 158, 255, 0.1);
  --dragging-opacity: 0.7;
}

/* 整体布局 */
.lowcode_designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  background-color: var(--secondary-color);
  overflow: hidden;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 头部样式 */
.designer-header {
  background-color: var(--primary-color);
  color: white;
  box-shadow: 0 2px 8px var(--shadow-color);
  z-index: 10;
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

.header-left {
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo-icon {
  font-size: 20px;
  color: white;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: white;
  text-align: center;
}

.header-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

/* 自定义按钮样式 */
.custom-header-btn {
  padding: 9px 18px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  transition: var(--transition-base);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* 图标样式 */
.btn-icon {
  font-size: 18px !important;
  width: 18px !important;
  height: 18px !important;
  display: inline-flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: inherit !important;
  transition: var(--transition-base);
}

:deep(.el-icon) {
  display: inline-block !important;
  width: 1em !important;
  height: 1em !important;
  vertical-align: middle !important;
  fill: currentColor !important;
  stroke: currentColor !important;
  color: inherit !important;
}

:deep(.el-button .el-icon) {
  margin-right: 6px !important;
}

/* 按钮交互效果 */
.custom-header-btn:hover {
  transform: scale(var(--hover-scale));
  box-shadow: var(--hover-shadow);
  filter: brightness(0.95);
}

.custom-header-btn:hover .btn-icon {
  transform: rotate(5deg) scale(1.1);
}

.custom-header-btn:active {
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 按钮类型样式 */
:deep(.el-button--primary) {
  background-color: var(--primary-color) !important;
  border-color: var(--primary-color) !important;
  color: #ffffff !important;
}

:deep(.el-button--success) {
  background-color: var(--success-color) !important;
  border-color: var(--success-color) !important;
  color: #ffffff !important;
}

:deep(.el-button--info) {
  background-color: var(--info-color) !important;
  border-color: var(--info-color) !important;
  color: #ffffff !important;
}

:deep(.el-button--warning) {
  background-color: var(--warning-color) !important;
  border-color: var(--warning-color) !important;
  color: #ffffff !important;
}

/* 导出按钮样式 - 关键修复：确保语法正确，大括号匹配 */
:deep(.export-btn.el-button--default) {
  background-color: var(--export-color) !important;
  border-color: var(--export-color) !important;
  color: #ffffff !important;

  .el-icon,
  svg {
    color: #ffffff !important;
    fill: #ffffff !important;
    stroke: #ffffff !important;
  }
}

:deep(.export-btn.el-button--default:hover) {
  color: #ffffff !important;
  box-shadow: var(--export-hover-shadow) !important;
  filter: brightness(0.95); /* 统一使用通用滤镜效果 */

  .el-icon,
  svg {
    color: #ffffff !important;
    fill: #ffffff !important;
    stroke: #ffffff !important;
  }
}

:deep(.export-btn.el-button--default:active) {
  background-color: #1ea8a5 !important;
  border-color: #1ea8a5 !important;
  transform: scale(0.98);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 主体布局 */
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

/* 左侧组件库 */
.component-library {
  background: var(--card-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.library-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  margin: 0;
}

.component-tabs {
  display: flex;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid var(--border-color);
}

.tab-btn {
  flex: 1;
  padding: 8px 0;
  background: var(--secondary-color);
  border: none;
  border-radius: var(--el-border-radius-base);
  cursor: pointer;
  font-size: var(--el-font-size-base);
  color: var(--text-light-color);
  transition: all 0.2s;
}

.tab-btn.active {
  background: var(--primary-color);
  color: white;
}

.tab-btn:hover:not(.active) {
  background: #e8f4f8;
  color: var(--primary-color);
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
  background: var(--secondary-color);
  border-radius: var(--el-border-radius-base);
  cursor: move;
  transition: background-color 0.2s, transform 0.1s, opacity 0.2s;
}

.component-item:hover {
  background-color: #e8f4f8;
  transform: translateY(-1px);
}

.component-item.dragging {
  opacity: var(--dragging-opacity);
  transform: scale(1.02);
}

.component-icon {
  color: var(--primary-color);
}

.component-name {
  color: var(--text-color);
  font-size: var(--el-font-size-base);
}

/* 画布区域 */
.canvas-container {
  background: var(--card-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.canvas-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  margin: 0;
}

.canvas {
  flex: 1;
  padding: 20px;
  background: var(--secondary-color);
  position: relative;
  overflow-y: auto;
  border-radius: 0 0 var(--el-border-radius-base) var(--el-border-radius-base);
  transition: background-color 0.2s;
}

.canvas.drag-over {
  background-color: var(--drag-over-color);
  border: 2px dashed var(--primary-color);
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
  background: var(--card-bg-color);
  border-radius: var(--el-border-radius-large);
  box-shadow: 0 2px 4px var(--shadow-color);
  cursor: pointer;
  transition: all 0.2s;
}

.canvas-component.selected {
  border: 2px solid var(--primary-color);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.canvas-component:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

.component-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.canvas-component-icon {
  color: var(--primary-color);
}

.canvas-component-name {
  color: var(--text-color);
  font-size: var(--el-font-size-base);
  font-weight: 500;
}

.canvas-component-type {
  font-size: 12px;
  color: var(--text-light-color);
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

/* 空状态样式 */
.designer-empty {
  text-align: center;
}

.canvas-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  box-sizing: border-box;
  padding: 0 20px;
}

.empty-icon {
  font-size: 48px;
  color: var(--text-light-color);
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
  color: var(--text-light-color);
  margin: 0;
}

/* 属性面板 */
.property-panel {
  background: var(--card-bg-color);
  border-radius: var(--el-border-radius-base);
  box-shadow: 0 2px 8px var(--shadow-color);
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.panel-title {
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  color: var(--text-color);
  margin: 0;
}

.panel-empty {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 响应式适配 */
@media (max-width: 1200px) {
  .designer-main {
    grid-template-columns: minmax(200px, 240px) 1fr minmax(240px, 280px);
  }
  .header-buttons {
    gap: 8px;
  }
  .custom-header-btn {
    padding: 7px 14px;
    font-size: 13px;
  }
  .btn-icon {
    font-size: 16px !important;
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

  .header-left, .header-title, .header-buttons {
    width: 100%;
    justify-content: center;
  }

  .header-buttons {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .designer-main {
    padding: 5px;
    gap: 5px;
  }

  .canvas {
    padding: 10px;
  }

  .component-item {
    padding: 8px;
  }

  .canvas-component {
    padding: 10px;
  }

  .header-buttons {
    gap: 6px;
  }

  .custom-header-btn {
    padding: 6px 10px;
    font-size: 12px;
  }
  .btn-icon {
    font-size: 14px !important;
  }
}

/* SVG 雪碧图样式重置 */
:deep(svg) use {
  fill: currentColor;
  stroke: currentColor;
}
</style>