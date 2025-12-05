<!-- 编辑表单：在 lowcodeEdit.vue 中通过 <LowcodeDesigner :init-canvas-components="initCanvasComponents" ref="designerRef" /> 传递历史配置，并通过 ref 访问内部数据。 -->
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

    <!-- 核心表单设计器组件（替换为 LowcodeDesigner） -->
    <LowcodeDesigner 
      ref="designerRef"
      :init-canvas-components="initCanvasComponents"
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
// 🔥 替换为功能完善的 LowcodeDesigner 组件
import LowcodeDesigner from '@/components/LowcodeDesigner.vue'
import { ElButton, ElBreadcrumb, ElBreadcrumbItem, ElMessage } from 'element-plus'

// 路由实例（跳转/返回）
const router = useRouter()
const route = useRoute()
const formId = route.params.id || '' // 表单ID（从路由参数获取）

// 初始化画布组件（从后端加载已保存的表单配置）
const initCanvasComponents = ref([])
// 设计器组件引用（用于获取内部数据）
const designerRef = ref(null)

// 页面加载时：从后端获取表单配置（模拟接口请求）
onMounted(async () => {
  if (!formId) {
    ElMessage.error('表单ID不存在，无法编辑！')
    router.push({ name: 'form-designer-home' })
    return
  }

  // 模拟后端请求：实际项目中替换为真实 API（对接 Django 后端）
  try {
    setTimeout(() => {
      // 模拟从后端获取的已保存表单配置
      const mockSavedForm = {
        id: formId,
        name: `工业表单${formId}`,
        components: [
          { id: 1, name: "文本输入框（批次ID）", type: 'text', key: 'batchId', required: true, defaultValue: '', unit: '' },
          { id: 3, name: "日期选择器（生产时间）", type: 'date', key: 'produceTime', required: false, defaultValue: new Date().toLocaleString(), unit: '' },
          { id: 2, name: "数值输入框（温度）", type: 'number', key: 'temperature', required: false, defaultValue: 25.5, unit: '℃' }
        ]
      }

      // 格式化数据适配 LowcodeDesigner 组件
      initCanvasComponents.value = mockSavedForm.components.map(item => ({
        ...item,
        id: Date.now() + Math.floor(Math.random() * 1000), // 生成唯一ID（避免冲突）
        icon: item.type === 'text' ? 'Edit' : item.type === 'date' ? 'Calendar' : 'DataAnalysis' // 匹配组件图标
      }))
    }, 500)
  } catch (error) {
    ElMessage.error('加载表单配置失败，请重试！')
    router.push({ name: 'form-designer-home' })
  }
})

// 保存修改（提交到后端更新表单配置）
const saveForm = async () => {
  // 通过 ref 获取 LowcodeDesigner 内的画布组件数据
  const currentComponents = designerRef.value?.canvasComponents || []
  if (currentComponents.length === 0) {
    ElMessage.warning('表单不能为空，请添加组件！')
    return
  }

  // 模拟提交到后端
  try {
    setTimeout(() => {
      const submitData = {
        formId: formId,
        components: currentComponents.map(item => ({
          name: item.name,
          type: item.type,
          key: item.key,
          required: item.required,
          defaultValue: item.defaultValue,
          unit: item.unit
        }))
      }

      console.log('提交更新的表单配置：', submitData)
      ElMessage.success('表单修改保存成功！')
      router.push({ name: 'form-designer-home' })
    }, 500)
  } catch (error) {
    ElMessage.error('保存失败，请重试！')
  }
}

// 预览表单
const previewForm = () => {
  const currentComponents = designerRef.value?.canvasComponents || []
  if (currentComponents.length === 0) {
    ElMessage.warning('表单不能为空，无法预览！')
    return
  }
  ElMessage.info('表单预览功能开发中...')
  // 扩展：调用 LowcodeDesigner 内的预览方法
  // designerRef.value?.previewForm()
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