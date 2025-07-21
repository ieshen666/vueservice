<script setup lang="ts">
import Sidebar from './components/Sidebar.vue'
import Topbar from './components/Topbar.vue'
import Footer from './components/Footer.vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 根据路由元信息判断是否全屏（如 login、create-project 等）
const isFullscreen = computed(() => route.meta.fullscreen === true)
</script>


<template>
  <div class="flex flex-col h-screen bg-gray-100 font-inter text-dark">
    <Topbar v-if="!isFullscreen" class="bg-white shadow-md" />
    <div class="flex flex-1 overflow-hidden">
      <Sidebar v-if="!isFullscreen" class="bg-white border-r border-gray-300 shadow-sm" />
      <main class="flex-1 overflow-y-auto" :class="{ 'p-8': !isFullscreen }">
        <router-view />
      </main>
    </div>
    <Footer v-if="!isFullscreen" class="bg-white border-t border-gray-300" />
  </div>
</template>
