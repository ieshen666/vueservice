<!-- TopoDescribe.vue -->
<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">

    <!-- 输入框+按钮区域（去掉边框，字体加大，间距增大） -->
    <div class="flex justify-center mb-24">
      <div class="flex items-center gap-2">
        <input
          type="text"
          v-model="topologyName"
          placeholder="请输入网络拓扑名称"
          class="px-3 py-2 border border-gray-300 rounded-button w-[240px] text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button class="px-4 py-2 bg-blue-500 text-white rounded-button text-lg flex items-center gap-2">
          <i class="fas fa-play"></i> 部署
        </button>
        <button class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-button text-lg flex items-center gap-2">
          <i class="fas fa-save"></i> 保存模板
        </button>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">网络拓扑描述</h3>
      <div class="flex items-center gap-2">
        <div class="relative" style="min-width: 160px;">
          <button 
            class="h-[40px] px-4 bg-white border border-gray-300 text-gray-700 rounded-button flex items-center justify-between w-full"
            @click="industryOpen = !industryOpen"
          >
            <span class="truncate">{{ selectedIndustry }}</span>
            <i class="fas fa-chevron-down text-xs ml-2 flex-shrink-0"></i>
          </button>
          <div 
            v-if="industryOpen" 
            class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10"
          >
            <button 
              v-for="option in industries" 
              :key="option"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              @click.stop="selectIndustry(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
        <button class="px-4 py-2 bg-blue-500 text-white rounded-button flex items-center gap-2">
          生成代码 <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- 多选靶场 -->
      <div class="relative">
        <button 
          class="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors"
          @click.stop="targetOpen = !targetOpen"
        >
          <div class="flex items-center">
            <span v-if="selectedTargets.length > 0" class="flex items-center mr-2">
              <span class="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">
                {{ selectedTargets.length }}
              </span>
            </span>
            <span class="text-sm truncate max-w-[180px]">
              {{ selectedTargets.length > 0 ? selectedTargets.join('，') : '选择目标靶场' }}
            </span>
          </div>
          <i class="fas fa-chevron-down text-xs ml-2 transition-transform duration-200" 
            :class="{ 'transform rotate-180': targetOpen }"></i>
        </button>

        <transition name="fade">
          <div 
            v-if="targetOpen" 
            class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 max-h-60 overflow-y-auto"
            v-click-outside="closeDropdown"
          >
            <div 
              v-for="target in targetOptions" 
              :key="target" 
              class="px-4 py-2 hover:bg-gray-50 text-sm flex items-center cursor-pointer"
              @click="handleTargetSelect(target)"
            >
              <div class="flex items-center">
                <div class="w-5 h-5 border border-gray-300 rounded mr-3 flex items-center justify-center"
                    :class="{ 'bg-blue-500 border-blue-500': selectedTargets.includes(target) }">
                  <i v-if="selectedTargets.includes(target)" class="fas fa-check text-white text-xs"></i>
                </div>
                <span>{{ target }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 描述文本框 -->
      <textarea
        v-model="description"
        class="w-full h-[200px] px-3 py-2 border border-gray-300 rounded-md"
        placeholder="在此处输入网络拓扑描述..."
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 输入框绑定值
const topologyName = ref('某医药厂网络拓扑')

// 行业选择逻辑
const industryOpen = ref(false)
const selectedIndustry = ref('行业选择')
const industries = ['教育行业', '电力行业', '医疗行业']
const selectIndustry = (item) => {
  selectedIndustry.value = item
  industryOpen.value = false
}

// 靶场多选逻辑
const targetOpen = ref(false)
const selectedTargets = ref([])
const targetOptions = [
  '分靶场一（OpenStack）', 
  '分靶场二（H3C）', 
  '分靶场三（K8S）', 
  '分靶场四（H3C）', 
  '分靶场五（OpenStack）'
]

const closeDropdown = () => {
  targetOpen.value = false
}

const handleTargetSelect = (target) => {
  const index = selectedTargets.value.indexOf(target)
  if (index > -1) {
    selectedTargets.value.splice(index, 1)
  } else {
    selectedTargets.value.push(target)
  }
}

// 点击外部关闭功能
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}

// 描述文本
const description = ref('')
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 自定义滚动条样式 */
.max-h-60::-webkit-scrollbar {
  width: 6px;
}
.max-h-60::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
.max-h-60::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}
</style>
