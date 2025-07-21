<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-3"></div>
      <p class="text-gray-600">正在加载镜像数据...</p>
    </div>

    <!-- 内容区域 -->
    <template v-else>
      <!-- 操作栏 -->
      <div class="flex flex-wrap items-center justify-between mb-4">
        <div class="flex flex-wrap gap-2 mb-2">
          <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
            <i class="fa fa-upload mr-1"></i> 镜像上传
          </button>
        </div>
        <div class="flex items-center gap-2">
          <div class="relative">
            <input
              type="text"
              v-model="searchQuery"
              placeholder="搜索镜像名称"
              class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
              @input="handleSearchInput"
            />
            <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>
      </div>

      <!-- 镜像表格 -->
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像名称</th>
              <th class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像大小</th>
              <th class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像配置</th>
              <th class="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建者</th>
              <th class="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
              <th class="w-1/6 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="image in paginatedImages" :key="image.id" class="hover:bg-gray-50">
              <!-- 镜像名称列 - 自动换行 + 悬停提示 -->
              <td 
                class="px-4 py-3 text-sm text-gray-900 whitespace-normal break-words"
                :title="image.name.length > 30 ? image.name : ''"
              >
                <i class="fa fa-cube mr-2 text-blue-500"></i>
                {{ image.name }}
              </td>
              
              <!-- 镜像大小列 -->
              <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {{ image.size }}
              </td>
              
              <!-- 镜像配置列 -->
              <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {{ image.config }}
              </td>
              
              <!-- 创建者列 - 自动换行 + 悬停提示 -->
              <td 
                class="px-4 py-3 text-sm text-gray-500 whitespace-normal break-words"
                :title="image.creator && image.creator.length > 20 ? image.creator : ''"
              >
                {{ image.creator }}
              </td>
              
              <!-- 创建时间列 -->
              <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                {{ image.createTime }}
              </td>
              
              <!-- 操作列 -->
              <td class="px-4 py-3 text-right text-sm font-medium whitespace-nowrap">
                <button class="text-blue-500 hover:text-blue-700 mr-3">
                  <i class="fas fa-shield-alt"></i> 验证
                </button>
                <button class="text-red-500 hover:text-red-700">
                  <i class="fa fa-trash"></i> 删除
                </button>
              </td>
            </tr>
            
            <tr v-if="filteredImages.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center">
                  <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                  <p class="text-gray-500 font-medium text-lg mb-1">
                    {{ searchQuery ? '没有找到匹配的镜像' : '暂无镜像数据' }}
                  </p>
                  <p class="text-gray-400 text-sm">
                    {{ searchQuery ? '请尝试其他搜索关键词' : '点击上方按钮上传镜像' }}
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

      <!-- 分页 -->
      <div 
        v-if="filteredImages.length > 0"
        class="flex items-center justify-between px-4 py-3 mt-4"
      >
        <p class="text-sm text-gray-600">
          显示第 {{ startItem + 1 }} - {{ endItem }} 项，共 {{ filteredImages.length }} 项
        </p>
        <div class="inline-flex rounded-md shadow-sm -space-x-px">
          <button
            @click="changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fa fa-chevron-left"></i>
          </button>

          <template v-for="page in visiblePages" :key="page">
            <button
              v-if="page === '...'"
              disabled
              class="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-gray-500"
            >
              ...
            </button>
            <button
              v-else
              @click="changePage(page)"
              :class="[
                'relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium',
                currentPage === page
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-500 hover:bg-gray-50',
              ]"
            >
              {{ page }}
            </button>
          </template>

          <button
            @click="changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

// 状态定义
const isLoading = ref(true)
const images = ref<any[]>([])
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 10

const authInfo = {
  name: 'admin',
  password: 'Admin@2023',
  domain: {
    name: 'default'
  }
}

// 获取 token 函数（带最小延迟）
async function fetchToken(): Promise<string> {
  try {
    const [response] = await Promise.all([
      axios.post(
        '/api/v3/auth/tokens',
        {
          auth: {
            identity: {
              methods: ['password'],
              password: {
                user: authInfo
              }
            }
          }
        },
        { validateStatus: () => true }
      ),
      new Promise(resolve => setTimeout(resolve, 500)) // 最小加载时间
    ])

    if (response.status === 201) {
      const token = response.headers['x-subject-token']
      if (!token) throw new Error('未找到 X-Subject-Token')
      return token
    }
    throw new Error(`认证失败: ${response.status}`)
  } catch (err) {
    console.error('获取 token 失败:', err)
    throw err
  }
}

// 获取镜像数据
async function fetchImages() {
  try {
    const token = await fetchToken()
    const response = await axios.get('/api/os/image/v1/v2/images', {
      headers: {
        'Accept': 'application/json',
        'X-Auth-Token': token,
      },
    })


    images.value = response.data.images.map((img) => ({
      id: img.id,
      name: img.name,
      size: formatSize(img.size),
      config: `${img.min_cpu || '?'}核${Math.round((img.min_ram || 0) / 1024)}G`,
      creator: img.owner,
      createTime: formatDate(img.created_at),
    }))
  } catch (error) {
    console.error('获取镜像失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 工具函数
function formatSize(bytes: number): string {
  if (!bytes) return '未知'
  const gb = bytes / (1024 ** 3)
  return `${gb.toFixed(1)}GB`
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toISOString().split('T')[0]
}

// 计算属性
const filteredImages = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return query 
    ? images.value.filter(img => img.name.toLowerCase().includes(query))
    : images.value
})

const totalPages = computed(() => Math.ceil(filteredImages.value.length / pageSize))

const paginatedImages = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredImages.value.slice(start, start + pageSize)
})

const startItem = computed(() => (currentPage.value - 1) * pageSize)
const endItem = computed(() => Math.min(startItem.value + pageSize, filteredImages.value.length))

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  const range = 1
  let pages = []

  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
    return pages
  }

  pages.push(1)
  if (current > range + 2) pages.push('...')

  const start = Math.max(current - range, 2)
  const end = Math.min(current + range, total - 1)
  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i)
  }

  if (current < total - range - 1 && !pages.includes('...')) pages.push('...')
  if (!pages.includes(total)) pages.push(total)

  return pages
})

// 方法
function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function clearSearch() {
  searchQuery.value = ''
  currentPage.value = 1
}

function handleSearchInput() {
  currentPage.value = 1
}

// 生命周期
onMounted(() => {
  setTimeout(() => {
    fetchImages()
  }, 200) // 初始延迟确保加载动画显示
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
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 为表格单元格添加最小高度，保持行高一致 */
td {
  min-height: 3rem;
  vertical-align: top;
}
</style>