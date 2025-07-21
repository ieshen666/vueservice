<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
      <p class="text-gray-600">正在加载工程数据...</p>
    </div>

    <!-- 正常内容 -->
    <template v-else>
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

        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索工程名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            @input="handleSearchInput"
          />
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>

      <!-- 表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-1/2 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">工程名称</th>
              <th class="w-1/4 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">描述</th>
              <th class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">是否启用</th>
              <th class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th class="w-1/5 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="project in paginatedProjects" :key="project.id" class="hover:bg-gray-50">
              <!-- 工程名称列 - 自动换行 + 悬停提示 -->
              <td 
                class="px-4 py-3 text-sm text-gray-900 whitespace-normal break-words"
                :title="project.name.length > 30 ? project.name : ''"
              >
                <i class="fa fa-folder text-blue-500 mr-2"></i>
                {{ project.name }}
              </td>
              
              <!-- 描述列 - 自动换行 + 悬停提示 -->
              <td 
                class="px-4 py-3 text-sm text-gray-500 whitespace-normal break-words"
                :title="project.description && project.description.length > 30 ? project.description : ''"
              >
                {{ project.description || '—' }}
              </td>
              
              <!-- 是否启用列 -->
              <td class="px-4 py-3 whitespace-nowrap text-sm">
                <span
                  :class="String(project.enabled) === 'true' ? 'text-green-600 font-semibold' : 'text-red-500 font-semibold'"
                >
                  {{ project.enabled ? ' 启用' : ' 禁用' }}
                </span>
              </td>

              <!-- 创建时间列 -->
              <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {{ formatDate(project.createTime) }}
              </td>
              
              <!-- 操作列 -->
              <td class="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <button class="text-blue-500 hover:text-blue-700 mr-3">
                  <i class="fa fa-pencil"></i> 修改
                </button>
                <button class="text-red-500 hover:text-red-700">
                  <i class="fa fa-trash"></i> 删除
                </button>
              </td>
            </tr>

            <tr v-if="filteredProjects.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                  <p class="text-gray-500 font-medium text-lg mb-1">
                    {{ searchQuery ? '没有找到匹配的工程' : '暂无工程数据' }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    {{ searchQuery ? '请尝试其他关键词' : '请稍后添加工程' }}
                  </p>
                  <button 
                    v-if="searchQuery"
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

      <!-- 分页组件 -->
      <div v-if="filteredProjects.length > 0" class="flex items-center justify-between px-4 py-3 mt-4">
        <p class="text-sm text-gray-600">
          显示第 {{ startItem + 1 }} - {{ endItem }} 项，共 {{ filteredProjects.length }} 项
        </p>
        <div class="inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <i class="fa fa-chevron-left"></i>
          </button>
          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page === '...'" disabled
              class="px-3 py-2 border border-gray-300 bg-white text-gray-500"
            >...</button>
            <button
              v-else
              @click="changePage(page)"
              :class="[
                'px-3 py-2 border border-gray-300 text-sm font-medium',
                currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'
              ]"
            >{{ page }}</button>
          </template>
          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-2 border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50"
          >
            <i class="fa fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'

const isLoading = ref(true)
const projects = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const authInfo = {
  name: 'admin',
  password: 'Admin@2023',
  domain: { name: 'default' }
}

async function fetchToken(): Promise<string> {
  const [res] = await Promise.all([
    axios.post('/api/v3/auth/tokens', {
      auth: {
        identity: {
          methods: ['password'],
          password: { user: authInfo }
        }
      }
    }, { validateStatus: () => true }),
    new Promise(resolve => setTimeout(resolve, 500))
  ])

  if (res.status === 201) {
    const token = res.headers['x-subject-token']
    if (!token) throw new Error('未获取到 Token')
    return token
  }
  throw new Error(`认证失败: ${res.status}`)
}

async function fetchProjects() {
  try {
    const token = await fetchToken()
    const response = await axios.get('api/sys/oapi/v1/getProjects', {
      headers: { 'X-Auth-Token': token }
    })

    const tree = response.data.res?.[0]?.children || []
    projects.value = tree.map((node: any) => ({
      id: node.id,
      name: node.name,
      description: node.description,
      createTime: node.createTime,
      enabled:node.enabled
    }))
  } catch (err) {
    console.error('加载工程失败:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  setTimeout(() => {
    fetchProjects()
  }, 200)
})

// 工具函数
function formatDate(val: string): string {
  return val ? new Date(val).toISOString().split('T')[0] : '—'
}

// 过滤、分页
const filteredProjects = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return query
    ? projects.value.filter(p => p.name.toLowerCase().includes(query))
    : projects.value
})
const totalPages = computed(() => Math.ceil(filteredProjects.value.length / pageSize))
const paginatedProjects = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredProjects.value.slice(start, start + pageSize)
})

const startItem = computed(() => (currentPage.value - 1) * pageSize)
const endItem = computed(() => Math.min(startItem.value + pageSize, filteredProjects.value.length))

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
}
function handleSearchInput() {
  currentPage.value = 1
}
function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

// 分页页码展示
const visiblePages = computed(() => {
  const current = currentPage.value, total = totalPages.value
  const pages = []
  if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1)
  pages.push(1)
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i)
  }
  if (current < total - 2) pages.push('...')
  if (total > 1) pages.push(total)
  return pages
})
</script>

<style scoped>

table {
  table-layout: fixed;
  width: 100%;
}

th:last-child, 
td:last-child {
  min-width: 120px;
}

/* 确保空状态行正确显示 */
tr[colspan] td {
  display: table-cell;
  width: 100%;
}
.animate-spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}



/* 为表格单元格添加最小高度，保持行高一致 */
td {
  min-height: 3rem;
  vertical-align: top;
}
</style>