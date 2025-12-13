<template>
  <div class="model-create-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1>创建动态模型</h1>
      <el-button type="primary" @click="submitForm" :loading="loading">
        <el-icon><Check /></el-icon> 保存模型
      </el-button>
    </div>

    <!-- 表单主体 -->
    <el-card shadow="never" class="form-card">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- 基本信息标签页 -->
        <el-tab-pane label="基本信息" name="base">
          <el-form
            ref="modelFormRef"
            :model="modelForm"
            :rules="modelRules"
            label-width="120px"
            class="base-form"
          >
            <!-- 模型名称 -->
            <el-form-item label="模型名称" prop="name">
              <el-input
                v-model="modelForm.name"
                placeholder="例如：Product、Order"
                @input="generateTableName"
                maxlength="50"
                show-word-limit
              />
              <div class="form-text">
                需为合法Python标识符（字母、下划线开头，无特殊字符）
              </div>
            </el-form-item>

            <!-- 数据表名（只读） -->
            <el-form-item label="数据表名">
              <el-input
                v-model="modelForm.table_name"
                placeholder="自动生成"
                disabled
              />
              <div class="form-text">
                数据表名将自动生成：lowcode_ + 模型名小写（不可手动修改）
              </div>
            </el-form-item>

            <!-- 角色选择 -->
            <el-form-item label="可访问角色">
              <el-select
                v-model="modelForm.roles"
                multiple
                filterable
                placeholder="请选择角色"
                style="width: 100%;"
              >
                <el-option
                  v-for="role in roleList"
                  :key="role.id"
                  :label="role.name"
                  :value="role.id"
                />
              </el-select>
              <div class="form-text">
                选择可访问该模型的角色，未选择则仅管理员可访问
              </div>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- 字段配置标签页 -->
        <el-tab-pane label="字段配置" name="fields">
          <div class="field-config-header">
            <span class="header-title">字段列表（拖动行可排序）</span>
            <el-button type="success" icon="Plus" @click="addField">
              添加字段
            </el-button>
          </div>

          <!-- 字段表格 -->
          <el-table
            ref="fieldTableRef"
            :data="fieldList"
            border
            row-key="id"
            :header-cell-style="{ background: '#f5f7fa' }"
          >
            <el-table-column label="字段名称" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.name"
                  placeholder="例如：name、price"
                  maxlength="50"
                  show-word-limit
                />
              </template>
            </el-table-column>
            <el-table-column label="字段标签" min-width="150">
              <template #default="scope">
                <el-input
                  v-model="scope.row.label"
                  placeholder="例如：产品名称、价格"
                  maxlength="50"
                  show-word-limit
                />
              </template>
            </el-table-column>
            <el-table-column label="字段类型" min-width="150">
              <template #default="scope">
                <el-select
                  v-model="scope.row.type"
                  placeholder="请选择"
                  style="width: 100%;"
                >
                  <el-option label="单行文本" value="char" />
                  <el-option label="多行文本" value="text" />
                  <el-option label="整数" value="integer" />
                  <el-option label="浮点数" value="float" />
                  <el-option label="布尔值" value="boolean" />
                  <el-option label="日期" value="date" />
                  <el-option label="日期时间" value="datetime" />
                  <el-option label="文件" value="file" />
                  <el-option label="图片" value="image" />
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="是否必填" width="120">
              <template #default="scope">
                <el-switch v-model="scope.row.required" />
              </template>
            </el-table-column>
            <el-table-column label="选项配置" min-width="200">
              <template #default="scope">
                <el-input
                  v-model="scope.row.options"
                  placeholder="枚举类型填写选项，格式：值1:标签1;值2:标签2"
                  maxlength="200"
                  show-word-limit
                />
              </template>
            </el-table-column>
            <el-table-column label="帮助文本" min-width="200">
              <template #default="scope">
                <el-input
                  v-model="scope.row.help_text"
                  placeholder="例如：请输入产品名称"
                  maxlength="200"
                  show-word-limit
                />
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
              <template #default="scope">
                <el-button
                  type="danger"
                  icon="Delete"
                  size="small"
                  @click="deleteField(scope.row.id)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 字段预览 -->
          <div class="field-preview mt-4">
            <h4>字段配置预览</h4>
            <el-tag
              v-for="(field, index) in fieldList"
              :key="index"
              closable
              @close="deleteField(field.id)"
              style="margin: 0 8px 8px 0;"
            >
              {{ field.name || "未命名字段" }}
              <span style="color: #999;">（{{ getFieldTypeLabel(field.type) }}）</span>
              <span v-if="field.required" style="color: #f56c6c;">必填</span>
            </el-tag>
            <div v-if="fieldList.length === 0" class="empty-tip">
              暂无字段配置，请点击"添加字段"按钮
            </div>
          </div>
        </el-tab-pane>

        <!-- 系统信息标签页（可折叠） -->
        <el-tab-pane label="系统信息" name="system">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="创建时间">
              {{ new Date().toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="更新时间">
              {{ new Date().toLocaleString() }}
            </el-descriptions-item>
            <el-descriptions-item label="数据表状态">
              <el-tag v-if="tableStatus === 'exists'" type="success">✅ 已创建</el-tag>
              <el-tag v-else-if="tableStatus === 'not_exists'" type="danger">❌ 未创建</el-tag>
              <el-tag v-else type="info">🔄 待检测</el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Check, Plus, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { createModelApi, getRoleListApi, checkTableExistsApi } from '@/api/lowcode'

// 路由实例
const router = useRouter()

// 响应式数据
const loading = ref(false)
const activeTab = ref('base')
const modelFormRef = ref()
const fieldTableRef = ref()
const tableStatus = ref('pending') // pending/exists/not_exists

// 模型表单数据
const modelForm = reactive({
  name: '',
  table_name: '',
  roles: [] as number[]
})

// 字段列表
const fieldList = ref([
  {
    id: 1,
    name: '',
    label: '',
    type: 'char',
    required: false,
    options: '',
    help_text: ''
  }
])

// 角色列表
const roleList = ref([])

// 表单校验规则
const modelRules = reactive({
  name: [
    { required: true, message: '请输入模型名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/, message: '模型名称需以字母/下划线开头，仅含字母/数字/下划线', trigger: 'blur' }
  ]
})

// 获取字段类型标签
const getFieldTypeLabel = (type: string) => {
  const typeMap = {
    char: '单行文本',
    text: '多行文本',
    integer: '整数',
    float: '浮点数',
    boolean: '布尔值',
    date: '日期',
    datetime: '日期时间',
    file: '文件',
    image: '图片'
  }
  return typeMap[type] || '未知类型'
}

// 自动生成数据表名
const generateTableName = () => {
  if (modelForm.name) {
    modelForm.table_name = `lowcode_${modelForm.name.toLowerCase()}`
    // 检测数据表是否存在
    checkTableExists()
  } else {
    modelForm.table_name = ''
    tableStatus.value = 'pending'
  }
}

// 检测数据表是否存在
const checkTableExists = async () => {
  if (!modelForm.table_name) return
  try {
    const res = await checkTableExistsApi(modelForm.table_name)
    tableStatus.value = res.data ? 'exists' : 'not_exists'
  } catch (error) {
    tableStatus.value = 'pending'
    ElMessage.warning('检测数据表状态失败')
  }
}

// 添加字段
const addField = () => {
  const maxId = fieldList.value.reduce((max, item) => Math.max(max, item.id), 0)
  fieldList.value.push({
    id: maxId + 1,
    name: '',
    label: '',
    type: 'char',
    required: false,
    options: '',
    help_text: ''
  })
}

// 删除字段
const deleteField = (id: number) => {
  if (fieldList.value.length <= 1) {
    ElMessage.warning('至少保留一个字段')
    return
  }
  fieldList.value = fieldList.value.filter(item => item.id !== id)
}

// 提交表单
const submitForm = async () => {
  if (!modelFormRef.value) return
  try {
    // 表单校验
    await modelFormRef.value.validate()
    // 校验字段配置
    const validFields = fieldList.value.filter(item => item.name.trim())
    if (validFields.length === 0) {
      ElMessage.warning('请配置至少一个有效字段')
      activeTab.value = 'fields'
      return
    }

    // 二次确认
    await ElMessageBox.confirm(
      '确定要创建该模型吗？创建后将自动生成数据库表结构',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    loading.value = true
    // 构造提交数据
    const submitData = {
      ...modelForm,
      fields: fieldList.value.map((field, index) => ({
        ...field,
        order: index + 1
      }))
    }
    // 调用接口创建模型
    await createModelApi(submitData)
    ElMessage.success('模型创建成功')
    // 跳转到模型列表页
    router.push('/lowcode/model-list')
  } catch (error: any) {
    if (error.type !== 'cancel') {
      ElMessage.error('模型创建失败：' + (error.message || '未知错误'))
    }
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  // 获取角色列表
  try {
    const res = await getRoleListApi()
    roleList.value = res.data
  } catch (error) {
    ElMessage.warning('获取角色列表失败')
  }
})
</script>

<style scoped>
.model-create-container {
  padding: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.form-card {
  border-radius: 8px;
}

.base-form {
  padding: 10px 0;
}

.form-text {
  margin-top: 4px;
  font-size: 12px;
  color: #909399;
}

.field-config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
}

.field-preview {
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
}

.field-preview h4 {
  margin: 0 0 10px 0;
  font-size: 14px;
  font-weight: 600;
}

.empty-tip {
  font-size: 12px;
  color: #909399;
  padding: 10px;
  text-align: center;
}
</style>