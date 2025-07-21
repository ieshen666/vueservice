<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4">
    <!-- 操作栏 -->
    <div class="flex flex-wrap items-center justify-between mb-4">
      <div class="flex flex-wrap gap-2 mb-2">
        <button class="btn-outline border border-gray-300 text-gray-600 hover:border-blue-500 hover:text-blue-500 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-plus-circle mr-1"></i> 新建拓扑
        </button>
        <button class="btn-primary bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md transition-all">
          <i class="fa fa-upload mr-1"></i> 上传拓扑文件
        </button>
      </div>
      <div class="flex items-center gap-2">
        <div class="relative">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="搜索拓扑名称"
            class="input-control border border-gray-300 rounded-md px-3 py-2 pl-9 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            @input="handleSearchInput"
          />
          <i class="fa fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- 拓扑表格 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">拓扑名称</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">节点数</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建者</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">创建时间</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="topo in paginatedTopologies" :key="topo.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
              <i class="fa fa-project-diagram mr-2 text-green-500"></i>
              {{ topo.name }}
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ topo.nodes }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ topo.creator }}</td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ topo.createTime }}</td>
            <td class="px-4 py-3 text-right text-sm font-medium">
              <button
                class="text-blue-500 hover:text-blue-700 mr-3"
                @click="viewTopo(topo)"
              >
                <i class="fa fa-eye"></i> 查看
              </button>
              <button class="text-red-500 hover:text-red-700">
                <i class="fa fa-trash"></i> 删除
              </button>
            </td>
          </tr>

          <tr v-if="filteredTopologies.length === 0">
            <td colspan="5" class="py-8 text-center">
              <div class="flex flex-col items-center justify-center">
                <i class="fa fa-search text-gray-400 text-4xl mb-3"></i>
                <p class="text-gray-500 font-medium text-lg mb-1">
                  {{ searchQuery ? '没有找到匹配的拓扑' : '暂无拓扑数据' }}
                </p>
                <p class="text-gray-400 text-sm">
                  {{ searchQuery ? '请尝试其他搜索关键词' : '点击上方按钮添加拓扑' }}
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
      v-if="filteredTopologies.length > 0"
      class="flex items-center justify-between px-4 py-3 mt-4"
    >
      <p class="text-sm text-gray-600">
        显示第 {{ startItem + 1 }} - {{ endItem }} 项，共 {{ filteredTopologies.length }} 项
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
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/stores/useTemplateStore'

const router = useRouter()
const templateStore = useTemplateStore()

const topologies = ref([
  { id: 1, name: '企业内网拓扑', nodes: 12, creator: '张三', createTime: '2023-06-01' },
  { id: 2, name: 'DMZ区部署拓扑', nodes: 8, creator: '李四', createTime: '2023-06-05' },
  { id: 3, name: '多子网分区拓扑', nodes: 15, creator: '王五', createTime: '2023-06-10' },
  { id: 4, name: '高可用架构拓扑', nodes: 10, creator: '赵六', createTime: '2023-06-15' },
  { id: 5, name: '教学演示网络', nodes: 6, creator: '钱七', createTime: '2023-06-20' }
])

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = 7

const filteredTopologies = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return query 
    ? topologies.value.filter(topo => topo.name.toLowerCase().includes(query))
    : topologies.value
})

const totalPages = computed(() => Math.ceil(filteredTopologies.value.length / pageSize))

const paginatedTopologies = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredTopologies.value.slice(start, start + pageSize)
})

const startItem = computed(() => (currentPage.value - 1) * pageSize)
const endItem = computed(() => Math.min(startItem.value + paginatedTopologies.value.length, filteredTopologies.value.length))

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

function viewTopo(topo: any) {
  // 示例填充数据，可替换为真实接口返回字段
  templateStore.setTemplate({
    name: topo.name,
    description: '从已有模板导入',
    yaml: `# ${topo.name} 示例拓扑\nversion: 1\nnodes:\n  - name: node1\n    type: router`
  })

  router.push('/create-project') // 跳转到拓扑编辑页
}
</script>
