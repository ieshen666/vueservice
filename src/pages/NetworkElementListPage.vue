<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus mr-1"></i> 添加网元
        </button>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索网元名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            @input="handleSearchInput"
          />
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 网元表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">网元名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">设备数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">镜像数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">模板数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建者</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="node in paginatedElements" :key="node.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900 font-medium">
              <div class="flex items-center">
                <i class="fa fa-server text-blue-500 mr-2"></i>
                {{ node.name }}
              </div></td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ node.deviceCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ node.imageCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ node.templateCount }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ node.creator }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ node.createTime }}</td>
            <td class="px-4 py-3 text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-eye"></i> 查看
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>

          <!-- 无数据提示 -->
          <tr v-if="filteredElements.length === 0">
            <td colspan="7" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-database text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ searchQuery ? '未找到相关网元' : '暂无网元数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ searchQuery ? '请尝试其他搜索关键词' : '点击上方按钮添加网元' }}
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
    <div v-if="filteredElements.length > 0" class="flex items-center justify-between px-4 py-3 mt-4">
      <p class="text-sm text-gray-600">
        显示第 {{ startItem + 1 }} - {{ endItem }} 项，共 {{ filteredElements.length }} 项
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
            currentPage === page ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-500 hover:bg-gray-50',
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

const networkElements = ref([
  { id: 1, name: '网元A', deviceCount: 10, imageCount: 3, templateCount: 2, creator: '张三', createTime: '2023-06-01' },
  { id: 2, name: '网元B', deviceCount: 5, imageCount: 1, templateCount: 1, creator: '李四', createTime: '2023-06-03' },
  { id: 3, name: '网元C', deviceCount: 8, imageCount: 2, templateCount: 3, creator: '王五', createTime: '2023-06-05' },
  { id: 4, name: '网元D', deviceCount: 6, imageCount: 4, templateCount: 1, creator: '赵六', createTime: '2023-06-10' },
  { id: 5, name: '网元E', deviceCount: 12, imageCount: 5, templateCount: 4, creator: '钱七', createTime: '2023-06-15' },
  { id: 6, name: '网元F', deviceCount: 9, imageCount: 2, templateCount: 2, creator: '孙八', createTime: '2023-06-20' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 7

const filteredElements = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return query
    ? networkElements.value.filter(e => e.name.toLowerCase().includes(query))
    : networkElements.value
})

const totalPages = computed(() => Math.ceil(filteredElements.value.length / pageSize))

const paginatedElements = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredElements.value.slice(start, start + pageSize)
})

const startItem = computed(() => (currentPage.value - 1) * pageSize)
const endItem = computed(() => Math.min(startItem.value + paginatedElements.value.length, filteredElements.value.length))

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
</script>
