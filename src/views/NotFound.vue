<template>
  <div class="not-found-page">
    <el-icon size="64" color="#f56c6c"><CircleClose /></el-icon>
    <h1>404 - 页面未找到</h1>
    <p>您访问的路径不存在，请检查地址或返回首页</p>
    <el-button type="primary" @click="goHome">返回设计器首页</el-button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElButton, ElIcon } from 'element-plus'
import { CircleClose } from '@element-plus/icons-vue'

const router = useRouter()
const goHome = () => {
  router.push({ name: 'lowcode-designer-home' })
}
</script>

<style scoped>
.not-found-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  gap: 20px;
  background-color: #f5f7fa;
}

h1 {
  font-size: 32px;
  color: #303133;
}

p {
  font-size: 16px;
  color: #606266;
}
</style>