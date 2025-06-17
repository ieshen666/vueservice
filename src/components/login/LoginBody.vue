<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const form = ref({
  username: '',
  password: ''
})

const errorMsg = ref('')

const mockUsers = [
  { username: 'admin', password: '123456', role: 'admin' },
  { username: 'user', password: '123456', role: 'user' }
]

const handleLogin = () => {
  const { username, password } = form.value
  const matchedUser = mockUsers.find(user => user.username === username && user.password === password)

  if (!matchedUser) {
    errorMsg.value = '用户名或密码错误'
    return
  }

  userStore.login(matchedUser)

  router.push('/project') // 统一跳转主页
}
</script>


<template>
  <div class="w-[480px] p-10 rounded-2xl shadow-2xl bg-white">
    <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">登录系统</h2>
    <div class="space-y-6">
      <!-- 用户名输入 -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <i class="fas fa-user"></i>
        </div>
        <input
          v-model="form.username"
          type="text"
          placeholder="用户名"
          class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 密码输入 -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
          <i class="fas fa-lock"></i>
        </div>
        <input
          v-model="form.password"
          type="password"
          placeholder="密码"
          class="w-full pl-10 pr-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- 错误信息 -->
      <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>

      <!-- 登录按钮 -->
      <button
        @click="handleLogin"
        class="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex justify-center items-center transition-colors"
      >
        登录
      </button>

      <!-- 注册按钮 -->
      <button
        class="w-full py-3 border border-blue-500 text-blue-500 font-semibold rounded-lg hover:bg-blue-50"
      >
        注册
      </button>

      <!-- 底部链接 -->
      <div class="flex justify-between text-sm text-blue-500">
        <a href="#" class="hover:underline">忘记密码？</a>
        <a href="#" class="hover:underline">帮助中心</a>
      </div>
    </div>
  </div>
</template>
