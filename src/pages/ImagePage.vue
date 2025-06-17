<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
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
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像大小</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像配置</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建者</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="image in paginatedImages" :key="image.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              <i class="fa fa-cube mr-2 text-blue-500"></i>
              {{ image.name }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ image.size }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ image.config }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ image.creator }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ image.createTime }}</td>
            <td class="px-4 py-3 text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-check"></i> 验证
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 优化后的无结果提示 -->
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

        <button
          v-for="page in totalPages"
          :key="page"
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

        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const images = ref([
  { id: 1, name: 'Ubuntu 20.04 基础环境', size: '2.8GB', config: '2核4G', creator: '张三', createTime: '2023-04-10' },
  { id: 2, name: 'Metasploit 渗透测试环境', size: '3.5GB', config: '4核8G', creator: '李四', createTime: '2023-04-15' },
  { id: 3, name: 'Wireshark 网络分析环境', size: '1.9GB', config: '2核4G', creator: '王五', createTime: '2023-04-20' },
  { id: 4, name: 'SQL注入测试环境', size: '2.2GB', config: '2核4G', creator: '赵六', createTime: '2023-04-25' },
  { id: 5, name: 'WebGoat 漏洞测试平台', size: '3.1GB', config: '4核8G', creator: '钱七', createTime: '2023-05-01' },
  { id: 6, name: 'Kali Linux 红队环境', size: '4.0GB', config: '8核16G', creator: '孙八', createTime: '2023-05-10' },
  { id: 7, name: 'Nmap 扫描平台', size: '1.5GB', config: '1核2G', creator: '周九', createTime: '2023-05-15' },
  { id: 8, name: 'BurpSuite 测试平台', size: '2.6GB', config: '4核4G', creator: '吴十', createTime: '2023-05-20' },
  { id: 9, name: 'Docker 基础环境', size: '1.8GB', config: '2核2G', creator: '郑一', createTime: '2023-05-22' },
  { id: 10, name: 'DVWA 漏洞演练环境', size: '2.0GB', config: '2核4G', creator: '冯二', createTime: '2023-05-25' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 7

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
const endItem = computed(() => Math.min(startItem.value + paginatedImages.value.length, filteredImages.value.length))

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
  // 搜索时自动回到第一页
  currentPage.value = 1
}
</script>