<template>
  <div class="form-designer-home">
    <h1 class="page-title">工业表单设计器</h1>
    <!-- 🔥 引入核心拖拽组件 -->
    <FormDesigner />
    <!-- 可选：添加表单保存、预览等全局按钮 -->
    <div class="form-actions">
      <el-button type="primary" @click="saveForm">保存表单</el-button>
      <el-button @click="previewForm">预览表单</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// 🔥 导入核心组件 FormDesigner
import FormDesigner from '@/components/FormDesigner.vue'
// 导入 Element Plus 按钮（如果需要扩展功能）
import { ElButton } from 'element-plus'

const router = useRouter()

// 保存表单（后续可对接后端 API）
const saveForm = () => {
  // 这里可添加表单数据提交逻辑（比如调用 Django API 保存表单配置）
  alert('表单保存成功！（后续可对接后端）')
}

// 预览表单（后续可跳转预览页）
const previewForm = () => {
  alert('表单预览（后续可实现）')
}
</script>

<style scoped>
.form-designer-home {
  padding: 2rem;
}
.page-title {
  margin-bottom: 1.5rem;
  color: #1989fa;
  border-bottom: 1px solid #e6e6e6;
  padding-bottom: 0.5rem;
}
.form-actions {
  margin-top: 1.5rem;
  display: flex;
  gap: 1rem;
}
</style>