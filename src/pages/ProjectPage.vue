<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col min-h-[600px]">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-outline border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 px-4 py-2 rounded-md transition-all">
          <i class="fa far fa-trash-alt mr-1"></i> 批量删除
        </button>
        <router-link 
          to="/create-project"
          class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all"
        >
          <i class="fa fa-plus mr-1"></i> 创建工程
        </router-link>

      </div>
      
      <div class="flex flex-wrap items-center gap-2">
        <select 
          v-model="selectedStatus"
          class="input-control border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部状态</option>
          <option value="undeployed">未部署</option>
          <option value="deployed">部署成功</option>
          <option value="deploying">部署中</option>
          <option value="failed">部署失败</option>
          <option value="deleting">删除中</option>
        </select>
        
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索工程名称" 
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 优化后的表格容器 -->
    <div class="flex-1 overflow-x-auto relative">
      <table class="min-w-full">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">部署状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">虚拟机数量</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建者</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody>
          <!-- 数据行 -->
          <tr 
            v-for="project in paginatedProjects" 
            :key="project.id" 
            class="hover:bg-gray-50 border-b border-gray-200"
          >
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ project.name }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span :class="statusClass(project.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ statusText(project.status) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ project.vmCount }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ project.creator }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ project.createTime }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-pencil"></i> 修改
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 无数据提示 -->
          <tr v-if="filteredProjects.length === 0">
            <td colspan="6" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的项目' : '暂无项目数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮创建项目' }}
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
          
          <!-- 空白行填充 -->
          <tr 
            v-else v-for="i in (pageSize - paginatedProjects.length)" 
            :key="`empty-${i}`"
            class="border-b border-gray-200"
          >
            <td colspan="6" class="h-10"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页组件 -->
    <div class="mt-auto pt-4 border-t">
      <div class="flex items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex-1 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第 
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 
              到 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 
              项，共 
              <span class="font-medium">{{ totalItems }}</span> 项
            </p>
          </div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">上一页</span>
              <i class="fa fa-chevron-left"></i>
            </button>
            
            <template v-for="page in displayedPages" :key="page">
              <button
                @click="goToPage(page)"
                :class="{
                  'bg-blue-500 text-white': page === currentPage,
                  'bg-white text-gray-500 hover:bg-gray-50': page !== currentPage
                }"
                class="px-3 py-2 border border-gray-300 text-sm font-medium"
              >
                {{ page }}
              </button>
            </template>
            
            <button 
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span class="sr-only">下一页</span>
              <i class="fa fa-chevron-right"></i>
            </button>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

// 原始项目数据
const rawProjects = [
  { id: 1, name: 'Web安全测试平台', status: 'deployed', vmCount: 5, creator: '管理员', createTime: '2023-05-15' },
  { id: 2, name: '漏洞扫描系统', status: 'undeployed', vmCount: 3, creator: '测试员', createTime: '2023-05-18' },
  { id: 3, name: '渗透测试环境', status: 'deploying', vmCount: 7, creator: '测试员', createTime: '2023-05-20' },
  { id: 4, name: '云原生安全靶场', status: 'failed', vmCount: 10, creator: '管理员', createTime: '2023-05-22' },
  { id: 5, name: '移动应用安全测试', status: 'deleting', vmCount: 4, creator: '测试员', createTime: '2023-05-25' },
  { id: 6, name: '容器安全检测', status: 'deployed', vmCount: 8, creator: '管理员', createTime: '2023-05-28' },
  { id: 7, name: 'API安全网关', status: 'deployed', vmCount: 2, creator: '测试员', createTime: '2023-06-01' },
  { id: 8, name: '数据加密服务', status: 'undeployed', vmCount: 6, creator: '管理员', createTime: '2023-06-05' },
  { id: 9, name: '防火墙管理系统', status: 'deploying', vmCount: 4, creator: '测试员', createTime: '2023-06-10' },
  { id: 10, name: '入侵检测系统', status: 'failed', vmCount: 5, creator: '管理员', createTime: '2023-06-15' },
  { id: 11, name: '日志分析平台', status: 'deployed', vmCount: 3, creator: '测试员', createTime: '2023-06-20' }
]

// 响应式数据
const projects = ref([...rawProjects])
const currentPage = ref(1)
const pageSize = 7
const searchQuery = ref('')
const selectedStatus = ref('')

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchQuery.value || selectedStatus.value)

// 过滤后的项目列表
const filteredProjects = computed(() => {
  let result = [...projects.value]
  
  // 状态过滤
  if (selectedStatus.value) {
    result = result.filter(project => project.status === selectedStatus.value)
  }
  
  // 模糊搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(project => 
      project.name.toLowerCase().includes(query) ||
      project.creator.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 分页后的项目列表
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredProjects.value.slice(start, end)
})

// 计算总项目数
const totalItems = computed(() => filteredProjects.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

// 智能分页显示
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

// 分页方法
const prevPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++
const goToPage = (page: number | string) => typeof page === 'number' && (currentPage.value = page)

// 清除搜索条件
const clearSearch = () => {
  searchQuery.value = ''
  selectedStatus.value = ''
  currentPage.value = 1
}

// 状态显示方法
const statusClass = (status: string) => {
  switch(status) {
    case 'deployed': return 'bg-green-100 text-green-800'
    case 'deploying': return 'bg-blue-100 text-blue-800'
    case 'undeployed': return 'bg-gray-100 text-gray-800'
    case 'failed': return 'bg-red-100 text-red-800'
    case 'deleting': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const statusText = (status: string) => {
  switch(status) {
    case 'deployed': return '部署成功'
    case 'deploying': return '部署中'
    case 'undeployed': return '未部署'
    case 'failed': return '部署失败'
    case 'deleting': return '删除中'
    default: return status
  }
}

// 监听搜索条件变化
watch([searchQuery, selectedStatus], () => {
  currentPage.value = 1
})
</script>