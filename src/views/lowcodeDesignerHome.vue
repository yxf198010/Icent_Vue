<!-- 新建表单：在 FormDesignerHome.vue 中直接使用 <LowcodeDesigner />，组件会从本地存储加载配置（如有）； -->
<template>
  <div class="form-designer-home">
    <h1 class="page-title">工业表单设计器</h1>
    <!-- 🔥 替换为功能完善的 LowcodeDesigner 组件 -->
    <LowcodeDesigner />
    <!-- 保留全局操作按钮（可与组件内按钮功能联动，或作为兜底） -->
    <div class="form-actions">
      <el-button type="primary" @click="saveForm">保存表单</el-button>
      <el-button @click="previewForm">预览表单</el-button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
// 🔥 替换为功能完善的 LowcodeDesigner 组件
import LowcodeDesigner from '@/components/LowcodeDesigner.vue'
import { ElButton, ElMessage } from 'element-plus'

const router = useRouter()

// 保存表单（可对接后端，或与 LowcodeDesigner 内的保存逻辑联动）
const saveForm = () => {
  // 若需要全局保存，可通过 provide/inject 或事件总线获取 LowcodeDesigner 内的配置数据
  ElMessage.success('表单保存成功！（后续可对接后端 API）')
}

// 预览表单（后续可跳转预览页）
const previewForm = () => {
  ElMessage.info('表单预览功能开发中...')
  // 示例：跳转预览页面（需配置路由）
  // router.push('/form-preview')
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