<!-- DeployBar.vue -->
<template>
  <div class="flex items-center gap-4">
    <input
      type="text"
      v-model="topologyName"
      class="px-3 py-2 border border-gray-300 !rounded-button w-[240px] text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      placeholder="输入拓扑名称"
    />
    <button class="px-4 py-2 bg-blue-500 text-white !rounded-button flex items-center gap-2">
      <i class="fas fa-play"></i> 部署
    </button>
    <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 !rounded-button flex items-center gap-2">
      <i class="fas fa-save"></i> 保存模板
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const topologyName = ref('某医药厂网络拓扑')
</script>
