<template>
  <!-- 应用 Tailwind 渐变背景 -->
  <div class="min-h-screen flex flex-col items-center justify-center relative bg-gradient-to-b from-blue-100 to-white">
    <!-- Topbar 顶部对齐 -->
    <Topbar class="w-full" />

    <!-- LoginBody 垂直居中 -->
    <RegisterBody />

    <!-- Footbar 底部居中 -->
    <Footbar class="w-full flex justify-center" />
  </div>
</template>

<script setup>
import Topbar from '../components/register/Topbar.vue'
import Footbar from '../components/register/Footbar.vue'
import RegisterBody from '../components/register/RegisterBody.vue'
</script>

<style scoped>
/* 该样式无效，可以删除，或放在全局样式中 */
body {
  min-height: 1024px;
  background: linear-gradient(135deg, #EBF4FF 0%, #F9FAFB 100%);
}
</style>
