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
            placeholder="搜索用户名" 
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
            <td class="px-4 py-3 whitespace-nowrap">
              <span :class="userTypeClass(user.type)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ userTypeText(user.type) }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ user.createTime }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button 
                class="text-yellow-500 hover:text-yellow-700 mr-3"
                @click="resetPassword(user.id)"
              >
                <i class="fa fa-refresh"></i> 重置密码
              </button>
              <button 
                class="text-red-500 hover:text-red-700"
                @click="deleteUser(user.id)"
              >
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>

          </tr>
          
          <!-- 无数据提示 -->
          <tr v-if="filteredUsers.length === 0">
            <td colspan="4" class="py-8 text-center">
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
            <td colspan="4" class="h-10"></td>
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
import { ref, computed, watch, onMounted } from 'vue'
import request from '@/utils/request'
import { ElMessageBox, ElMessage } from 'element-plus'

// 定义用户类型
interface User {
  id: number
  username: string
  type: string
  createTime: string
}

// 响应式数据
const users = ref<User[]>([])

const currentPage = ref(1)
const pageSize = 7
const searchQuery = ref('')
const selectedType = ref('')

// 是否有搜索条件
const hasSearchCriteria = computed(() => searchQuery.value || selectedType.value)

// 过滤用户
const filteredUsers = computed(() => {
  let result = [...users.value]

  // 类型筛选
  if (selectedType.value) {
    result = result.filter(user => user.type === selectedType.value)
  }

  // 搜索用户名模糊匹配
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(user => user.username.toLowerCase().includes(q))
  }

  return result
})

// 分页
const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return filteredUsers.value.slice(start, end)
})

// 总数和总页数
const totalItems = computed(() => filteredUsers.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))

// 智能分页
const displayedPages = computed(() => {
  const maxPages = 5
  const pages: Array<number | string> = []

  if (totalPages.value <= maxPages) {
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

// 翻页函数
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
const goToPage = (page: number | string) => {
  if (typeof page === 'number') currentPage.value = page
}

// 清除搜索
const clearSearch = () => {
  searchQuery.value = ''
  selectedType.value = ''
  currentPage.value = 1
}

// 用户类型样式
const userTypeClass = (type: string) => {
  return type === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'
}
const userTypeText = (type: string) => {
  return type === 'admin' ? '系统管理员' : '普通用户'
}

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString() // 或者使用更具体的格式化方式
}

// 监听搜索筛选条件重置页码
watch([searchQuery, selectedType], () => {
  currentPage.value = 1
})

// 页面加载时请求后端用户数据
onMounted(async () => {
  try {
    const res = await request.get('/api/auth')
    users.value = res.data.data || []
  } catch (error) {
    console.error('获取用户列表失败', error)
    users.value = []
  }
})

// 重置密码
const resetPassword = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '确定要重置该用户的密码吗？',
      '确认操作',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    )
    await request.put(`/api/auth/${id}/reset-password`)
    ElMessage.success('密码已重置为默认值')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('重置密码失败', error)
      ElMessage.error('重置密码失败')
    }
  }
}

// 删除用户
const deleteUser = async (id: number) => {
  try {
    await ElMessageBox.confirm(
      '删除操作不可恢复，是否确认删除该用户？',
      '危险操作',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    await request.delete(`/api/auth/${id}`)
    // 前端同步移除用户
    users.value = users.value.filter(user => user.id !== id)
    ElMessage.success('用户删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败', error)
      ElMessage.error('删除用户失败')
    }
  }
}

</script>