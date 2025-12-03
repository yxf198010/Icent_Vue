<!-- src/views/FormEdit.vue -->
<template>
  <div class="form-edit-page">
    <!-- 页面标题+面包屑 -->
    <div class="page-header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name: 'form-designer-home' }">表单设计器</el-breadcrumb-item>
        <el-breadcrumb-item>编辑表单 #{{ formId }}</el-breadcrumb-item>
      </el-breadcrumb>
      <h1 class="page-title">编辑工业表单</h1>
    </div>

    <!-- 核心表单设计器组件（复用拖拽功能） -->
    <FormDesigner 
      :init-components="initCanvasComponents" 
      @update-components="handleComponentsUpdate"
    />

    <!-- 操作按钮区 -->
    <div class="form-actions">
      <el-button @click="goBack">取消</el-button>
      <el-button type="primary" @click="saveForm">保存修改</el-button>
      <el-button type="success" @click="previewForm">预览表单</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import FormDesigner from '@/components/FormDesigner.vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElMessage } from 'element-plus'

// 路由实例（跳转/返回）
const router = useRouter()
// 路由参数（获取表单ID：/form-edit/:id）
const route = useRoute()
const formId = route.params.id || '' // 表单ID（从路由参数获取）

// 初始化画布组件（从后端加载已保存的表单配置）
const initCanvasComponents = ref([])
// 当前画布组件（实时更新）
const currentComponents = ref([])

// 组件更新回调（接收 FormDesigner 组件的实时变化）
const handleComponentsUpdate = (components) => {
  currentComponents.value = components
}

// 页面加载时：从后端获取表单配置（模拟接口请求）
onMounted(async () => {
  if (!formId) {
    ElMessage.error('表单ID不存在，无法编辑！')
    router.push({ name: 'form-designer-home' })
    return
  }

  // 模拟后端请求：实际项目中替换为真实 API（对接 Django 后端）
  try {
    // 这里用 setTimeout 模拟接口延迟，实际替换为 axios/fetch 请求
    setTimeout(() => {
      // 模拟从后端获取的已保存表单配置（实际应从 Django 数据库查询）
      const mockSavedForm = {
        id: formId,
        name: `工业表单${formId}`,
        components: [
          { id: 1, name: "文本输入框（批次ID）", props: { placeholder: "请输入批次ID", required: true } },
          { id: 3, name: "日期选择器（生产时间）", props: { format: "YYYY-MM-DD HH:mm:ss", default: new Date().toLocaleString() } },
          { id: 2, name: "数值输入框（温度）", props: { min: 0, max: 100, step: 0.1, default: 25.5 } }
        ]
      }

      // 给组件添加唯一标识（避免拖拽时 key 重复）
      initCanvasComponents.value = mockSavedForm.components.map(item => ({
        ...item,
        uniqueId: `${item.id}-${Date.now()}` // 唯一ID（防止同类型组件key冲突）
      }))
      currentComponents.value = [...initCanvasComponents.value]
    }, 500)
  } catch (error) {
    ElMessage.error('加载表单配置失败，请重试！')
    router.push({ name: 'form-designer-home' })
  }
})

// 保存修改（提交到后端更新表单配置）
const saveForm = async () => {
  if (currentComponents.value.length === 0) {
    ElMessage.warning('表单不能为空，请添加组件！')
    return
  }

  // 模拟提交到后端（实际项目中替换为真实 API）
  try {
    // 这里用 setTimeout 模拟接口请求，实际替换为 axios.post
    setTimeout(() => {
      // 提交的数据：表单ID + 最新的组件配置
      const submitData = {
        formId: formId,
        components: currentComponents.value.map(item => ({
          id: item.id,
          name: item.name,
          props: item.props || {} // 组件属性（如占位符、默认值等）
        }))
      }

      console.log('提交更新的表单配置：', submitData)
      // 实际项目中：await axios.post('/api/form/update', submitData)

      ElMessage.success('表单修改保存成功！')
      router.push({ name: 'form-designer-home' }) // 保存后返回首页
    }, 500)
  } catch (error) {
    ElMessage.error('保存失败，请重试！')
  }
}

// 预览表单（后续可扩展为新页面预览）
const previewForm = () => {
  ElMessage.info('表单预览功能（后续可扩展为真实预览页面）')
  // 扩展方向：打开新窗口或路由跳转到预览页，传入 currentComponents.value
}

// 返回首页
const goBack = () => {
  router.push({ name: 'form-designer-home' })
}
</script>

<style scoped>
.form-edit-page {
  padding: 2rem;
}

.page-header {
  margin-bottom: 1.5rem;
}

.page-title {
  color: #1989fa;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 0.5rem;
  margin-top: 0.5rem;
}

.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* 适配移动端 */
@media (max-width: 768px) {
  .form-edit-page {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions .el-button {
    width: 100%;
  }
}
</style>