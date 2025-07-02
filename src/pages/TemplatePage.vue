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
          v-model="selectedRange"
          class="input-control border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          @change="resetPage"
        >
          <option value="">全部靶场</option>
          <option value="主靶场">主靶场</option>
          <option value="分靶场一">分靶场一</option>
          <option value="分靶场二">分靶场二</option>
          <option value="分靶场三">分靶场三</option>
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
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名称
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建者
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              所属靶场
            </th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              创建时间
            </th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="template in pagedTemplates"
            :key="template.id"
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              <div class="flex items-center">
                <i class="fa fa-cube mr-2 text-blue-500"></i>
                {{ template.name }}
              </div>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ template.creator }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ template.range }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ template.createTime }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button
                class="text-blue-500 hover:text-blue-700 mr-3"
                @click="createProjectFromTemplate(template)"
              >
                <i class="fa fa-plus mr-1"></i> 创建工程
              </button>

              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-pencil"></i> 修改
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 优化后的无结果提示 -->
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
    <div 
      v-if="filteredTemplates.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <div class="text-sm text-gray-600">
        显示第
        <span class="font-medium">{{ startIndex + 1 }}</span>
        -
        <span class="font-medium">{{ Math.min(endIndex, filteredTemplates.length) }}</span>
        项，共
        <span class="font-medium">{{ filteredTemplates.length }}</span>
        项
      </div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
          class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">上一页</span>
          <i class="fa fa-chevron-left"></i>
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="changePage(page)"
          :class="[
            'relative inline-flex items-center px-3 py-2 border text-sm font-medium',
            page === currentPage
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-50',
          ]"
        >
          {{ page }}
        </button>
        <button
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
          class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span class="sr-only">下一页</span>
          <i class="fa fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useTemplateStore } from '@/stores/useTemplateStore'
import { useRouter } from 'vue-router'

// 原始模板数据
const templates = ref([
  {
    id: 1,
    name: 'Web漏洞测试模板',
    creator: '管理员',
    range: '主靶场',
    createTime: '2023-03-15',
  },
  {
    id: 2,
    name: 'SQL注入测试模板',
    creator: '测试员',
    range: '主靶场',
    createTime: '2023-04-02',
  },
  {
    id: 3,
    name: 'XSS攻击测试模板',
    creator: '测试员',
    range: '分靶场一',
    createTime: '2023-04-18',
  },
  {
    id: 4,
    name: 'CSRF攻击测试模板',
    creator: '管理员',
    range: '分靶场二',
    createTime: '2023-05-05',
  },
  {
    id: 5,
    name: '文件上传漏洞模板',
    creator: '测试员',
    range: '分靶场三',
    createTime: '2023-05-20',
  },
])
const templateStore = useTemplateStore()
const router = useRouter()
const selectedRange = ref('')
const searchText = ref('')
const currentPage = ref(1)
const pageSize = 7

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchText.value || selectedRange.value)

// 智能分页显示（带省略号）
const displayedPages = computed(() => {
  const maxVisiblePages = 5
  const pages = []
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const leftBound = Math.max(1, currentPage.value - 2)
    const rightBound = Math.min(totalPages.value, currentPage.value + 2)
    
    if (leftBound > 1) pages.push(1)
    if (leftBound > 2) pages.push('...')
    
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i)
    }
    
    if (rightBound < totalPages.value - 1) pages.push('...')
    if (rightBound < totalPages.value) pages.push(totalPages.value)
  }
  
  return pages
})

// 过滤后的模板（根据选择的range和搜索文本，支持模糊搜索）
const filteredTemplates = computed(() => {
  return templates.value.filter((item) => {
    const matchesRange = selectedRange.value
      ? item.range === selectedRange.value
      : true
    const matchesSearch = searchText.value
      ? item.name.toLowerCase().includes(searchText.value.toLowerCase())
      : true
    return matchesRange && matchesSearch
  })
})

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredTemplates.value.length / pageSize) || 1
})

// 当前页数据
const pagedTemplates = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredTemplates.value.slice(start, end)
})

// 分页起止索引，用于显示"显示 x 到 y 条"
const startIndex = computed(() => (filteredTemplates.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize))
const endIndex = computed(() => currentPage.value * pageSize)

function changePage(page: number) {
  if (page < 1) page = 1
  if (page > totalPages.value) page = totalPages.value
  currentPage.value = page
}

function resetPage() {
  currentPage.value = 1
}
function createProjectFromTemplate(template: any) {
  templateStore.setTemplate({
    name: template.name,
    description: '从已有模板导入',
    yaml: `# ${template.name} 示例拓扑\nversion: 1\nnodes:\n  - name: node1\n    type: router`
  })
  router.push('/create-project')
}
function clearSearch() {
  searchText.value = ''
  selectedRange.value = ''
  currentPage.value = 1
}

// 当筛选条件或搜索变化时，重置页码到1
watch([selectedRange, searchText], () => {
  currentPage.value = 1
})
</script>