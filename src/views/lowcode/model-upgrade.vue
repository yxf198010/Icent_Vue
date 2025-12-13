<template>
  <div>模型升级页面</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 获取路由参数（模型ID）
const route = useRoute()
const router = useRouter()
const modelId = ref(route.params.id)

onMounted(() => {
  // 后续补充模型升级逻辑
  console.log('升级模型ID：', modelId.value)
})

// 返回列表页
const goBack = () => {
  router.push('/lowcode/model-list')
}
</script>