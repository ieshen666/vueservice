<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus mr-1"></i> 创建靶标
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <select
          v-model="selectedLevel"
          class="input-control border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          @change="resetPage"
        >
          <option value="">全部等级</option>
          <option value="low">低危</option>
          <option value="medium">中危</option>
          <option value="high">高危</option>
        </select>

        <div class="relative">
          <input
            v-model="searchText"
            type="text"
            placeholder="搜索靶标名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            @input="resetPage"
          />
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">镜像</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CVE编号</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">漏洞等级</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="target in paginatedTargets" :key="target.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
              <i class="fa fa-crosshairs mr-2 text-red-500"></i>
              {{ target.name }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{{ target.image }}</td>
            <td class="px-4 py-3 text-sm text-blue-500 whitespace-nowrap font-mono">{{ target.cve }}</td>
            <td class="px-4 py-3">
              <span :class="riskLevelClass(target.level)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ riskLevelText(target.level) }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{{ target.createTime }}</td>
            <td class="px-4 py-3 text-sm text-right whitespace-nowrap">
              <button class="text-blue-500 hover:text-blue-700 mr-3"><i class="fa fa-pencil"></i> 修改</button>
              <button class="text-red-500 hover:text-red-700"><i class="fa fa-trash"></i> 删除</button>
            </td>
          </tr>

          <!-- 无结果提示 -->
          <tr v-if="filteredTargets.length === 0">
            <td colspan="6" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的靶标' : '暂无靶标数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮创建靶标' }}
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

    <!-- 分页信息与控制 -->
    <div 
      v-if="filteredTargets.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <div class="text-sm text-gray-600">
        显示第 <span class="font-medium">{{ startItem }}</span>
        - <span class="font-medium">{{ endItem }}</span> 项，
        共 <span class="font-medium">{{ totalItems }}</span> 项
      </div>
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3 py-2 border border-gray-300 rounded-l-md bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-left"></i>
        </button>

        <button
          v-for="p in displayedPages"
          :key="p"
          @click="page = p"
          class="px-3 py-2 border border-gray-300 text-sm font-medium"
          :class="p === page ? 'bg-blue-500 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'"
        >
          {{ p }}
        </button>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3 py-2 border border-gray-300 rounded-r-md bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i class="fa fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const pageSize = 7
const page = ref(1)
const searchText = ref('')
const selectedLevel = ref('')

// 所有靶标数据
const targets = ref([
  {
    id: 1,
    name: 'SQL注入靶标',
    image: 'Ubuntu 20.04 基础环境',
    cve: 'CVE-2021-1234',
    level: 'medium',
    createTime: '2023-05-10'
  },
  {
    id: 2,
    name: 'XSS漏洞靶标',
    image: 'WebGoat 漏洞测试平台',
    cve: 'CVE-2020-5678',
    level: 'low',
    createTime: '2023-05-15'
  },
  {
    id: 3,
    name: 'RCE漏洞靶标',
    image: 'Metasploit 渗透测试环境',
    cve: 'CVE-2022-9012',
    level: 'high',
    createTime: '2023-05-20'
  },
  {
    id: 4,
    name: '文件包含靶标',
    image: 'Ubuntu 20.04 基础环境',
    cve: 'CVE-2021-3456',
    level: 'medium',
    createTime: '2023-05-25'
  },
  {
    id: 5,
    name: 'CSRF漏洞靶标',
    image: 'WebGoat 漏洞测试平台',
    cve: 'CVE-2020-7890',
    level: 'low',
    createTime: '2023-05-30'
  },
  {
    id: 6,
    name: 'XXE注入靶标',
    image: 'XML Parser 平台',
    cve: 'CVE-2019-8765',
    level: 'medium',
    createTime: '2023-06-01'
  },
  {
    id: 7,
    name: '命令注入靶标',
    image: 'BusyBox 环境',
    cve: 'CVE-2018-4321',
    level: 'high',
    createTime: '2023-06-03'
  },
  {
    id: 8,
    name: '目录遍历靶标',
    image: 'Apache 环境',
    cve: 'CVE-2023-4567',
    level: 'low',
    createTime: '2023-06-05'
  }
])

// 计算属性
const hasSearchCriteria = computed(() => searchText.value || selectedLevel.value)

const filteredTargets = computed(() => {
  const keyword = searchText.value.trim().toLowerCase()
  return targets.value.filter((target) => {
    const matchLevel = !selectedLevel.value || target.level === selectedLevel.value
    const matchName = target.name.toLowerCase().includes(keyword)
    return matchLevel && matchName
  })
})

const totalItems = computed(() => filteredTargets.value.length)
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize))
const startItem = computed(() => (page.value - 1) * pageSize + 1)
const endItem = computed(() => Math.min(page.value * pageSize, totalItems.value))

// 智能分页显示（带省略号）
const displayedPages = computed(() => {
  const maxVisiblePages = 5
  const pages = []
  
  if (totalPages.value <= maxVisiblePages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const leftBound = Math.max(1, page.value - 2)
    const rightBound = Math.min(totalPages.value, page.value + 2)
    
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

const paginatedTargets = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredTargets.value.slice(start, start + pageSize)
})

// 方法
const riskLevelClass = (level: string) => {
  switch (level) {
    case 'high': return 'bg-red-100 text-red-800'
    case 'medium': return 'bg-yellow-100 text-yellow-800'
    case 'low': return 'bg-green-100 text-green-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const riskLevelText = (level: string) => {
  switch (level) {
    case 'high': return '高危'
    case 'medium': return '中危'
    case 'low': return '低危'
    default: return level
  }
}

const prevPage = () => {
  if (page.value > 1) page.value--
}

const nextPage = () => {
  if (page.value < totalPages.value) page.value++
}

const resetPage = () => {
  page.value = 1
}

const clearSearch = () => {
  searchText.value = ''
  selectedLevel.value = ''
  page.value = 1
}
</script>