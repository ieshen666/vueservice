<!-- TopoImage.vue -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import imageSrc from '@/assets/images/某医药厂网络拓扑.png'

const isFullscreen = ref(false)
const imgRef = ref(null)

// 切换全屏
const toggleFullscreen = () => {
  if (!document.fullscreenEnabled) {
    alert('您的浏览器不支持全屏功能')
    return
  }

  if (!isFullscreen.value) {
    enterFullscreen()
  } else {
    exitFullscreen()
  }
}

// 进入全屏
const enterFullscreen = () => {
  const elem = imgRef.value
  
  if (elem.requestFullscreen) {
    elem.requestFullscreen()
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen()
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen()
  }
}

// 退出全屏
const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if (document.webkitExitFullscreen) { /* Safari */
    document.webkitExitFullscreen()
  } else if (document.msExitFullscreen) { /* IE11 */
    document.msExitFullscreen()
  }
}

// 检测全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  )
}

// 键盘事件监听
const handleKeyDown = (e) => {
  if (e.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

// 生命周期钩子
onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeyDown)
  
  // 组件卸载时退出全屏
  if (isFullscreen.value) {
    exitFullscreen()
  }
})
</script>

<template>
  <div 
    class="bg-white rounded-lg border border-gray-200 p-6 mb-6"
    :class="{ 'fixed inset-0 z-50 !m-0 !rounded-none bg-white': isFullscreen }"
  >
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">网络拓扑图</h3>
      <button 
        class="px-3 py-1 text-sm bg-white border border-gray-300 text-gray-700 !rounded-button flex items-center gap-2 hover:bg-gray-50 transition-colors"
        @click="toggleFullscreen"
      >
        <i :class="isFullscreen ? 'fas fa-compress' : 'fas fa-expand'"></i> 
        {{ isFullscreen ? '退出全屏' : '全屏查看' }}
      </button>
    </div>
    <div 
      class="w-full h-[650px] bg-white rounded-lg border border-gray-100 p-4 flex items-center justify-center"
      :class="{ '!h-[calc(100vh-80px)] !border-0': isFullscreen }"
    >
      <img 
        ref="imgRef"
        :src="imageSrc" 
        class="max-w-full max-h-full object-contain cursor-pointer"
        @click="isFullscreen ? exitFullscreen() : enterFullscreen()"
      />
    </div>
  </div>
</template>

<style>
/* 全屏状态下的样式覆盖 */
.fixed {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0.8; }
  to { opacity: 1; }
}

/* 隐藏全屏时的滚动条 */
html:fullscreen {
  overflow: hidden;
}
</style>