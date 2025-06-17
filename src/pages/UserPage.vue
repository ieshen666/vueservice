<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col min-h-[600px]">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-outline border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 px-4 py-2 rounded-md transition-all">
          <i class="fa far fa-trash-alt mr-1"></i> 批量删除
        </button>
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus mr-1"></i> 创建人员
        </button>
      </div>
      
      <div class="flex flex-wrap items-center gap-2">
        <select 
          v-model="selectedType"
          class="input-control border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部类型</option>
          <option value="admin">系统管理员</option>
          <option value="user">普通用户</option>
        </select>
        
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="搜索用户名或昵称" 
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="flex-1 overflow-x-auto relative">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户名</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">昵称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">用户类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id" 
            class="hover:bg-gray-50"
          >
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ user.username }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ user.nickname }}</td>
            <td class="px-4 py-3 whitespace-nowrap">
              <span :class="userTypeClass(user.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ userTypeText(user.type) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ user.createTime }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-key"></i> 修改密码
              </button>
              <button class="text-yellow-500 hover:text-yellow-700 mr-3">
                <i class="fa fa-refresh"></i> 重置密码
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 无数据提示 -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="5" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的用户' : '暂无用户数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮创建用户' }}
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
            v-else v-for="i in (pageSize - paginatedUsers.length)" 
            :key="`empty-${i}`"
            class="border-b border-gray-200"
          >
            <td colspan="5" class="h-10"></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分页 -->
    <div class="mt-auto pt-4 border-t">
      <div class="flex items-center justify-between px-4 py-3 sm:px-6">
        <div class="flex-1 flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示 
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 
              到 
              <span class="font-medium">{{ Math.min(currentPage * pageSize, totalItems) }}</span> 
              条，共 
              <span class="font-medium">{{ totalItems }}</span> 条结果
            </p>
          </div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button 
              @click="prevPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
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

// 原始用户数据
const rawUsers = [
  { id: 1, username: 'admin', nickname: '系统管理员', type: 'admin', createTime: '2023-01-15' },
  { id: 2, username: 'user1', nickname: '测试用户1', type: 'user', createTime: '2023-02-20' },
  { id: 3, username: 'user2', nickname: '测试用户2', type: 'user', createTime: '2023-03-05' },
  { id: 4, username: 'user3', nickname: '测试用户3', type: 'user', createTime: '2023-03-18' },
  { id: 5, username: 'user4', nickname: '测试用户4', type: 'user', createTime: '2023-04-02' },
  { id: 6, username: 'user5', nickname: '测试用户5', type: 'user', createTime: '2023-04-15' },
  { id: 7, username: 'user6', nickname: '测试用户6', type: 'user', createTime: '2023-05-01' },
  { id: 8, username: 'user7', nickname: '测试用户7', type: 'user', createTime: '2023-05-12' },
  { id: 9, username: 'user8', nickname: '测试用户8', type: 'user', createTime: '2023-05-25' },
  { id: 10, username: 'user9', nickname: '测试用户9', type: 'user', createTime: '2023-06-05' },
  { id: 11, username: 'user10', nickname: '测试用户10', type: 'user', createTime: '2023-06-18' },
  { id: 12, username: 'user11', nickname: '测试用户11', type: 'user', createTime: '2023-07-02' },
  { id: 13, username: 'user12', nickname: '测试用户12', type: 'user', createTime: '2023-07-15' }
]

// 响应式数据
const users = ref([...rawUsers])
const currentPage = ref(1)
const pageSize = 7
const searchQuery = ref('')
const selectedType = ref('')

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchQuery.value || selectedType.value)

// 过滤后的用户列表
const filteredUsers = computed(() => {
  let result = [...users.value]
  
  // 用户类型过滤
  if (selectedType.value) {
    result = result.filter(user => user.type === selectedType.value)
  }
  
  // 模糊搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.username.toLowerCase().includes(query) ||
      user.nickname.toLowerCase().includes(query)
    )
  }
  
  return result
})

// 分页后的用户列表
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

// 计算总用户数
const totalItems = computed(() => filteredUsers.value.length)
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
  selectedType.value = ''
  currentPage.value = 1
}

// 用户类型显示方法
const userTypeClass = (type: string) => {
  return type === 'admin' 
    ? 'bg-purple-100 text-purple-800' 
    : 'bg-gray-100 text-gray-800'
}

const userTypeText = (type: string) => {
  return type === 'admin' ? '系统管理员' : '普通用户'
}

// 监听搜索条件变化
watch([searchQuery, selectedType], () => {
  currentPage.value = 1
})
</script>