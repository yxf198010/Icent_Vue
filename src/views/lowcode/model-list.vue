<template>
  <div class="model-list-container">
    <!-- 页面头部：标题 + 操作按钮 -->
    <div class="header">
      <h2>低代码模型管理</h2>
    <el-button 
      type="danger" 
      size="small" 
      @click="batchDeleteModel"
      :disabled="selectedRows.length === 0"
    >
      批量删除
    </el-button>
    <el-button type="primary" @click="goToCreateModel">新建模型</el-button>
    </div>

    <!-- 搜索栏 -->
    <el-card class="search-card" shadow="hover">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="模型名称">
          <el-input
            v-model="searchForm.name"
            placeholder="请输入模型名称"
            clearable
            @keyup.enter="fetchModelList"
          />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchModelList">查询</el-button>
          <el-button @click="resetSearchForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 模型列表 -->
    <el-card class="list-card" shadow="hover">
      <el-table
        v-loading="loading"
        :data="modelList"
        border
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column prop="id" label="ID" width="80" align="center" />
        <el-table-column prop="name" label="模型名称" min-width="150" />
        <el-table-column prop="tableName" label="数据库表名" min-width="180" />
        <el-table-column prop="description" label="模型描述" min-width="200" />
        <el-table-column
          prop="status"
          label="状态"
          width="100"
          align="center"
        >
          <template #default="scope">
            <el-tag :type="scope.row.status === 'active' ? 'success' : 'danger'">
              {{ scope.row.status === 'active' ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="goToEditModel(scope.row.id)"
            >
              编辑
            </el-button>
            <el-button
              type="warning"
              size="small"
              @click="goToUpgradeModel(scope.row.id)"
            >
              升级
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteModel(scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页控件 -->
      <el-pagination
        v-model:current-page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="fetchModelList"
        @current-change="fetchModelList"
        style="margin-top: 20px; text-align: right"
      />
    </el-card>
  </div>
</template>

<script setup>
// 导入核心依赖
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
// 假设API请求函数已封装在api/lowcode中，可根据实际路径调整
import {
  getModelListApi,
  deleteModelApi,
  batchDeleteModelApi
} from '@/api/lowcode'

// 初始化路由实例
const router = useRouter()

// 响应式数据 - 加载状态
const loading = ref(false)

// 响应式数据 - 搜索表单
const searchForm = ref({
  name: '',
  status: ''
})

// 响应式数据 - 模型列表
const modelList = ref([])

// 响应式数据 - 分页参数
const pagination = ref({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 响应式数据 - 表格选中项
const selectedRows = ref([])

// 页面挂载时加载列表
onMounted(() => {
  fetchModelList()
})

// 获取模型列表
const fetchModelList = async () => {
  try {
    loading.value = true
    // 构造请求参数
    const params = {
      pageNum: pagination.value.pageNum,
      pageSize: pagination.value.pageSize,
      name: searchForm.value.name,
      status: searchForm.value.status
    }
    // 调用API获取列表
    const res = await getModelListApi(params)
    if (res.code === 200) {
      modelList.value = res.data.list
      pagination.value.total = res.data.total
    } else {
      ElMessage.error(res.msg || '获取模型列表失败')
    }
  } catch (error) {
    ElMessage.error('网络异常，获取模型列表失败')
    console.error('获取模型列表失败：', error)
  } finally {
    loading.value = false
  }
}

// 重置搜索表单
const resetSearchForm = () => {
  searchForm.value = {
    name: '',
    status: ''
  }
  // 重置后重新查询
  fetchModelList()
}

// 处理表格选中项变化
const handleSelectionChange = (val) => {
  selectedRows.value = val
}

// 跳转到新建模型页
const goToCreateModel = () => {
  router.push('/lowcode/model-create')
}

// 跳转到编辑模型页
const goToEditModel = (id) => {
  router.push(`/lowcode/model-edit/${id}`)
}

// 跳转到模型升级页
const goToUpgradeModel = (id) => {
  router.push(`/lowcode/model-upgrade/${id}`)
}

// 删除单个模型
const deleteModel = async (id) => {
  try {
    await ElMessageBox.confirm(
      '确定要删除该模型吗？删除后数据将无法恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const res = await deleteModelApi(id)
    if (res.code === 200) {
      ElMessage.success('删除成功')
      // 重新加载列表
      fetchModelList()
    } else {
      ElMessage.error(res.msg || '删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
      console.error('删除模型失败：', error)
    }
  }
}

// 批量删除模型（可扩展，需在页面添加批量删除按钮）
const batchDeleteModel = async () => {
  if (selectedRows.value.length === 0) {
    ElMessage.warning('请选择要删除的模型')
    return
  }
  try {
    await ElMessageBox.confirm(
      '确定要删除选中的模型吗？删除后数据将无法恢复！',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    const ids = selectedRows.value.map(item => item.id)
    const res = await batchDeleteModelApi(ids)
    if (res.code === 200) {
      ElMessage.success('批量删除成功')
      fetchModelList()
    } else {
      ElMessage.error(res.msg || '批量删除失败')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('批量删除失败')
      console.error('批量删除模型失败：', error)
    }
  }
}
</script>

<style scoped>
.model-list-container {
  padding: 20px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h2 {
  margin: 0;
  color: #303133;
}

.search-card {
  margin-bottom: 20px;
}

.search-form {
  margin: 0;
}

.list-card {
  min-height: 400px;
}
</style>