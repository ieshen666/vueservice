<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const form = ref({
  username: '',
  password: ''
})

const errorMsg = ref('')
const successMsg = ref('')
const isSubmitting = ref(false)

const handleRegister = async () => {
  errorMsg.value = ''
  successMsg.value = ''
  isSubmitting.value = true

  try {
    const response = await axios.post('http://localhost:8080/api/auth/register', form.value)

    const res = response.data
    if (res.status === 200) {
      successMsg.value = '注册成功，正在跳转...'
      setTimeout(() => {
        router.push('/login') // 注册成功后跳转登录页
      }, 1500)
    } else {
      errorMsg.value = res.message || '注册失败'
    }
  } catch (err) {
    errorMsg.value = err.response?.data?.message || '请求失败，请检查服务是否已启动'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="w-[480px] p-10 rounded-2xl shadow-2xl bg-white">
    <h2 class="text-2xl font-bold text-center mb-8 text-gray-800">用户注册</h2>
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

      <!-- 提示信息 -->
      <div v-if="errorMsg" class="text-red-500 text-sm text-center">{{ errorMsg }}</div>
      <div v-if="successMsg" class="text-green-500 text-sm text-center">{{ successMsg }}</div>

      <!-- 注册按钮 -->
      <button
        :disabled="isSubmitting"
        @click="handleRegister"
        class="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 flex justify-center items-center transition-colors disabled:opacity-50"
      >
        {{ isSubmitting ? '注册中...' : '注册' }}
      </button>

      <!-- 已有账号？返回登录 -->
      <div class="text-sm text-blue-500 text-center mt-4">
        已有账号？
        <a @click="router.push('/login')" class="hover:underline cursor-pointer">返回登录</a>
      </div>
    </div>
  </div>
</template>
