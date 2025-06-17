<!-- NodeList.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">拓扑节点信息</h3>
      <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 !rounded-button flex items-center gap-2">
        <i class="fas fa-ellipsis-h"></i> 更多操作
      </button>
    </div>
    <div class="space-y-4">
      <div v-for="node in nodes" :key="node.name" class="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div :class="['w-3 h-3 rounded-full', statusColors[node.status]]"></div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h4 class="font-medium">{{ node.name }}</h4>
            <div class="flex items-center gap-2">
              <span class="text-sm text-gray-500">{{ node.ip }}</span>
              <button class="text-gray-400 hover:text-gray-600"><i class="far fa-copy"></i></button>
            </div>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            镜像：{{ node.image }}<br />
            运行状态：{{ node.status }}<br />
            配置：{{ node.config }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const statusColors = {
  正常: 'bg-green-500',
  异常: 'bg-red-500',
  已停止: 'bg-yellow-500'
}

const nodes = [
  {
    name: '办公区-终端1',
    ip: '10.0.1.1',
    image: 'Windows 10 专业版',
    status: '正常',
    config: '2 核 CPU / 8GB 内存 / 100GB 存储'
  },
  {
    name: '开发区-终端1',
    ip: '10.0.8.1',
    image: 'CentOS 7',
    status: '已停止',
    config: '4 核 CPU / 16GB 内存 / 200GB 存储'
  },
  // 可添加更多节点
]
</script>
