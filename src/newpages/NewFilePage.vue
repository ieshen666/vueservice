<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const files = [
  { id: 1, name: '场景说明一.docx', type: 'document', size: '2.4MB', uploadTime: '2023-05-10 14:30' },
  { id: 2, name: '场景说明二.pdf', type: 'document', size: '1.8MB', uploadTime: '2023-05-12 09:15' },
  { id: 3, name: '拓扑图一.png', type: 'image', size: '850KB', uploadTime: '2023-05-15 16:45' },
  { id: 4, name: '配置文件.zip', type: 'archive', size: '5.2MB', uploadTime: '2023-05-18 11:20' },
  { id: 5, name: '拓扑图二.jpg', type: 'image', size: '320KB', uploadTime: '2023-05-20 10:05' },
  { id: 6, name: '结果统计.xlsx', type: 'document', size: '1.1MB', uploadTime: '2023-05-21 15:30' },
  { id: 7, name: '演示PPT.pptx', type: 'document', size: '3.3MB', uploadTime: '2023-05-22 08:20' },
  { id: 8, name: '方案对比.docx', type: 'document', size: '2.0MB', uploadTime: '2023-05-23 11:50' },
  { id: 9, name: '全景图.jpeg', type: 'image', size: '900KB', uploadTime: '2023-05-25 17:15' },
  { id: 10, name: '部署说明.pdf', type: 'document', size: '1.6MB', uploadTime: '2023-05-26 13:00' }
]

const pageSize = 7
const currentPage = ref(1)
const selectedType = ref('')
const searchTerm = ref('')

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchTerm.value || selectedType.value)

// 筛选后的文件列表
const filteredFiles = computed(() => {
  return files.filter(file => {
    const matchType = !selectedType.value || file.type === selectedType.value
    const matchSearch = !searchTerm.value || file.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchType && matchSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredFiles.value.length / pageSize))

const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

const pagedFiles = computed(() => {
  return filteredFiles.value.slice(startIndex.value, endIndex.value)
})

// 如果筛选或搜索发生变化，重置页码为第一页
watch([selectedType, searchTerm], () => {
  currentPage.value = 1
})

const fileIcon = (type: string, name: string) => {
  const extension = name.split('.').pop()?.toLowerCase()
  if (['doc', 'docx'].includes(extension)) return 'fas fa-file-word'
  if (['pdf'].includes(extension)) return 'fas fa-file-pdf'
  if (['xls', 'xlsx'].includes(extension)) return 'fas fa-file-excel'
  if (['ppt', 'pptx'].includes(extension)) return 'fas fa-file-powerpoint'
  if (['zip', 'rar', '7z'].includes(extension)) return 'fas fa-file-archive'
  if (['png', 'jpg', 'jpeg', 'gif'].includes(extension)) return 'fas fa-file-image'

  switch (type) {
    case 'image': return 'fa fa-file-image-o'
    case 'document': return 'fa fa-file-text-o'
    case 'archive': return 'fa fa-file-archive-o'
    default: return 'fa fa-file-o'
  }
}

const fileIconColor = (type: string) => {
  switch (type) {
    case 'image': return '#3B82F6'
    case 'document': return '#EF4444'
    case 'archive': return '#F59E0B'
    default: return '#6B7280'
  }
}

const fileTypeText = (type: string) => {
  switch (type) {
    case 'image': return '图片'
    case 'document': return '文档'
    case 'archive': return '压缩包'
    default: return '其他'
  }
}

// 清除搜索条件
const clearSearch = () => {
  searchTerm.value = ''
  selectedType.value = ''
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-upload mr-1"></i> 上传文件
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- 文件类型筛选 -->
        <select 
          v-model="selectedType" 
          class="input-control border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 hover:shadow-outline-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部类型</option>
          <option value="image">图片</option>
          <option value="document">文档</option>
          <option value="archive">压缩包</option>
          <option value="other">其他</option>
        </select>

        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索文件名"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 文件表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件名</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文件大小</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">上传时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="file in pagedFiles" :key="file.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 flex items-center">
              <i :class="fileIcon(file.type, file.name)" class="mr-2" :style="{ color: fileIconColor(file.type) }"></i>
              {{ file.name }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ fileTypeText(file.type) }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ file.size }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ file.uploadTime }}</td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
              <button class="text-blue-500 hover:text-blue-700 mr-3">
                <i class="fa fa-download"></i> 下载
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 优化后的无结果提示 -->
          <tr v-if="filteredFiles.length === 0">
            <td colspan="5" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的文件' : '暂无文件数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮上传文件' }}
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
      v-if="filteredFiles.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <p class="text-sm text-gray-600">
        显示第 <span class="font-medium">{{ startIndex + 1 }}</span> -
        <span class="font-medium">{{ Math.min(endIndex, filteredFiles.length) }}</span> 项，
      共 <span class="font-medium">{{ filteredFiles.length }}</span> 项
      </p>
      <div class="inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-left"></i>
        </button>

        <button
          v-for="page in totalPages"
          :key="page"
          @click="currentPage = page"
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
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>