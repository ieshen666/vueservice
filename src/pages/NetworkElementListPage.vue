<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const elements = [
  { 
    id: 1, 
    name: '计算服务器集群A', 
    type: 'compute', 
    range: '鹏城主靶场', 
    deviceType: '虚拟设备',
    status: '运行中',
    updatedAt: '2025-07-10 09:15:30' 
  },
  { 
    id: 2, 
    name: 'Ubuntu 20.04 仿真实体资源', 
    type: 'simulation', 
    range: '华东分靶场', 
    deviceType: '虚拟设备',
    status: '可用',
    updatedAt: '2025-07-09 14:23:05' 
  },
  { 
    id: 3, 
    name: 'CentOS 7.9 仿真实体资源', 
    type: 'simulation', 
    range: '鹏城主靶场', 
    deviceType: '虚拟设备',
    status: '可用',
    updatedAt: '2025-07-11 11:45:22' 
  },
  { 
    id: 4, 
    name: '物理服务器节点1', 
    type: 'storage', 
    range: '华南分靶场', 
    deviceType: '实物设备',
    status: '维护中',
    updatedAt: '2025-07-08 16:30:18' 
  },
  { 
    id: 5, 
    name: 'Windows Server 2019 仿真实体资源', 
    type: 'simulation', 
    range: '鹏城主靶场', 
    deviceType: '虚拟设备',
    status: '可用',
    updatedAt: '2025-07-12 10:05:33' 
  },
  { 
    id: 6, 
    name: '计算服务器集群B', 
    type: 'compute', 
    range: '华北分靶场', 
    deviceType: '虚拟设备',
    status: '运行中',
    updatedAt: '2025-07-13 14:50:27' 
  },
  { 
    id: 7, 
    name: '物理服务器节点2', 
    type: 'compute', 
    range: '鹏城主靶场', 
    deviceType: '实物设备',
    status: '运行中',
    updatedAt: '2025-07-14 08:20:45' 
  }
]

const pageSize = 7
const currentPage = ref(1)
const selectedType = ref('')
const selectedRange = ref('')
const selectedDeviceType = ref('')
const searchTerm = ref('')

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchTerm.value || selectedType.value || selectedRange.value || selectedDeviceType.value)

// 筛选后的服务器资源
const filteredElements = computed(() => {
  return elements.filter(element => {
    const matchType = !selectedType.value || element.type === selectedType.value
    const matchRange = !selectedRange.value || element.range.includes(selectedRange.value)
    const matchDeviceType = !selectedDeviceType.value || element.deviceType === selectedDeviceType.value
    const matchSearch = !searchTerm.value || element.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchType && matchRange && matchDeviceType && matchSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredElements.value.length / pageSize))

const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

const pagedElements = computed(() => {
  return filteredElements.value.slice(startIndex.value, endIndex.value)
})

// 如果筛选或搜索发生变化，重置页码为第一页
watch([selectedType, selectedRange, selectedDeviceType, searchTerm], () => {
  currentPage.value = 1
})

const elementTypeText = (type: string) => {
  switch (type) {
    case 'compute': return '服务器资源'
    case 'simulation': return '仿真实体资源'
    case 'storage': return '服务器资源'
    default: return '其他'
  }
}

const statusColor = (status: string) => {
  switch (status) {
    case '运行中': return 'bg-green-100 text-green-800'
    case '可用': return 'bg-blue-100 text-blue-800'
    case '维护中': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const showDetails = (element: any) => {
  if (element.type === 'compute') {
    router.push(`/element/compute/${element.id}`)
  }
  else if(element.type === 'storage'){
    router.push(`/element/storage/${element.id}`)
  } else {
    router.push(`/element/simulation/${element.id}`)
  }
}

const deleteElement = (id: number) => {
  if (confirm('确定要删除这个网元吗？此操作不可恢复。')) {
    const index = elements.findIndex(e => e.id === id)
    if (index !== -1) {
      elements.splice(index, 1)
    }
  }
}

// 清除搜索条件
const clearSearch = () => {
  searchTerm.value = ''
  selectedType.value = ''
  selectedRange.value = ''
  selectedDeviceType.value = ''
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus mr-1"></i> 添加靶场资源
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- 网元类型筛选 -->
        <select 
          v-model="selectedType" 
          class="input-control border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 hover:shadow-outline-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部类型</option>
          <option value="compute">服务器资源</option>
          <option value="storage">服务器资源(含镜像)</option>
          <option value="simulation">仿真实体资源</option>
        </select>

        <!-- 靶场筛选 -->
        <select 
          v-model="selectedRange" 
          class="input-control border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 hover:shadow-outline-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部靶场</option>
          <option value="鹏城主靶场">鹏城主靶场</option>
          <option value="华东分靶场">华东分靶场</option>
          <option value="华南分靶场">华南分靶场</option>
          <option value="华北分靶场">华北分靶场</option>
        </select>

        <!-- 设备类型筛选 -->
        <select 
          v-model="selectedDeviceType" 
          class="input-control border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 hover:shadow-outline-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部设备类型</option>
          <option value="虚拟设备">虚拟设备</option>
          <option value="实物设备">实物设备</option>
        </select>

        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索靶场资源名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 网元表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">靶场资源名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">靶场资源类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属靶场</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">设备类型</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="element in pagedElements" :key="element.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ element.name }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ elementTypeText(element.type) }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ element.range }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ element.deviceType }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm">
              <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusColor(element.status)]">
                {{ element.status }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ element.updatedAt }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button 
                @click="showDetails(element)"
                class="text-blue-500 hover:text-blue-700"
              >
                <i class="fa fa-info-circle mr-1"></i> 详情
              </button>
              <button 
                @click="deleteElement(element.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 无结果提示 -->
          <tr v-if="filteredElements.length === 0">
            <td colspan="7" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的靶场资源' : '暂无数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮添加靶场资源' }}
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
      v-if="filteredElements.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <p class="text-sm text-gray-600">
        显示第 <span class="font-medium">{{ startIndex + 1 }}</span> -
        <span class="font-medium">{{ Math.min(endIndex, filteredElements.length) }}</span> 项，
      共 <span class="font-medium">{{ filteredElements.length }}</span> 项
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