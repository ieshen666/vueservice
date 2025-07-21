<template>
  <div class="bg-white border-b border-gray-200 p-4">
    <div class="flex items-center justify-between">
      <!-- 左侧：Logo + 系统名称 -->
      <div class="flex items-center gap-4">
        <img src="@/assets/images/PCL_logo.png" alt="Logo" class="w-12 h-12 rounded mr-2" />
        <span class="font-semibold text-blue-600 text-[24px]">
          靶场平台即服务系统
        </span>
      </div>

      <!-- 右侧：头像 + 菜单 -->
      <div class="relative" ref="menuRef">
        <div class="flex items-center gap-2 cursor-pointer" @click="toggleMenu">
          <img 
            src="@/assets/images/default-avatar.png" 
            class="w-8 h-8 rounded-full hover:opacity-80 transition"
          />
          <span class="text-sm text-gray-600">{{ userStore.username }}</span>
        </div>

        <!-- 下拉菜单 -->
        <transition
          enter-active-class="transition duration-100 ease-out"
          enter-from-class="transform scale-95 opacity-0"
          enter-to-class="transform scale-100 opacity-100"
          leave-active-class="transition duration-75 ease-in"
          leave-from-class="transform scale-100 opacity-100"
          leave-to-class="transform scale-95 opacity-0"
        >
          <div 
            v-if="menuVisible"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-100"
          >
            <div class="px-4 py-2 border-b border-gray-100">
              <p class="text-sm font-medium text-gray-800">{{ userStore.username }}</p>
              <p class="text-xs text-gray-500 flex items-center gap-1">
                <i class="fa" :class="userStore.role === 'admin' ? 'fa-user-secret' : 'fa-user'"></i>
                {{
                  userStore.role === 'admin'
                    ? '管理员'
                    : userStore.role === 'user'
                      ? '普通用户'
                      : '未知权限'
                }}
              </p>
            </div>
            <div 
              class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
              @click="$router.push('/profile')"
             >
              <i class="fa fa-user mr-2 text-gray-500"></i>
              <span class="text-gray-700">个人信息</span>
            </div>
            <div 
              class="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center"
              @click="handleLogout"
             >
              <i class="fa fa-sign-out mr-2 text-gray-500"></i>
              <span class="text-gray-700">退出登录</span>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const menuVisible = ref(false)
const menuRef = ref(null)

const toggleMenu = () => {
  menuVisible.value = !menuVisible.value
}

const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    menuVisible.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleLogout = async () => {
  console.log('执行退出登录')
  userStore.logout()
  menuVisible.value = false
  await router.push('/login')
}
</script>

<style scoped>
@import url('https://cdn.jsdelivr.net/npm/font-awesome@4.7.0/css/font-awesome.min.css');
</style>
