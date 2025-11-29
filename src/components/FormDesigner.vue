<template>
  <div class="form-designer">
    <!-- 左侧组件库 -->
    <div class="component-library">
      <h3>工业表单组件库</h3>
      <!-- 可拖拽组件 -->
      <draggable
        v-model="components"
        group="form"
        class="component-list"
        ghost-class="ghost"
      >
        <div class="component-item" v-for="item in components" :key="item.id">
          {{ item.name }}
        </div>
      </draggable>
    </div>

    <!-- 中间画布 -->
    <div class="canvas">
      <h3>表单画布（拖拽组件到此处）</h3>
      <draggable
        v-model="canvasComponents"
        group="form"
        class="canvas-list"
        ghost-class="ghost"
        @change="onCanvasChange"
      >
        <div class="canvas-item" v-for="item in canvasComponents" :key="item.id">
          {{ item.name }}
          <el-button size="mini" @click="removeComponent(item.id)">删除</el-button>
        </div>
      </draggable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Draggable } from 'vue-draggable-next'
import { ElButton } from 'element-plus'

// 左侧组件库数据（工业表单组件）
const components = ref([
  { id: 1, name: "文本输入框（批次ID）" },
  { id: 2, name: "数值输入框（温度）" },
  { id: 3, name: "日期选择器（生产时间）" },
  { id: 4, name: "下拉选择（设备型号）" },
  { id: 5, name: "复选框（质检项）" }
])

// 画布中组件数据
const canvasComponents = ref([])

// 画布组件变化回调
const onCanvasChange = (val) => {
  console.log("画布组件更新：", val)
}

// 删除画布组件
const removeComponent = (id) => {
  canvasComponents.value = canvasComponents.value.filter(item => item.id !== id)
}
</script>

<style scoped>
.form-designer {
  display: flex;
  gap: 20px;
  padding: 20px;
}
.component-library {
  width: 200px;
  border: 1px solid #e6e6e6;
  padding: 10px;
}
.canvas {
  flex: 1;
  border: 1px solid #e6e6e6;
  padding: 10px;
}
.component-item, .canvas-item {
  padding: 8px;
  margin: 5px 0;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ghost {
  background: #e0f7fa;
  border: 1px dashed #00bcd4;
}
</style>