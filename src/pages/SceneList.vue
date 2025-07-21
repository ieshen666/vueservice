<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const scenes = [
  { 
    id: 1, 
    name: '医药场景', 
    description: '模拟医药企业网络环境，包含3个业务区域，5台核心路由器', 
    range: '鹏城主靶场', 
    status: '可用', 
    updatedAt: '2025-07-09 14:23:05' 
  },
  { 
    id: 2, 
    name: '水务场景', 
    description: '城市水务系统网络模拟，2个控制中心，8个监测站点', 
    range: '华东分靶场', 
    status: '下线', 
    updatedAt: '2025-07-08 09:15:30' 
  },
  { 
    id: 3, 
    name: '电力场景', 
    description: '电力调度系统网络，4个调度中心，12台路由器', 
    range: '鹏城主靶场', 
    status: '待配置', 
    updatedAt: '2025-07-10 11:45:22' 
  },
  { 
    id: 4, 
    name: '交通场景', 
    description: '智能交通控制系统，包含信号灯网络和监控网络', 
    range: '华南分靶场', 
    status: '可用', 
    updatedAt: '2025-07-11 16:30:18' 
  },
  { 
    id: 5, 
    name: '金融场景', 
    description: '银行核心业务网络模拟，3层安全防护架构', 
    range: '鹏城主靶场', 
    status: '下线', 
    updatedAt: '2025-07-07 13:20:45' 
  },
  { 
    id: 6, 
    name: '教育场景', 
    description: '校园网络环境，包含教学区和宿舍区网络', 
    range: '华北分靶场', 
    status: '待配置', 
    updatedAt: '2025-07-12 10:05:33' 
  },
  { 
    id: 7, 
    name: '政务场景', 
    description: '电子政务外网模拟，多部门网络互联', 
    range: '鹏城主靶场', 
    status: '可用', 
    updatedAt: '2025-07-13 14:50:27' 
  }
]

const pageSize = 7
const currentPage = ref(1)
const selectedRange = ref('')
const selectedStatus = ref('')
const searchTerm = ref('')

// 计算是否有搜索条件
const hasSearchCriteria = computed(() => searchTerm.value || selectedRange.value || selectedStatus.value)

// 筛选后的场景列表
const filteredScenes = computed(() => {
  return scenes.filter(scene => {
    const matchRange = !selectedRange.value || scene.range.includes(selectedRange.value)
    const matchStatus = !selectedStatus.value || scene.status === selectedStatus.value
    const matchSearch = !searchTerm.value || 
      scene.name.toLowerCase().includes(searchTerm.value.toLowerCase()) || 
      scene.description.toLowerCase().includes(searchTerm.value.toLowerCase())
    return matchRange && matchStatus && matchSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredScenes.value.length / pageSize))

const startIndex = computed(() => (currentPage.value - 1) * pageSize)
const endIndex = computed(() => startIndex.value + pageSize)

const pagedScenes = computed(() => {
  return filteredScenes.value.slice(startIndex.value, endIndex.value)
})

// 如果筛选或搜索发生变化，重置页码为第一页
watch([selectedRange, selectedStatus, searchTerm], () => {
  currentPage.value = 1
})

const statusColor = (status: string) => {
  switch (status) {
    case '可用': return 'bg-green-100 text-green-800'
    case '下线': return 'bg-gray-100 text-gray-800'
    case '待配置': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-blue-100 text-blue-800'
  }
}

const navigateToEdit = (id: number) => {
  router.push(`/scene/${id}/edit`)
}

const activateScene = (id: number) => {
  // 上线场景逻辑
  const scene = scenes.find(s => s.id === id)
  if (scene && (scene.status === '下线' || scene.status === '待配置')) {
    scene.status = '可用'
    scene.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 19)
  }
}

const deleteScene = (id: number) => {
  if (confirm('确定要删除这个场景吗？此操作不可恢复。')) {
    const index = scenes.findIndex(s => s.id === id)
    if (index !== -1) {
      scenes.splice(index, 1)
    }
  }
}

// 清除搜索条件
const clearSearch = () => {
  searchTerm.value = ''
  selectedRange.value = ''
  selectedStatus.value = ''
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus mr-1"></i> 新建场景
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
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

        <!-- 状态筛选 -->
        <select 
          v-model="selectedStatus" 
          class="input-control border border-gray-300 rounded-md px-3 py-2 hover:border-blue-500 hover:shadow-outline-blue focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
        >
          <option value="">全部状态</option>
          <option value="可用">可用</option>
          <option value="下线">下线</option>
          <option value="待配置">待配置</option>
        </select>

        <!-- 搜索框 -->
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索场景名称或简介"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          >
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 场景表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">场景名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">简介</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属靶场</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">更新时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="scene in pagedScenes" :key="scene.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ scene.name }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500 max-w-xs truncate" :title="scene.description">
              {{ scene.description }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ scene.range }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm">
              <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusColor(scene.status)]">
                {{ scene.status }}
              </span>
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
              {{ scene.updatedAt }}
            </td>
            <td class="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
              <button 
                @click="navigateToEdit(scene.id)"
                class="text-blue-500 hover:text-blue-700"
              >
                <i class="fa fa-info-circle mr-1"></i> 详情
              </button>
              <button 
                @click="activateScene(scene.id)"
                :disabled="!(scene.status === '下线' || scene.status === '待配置')"
                :class="[
                  'text-green-500 hover:text-green-700',
                  {'opacity-50 cursor-not-allowed': !(scene.status === '下线' || scene.status === '待配置')}
                ]"
              >
                <i class="fa fa-power-off mr-1"></i> 上线
              </button>
              <button 
                @click="deleteScene(scene.id)"
                class="text-red-500 hover:text-red-700"
              >
                <i class="fa fa-trash mr-1"></i> 删除
              </button>
            </td>
          </tr>
          
          <!-- 无结果提示 -->
          <tr v-if="filteredScenes.length === 0">
            <td colspan="6" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ hasSearchCriteria ? '没有找到匹配的场景' : '暂无场景数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ hasSearchCriteria ? '请尝试其他搜索条件' : '点击上方按钮新建场景' }}
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
      v-if="filteredScenes.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <p class="text-sm text-gray-600">
        显示第 <span class="font-medium">{{ startIndex + 1 }}</span> -
        <span class="font-medium">{{ Math.min(endIndex, filteredScenes.length) }}</span> 项，
      共 <span class="font-medium">{{ filteredScenes.length }}</span> 项
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