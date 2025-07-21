<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button
          class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all"
        >
          <i class="fa fa-plus mr-1"></i> 新建工程模板
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="selectedIndustry"
          class="input-control border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          @change="resetPage"
        >
          <option value="">全部行业</option>
          <option value="教育">教育</option>
          <option value="医疗">医疗</option>
          <option value="金融">金融</option>
          <option value="电气">电气</option>
          <option value="制造">制造</option>
          <option value="政府">政府</option>
          <option value="互联网">互联网</option>
        </select>

        <div class="relative">
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索模板名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            @input="resetPage"
          />
          <i
            class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          ></i>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建者</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属行业</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="template in pagedTemplates" :key="template.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              <div class="flex items-center">
                <i class="fa fa-cube mr-2 text-blue-500"></i>
                {{ template.name }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ template.creator }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ template.industry }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ formatDate(template.createTime) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3" @click="createProjectFromTemplate(template)">
                <i class="fa fa-plus mr-1"></i> 创建工程
              </button>
              <button class="text-blue-500 hover:text-blue-700 mr-3"><i class="fa fa-pencil"></i> 修改</button>
              <button 
                class="text-red-500 hover:text-red-700" 
                @click="confirmDelete(template)"
                :disabled="isDeleting && deletingId === template.id"
              >
                <i class="fa fa-trash"></i> 删除
                <span v-if="isDeleting && deletingId === template.id" class="ml-1">
                  <i class="fa fa-spinner fa-spin"></i>
                </span>
              </button>
            </td>
          </tr>

          <tr v-if="filteredTemplates.length === 0">
            <td colspan="5" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的模板' : '暂无模板数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮创建模板' }}
                </p>
                <button
                  v-if="hasSearchCriteria"
                  @click="clearSearch"
                  class="mt-3 text-blue-500 hover:text-blue-700 text-sm flex items-center"
                >
                  <i class="fa fa-times mr-1"></i> 清除搜索条件
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div v-if="filteredTemplates.length > 0" class="flex items-center justify-between px-4 py-3 mt-4">
      <div class="text-sm text-gray-600">
        显示第 <span class="font-medium">{{ startIndex + 1 }}</span> -
        <span class="font-medium">{{ Math.min(endIndex, filteredTemplates.length) }}</span> 项，共
        <span class="font-medium">{{ filteredTemplates.length }}</span> 项
      </div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-left"></i>
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'relative inline-flex items-center px-3 py-2 border text-sm font-medium',
            page === currentPage ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useTemplateStore } from '@/stores/useTemplateStore'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { ElMessageBox, ElNotification } from 'element-plus'

const templateStore = useTemplateStore()
const router = useRouter()
const templates = ref<any[]>([])

const selectedIndustry = ref('')
const searchText = ref('')
const currentPage = ref(1)
const pageSize = 7
const isDeleting = ref(false)
const deletingId = ref<string | null>(null)

const hasSearchCriteria = computed(() => searchText.value || selectedIndustry.value)

// 获取模板列表
const fetchTemplates = async () => {
  try {
    const res = await axios.get('http://10.10.5.8:8080/api/templates')
    templates.value = res.data
  } catch (error) {
    console.error('获取模板失败:', error)
    ElNotification({
      title: '错误',
      message: '获取模板列表失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 删除模板
const deleteTemplate = async (id: string) => {
  isDeleting.value = true
  deletingId.value = id
  
  try {
    await axios.delete(`http://10.10.5.8:8080/api/templates/${id}`)
    
    ElNotification({
      title: '成功',
      message: '模板删除成功',
      type: 'success',
      duration: 3000
    })
    
    // 重新获取最新列表
    await fetchTemplates()
    
    // 如果删除的是最后一页的最后一项，且当前不是第一页，则自动跳转到前一页
    if (pagedTemplates.value.length === 0 && currentPage.value > 1) {
      currentPage.value -= 1
    }
  } catch (error) {
    console.error('删除模板失败:', error)
    let errorMessage = '删除模板时出错'
    if (error.response) {
      errorMessage = error.response.data?.message || errorMessage
    }
    ElNotification({
      title: '错误',
      message: errorMessage,
      type: 'error',
      duration: 5000
    })
  } finally {
    isDeleting.value = false
    deletingId.value = null
  }
}

// 确认删除对话框
const confirmDelete = (template: any) => {
  ElMessageBox.confirm(
    `确定要删除模板 "${template.name}" 吗？此操作不可恢复。`,
    '删除确认',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      customClass: 'delete-confirm-dialog',
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true
          deleteTemplate(template.id).finally(() => {
            instance.confirmButtonLoading = false
            done()
          })
        } else {
          done()
        }
      }
    }
  ).catch(() => {
    // 用户取消删除
  })
}

// 工具函数格式化时间
const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString()
}

// 过滤 + 搜索
const filteredTemplates = computed(() => {
  return templates.value.filter((item) => {
    const matchIndustry = selectedIndustry.value ? item.industry === selectedIndustry.value : true
    const matchSearch = searchText.value ? item.name.toLowerCase().includes(searchText.value.toLowerCase()) : true
    return matchIndustry && matchSearch
  })
})

// 分页
const totalPages = computed(() => Math.ceil(filteredTemplates.value.length / pageSize) || 1)
const pagedTemplates = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTemplates.value.slice(start, end)
})
const startIndex = computed(() => (filteredTemplates.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize))
const endIndex = computed(() => currentPage.value * pageSize)

// 分页控件
const displayedPages = computed(() => {
  const maxVisible = 5
  const pages = []
  if (totalPages.value <= maxVisible) {
    for (let i = 1; i <= totalPages.value; i++) pages.push(i)
  } else {
    const left = Math.max(1, currentPage.value - 2)
    const right = Math.min(totalPages.value, currentPage.value + 2)
    if (left > 1) pages.push(1)
    if (left > 2) pages.push('...')
    for (let i = left; i <= right; i++) pages.push(i)
    if (right < totalPages.value - 1) pages.push('...')
    if (right < totalPages.value) pages.push(totalPages.value)
  }
  return pages
})

function changePage(page: number) {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

function resetPage() {
  currentPage.value = 1
}

function clearSearch() {
  selectedIndustry.value = ''
  searchText.value = ''
  currentPage.value = 1
}

async function createProjectFromTemplate(template: any) {
  try {
    const res = await axios.get(`http://10.10.5.8:8080/api/templates/${template.id}`)

    // 写入 pinia
    templateStore.setTemplate({
      id: res.data.id,
      name: res.data.name,
      description: res.data.description,
      industry: res.data.industry,
      jsonCode: res.data.jsonCode,
      pyCode: res.data.pyCode,
    })

    // 跳转
    router.push('/create-project')
  } catch (error) {
    console.error('获取模板详情失败:', error)
    ElNotification({
      title: '错误',
      message: '获取模板详情失败',
      type: 'error',
      duration: 3000
    })
  }
}

// 初始化加载数据
onMounted(fetchTemplates)

// 监听搜索条件变化
watch([selectedIndustry, searchText], resetPage)
</script>

<style>
.delete-confirm-dialog {
  min-width: 400px;
}
.delete-confirm-dialog .el-message-box__content {
  padding: 20px;
}
.delete-confirm-dialog .el-message-box__btns {
  padding: 10px 20px 20px;
}
</style>