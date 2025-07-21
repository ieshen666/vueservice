<script setup>
import { useAttrs } from 'vue'
const attrs = useAttrs()
</script>

<template>
  <div
    class="absolute bottom-8 left-0 right-0 flex flex-col items-center text-sm text-gray-500"
    v-bind="attrs"
  >
    <p>© 2025 靶场平台即服务系统. All rights reserved.</p>
    <div class="mt-2 space-x-4">
      <a href="#" class="hover:text-primary">隐私政策</a>
      <a href="#" class="hover:text-primary">服务条款</a>
      <a href="#" class="hover:text-primary">联系我们</a>
    </div>
  </div>
</template>
