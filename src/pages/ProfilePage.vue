<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <!-- 左侧：头像信息 -->
    <div class="md:col-span-1">
      <div class="card bg-white rounded-lg shadow-sm p-6">
        <div class="text-center">
          <div class="relative inline-block">
            <img
              :src="user.avatar ||'/default-avatar.png'"
              class="w-24 h-24 rounded-full border-4 border-white shadow"
              alt="用户头像"
            />
            <label
              class="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:bg-blue-600 transition"
            >
              <i class="fa fa-camera text-white"></i>
              <input
                type="file"
                class="hidden"
                accept="image/*"
                @change="handleAvatarUpload"
              />
            </label>
          </div>
          <h3 class="mt-4 text-lg font-medium text-gray-900">{{ user.username }}</h3>
          <p class="text-gray-500 text-sm">{{ user.authority }}</p>
        </div>
      </div>
    </div>

    <!-- 右侧：信息编辑区域 -->
    <div class="md:col-span-2 space-y-6">
      <!-- 基本信息卡片 -->
      <div class="card bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
        <div class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="md:col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <input
                type="text"
                v-model="user.username"
                class="input-control"
              />
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">权限</label>
              <input
                type="text"
                :value="user.authority === 'admin' ? '管理员' : (user.authority === 'user' ? '用户' : user.authority)"
                class="input-control"
                readonly
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">邮箱</label>
            <input type="email" v-model="user.email" class="input-control" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <input type="tel" v-model="user.phone" class="input-control" />
          </div>

          <div class="flex justify-end">
            <button @click="openProfileConfirm" class="btn-primary">
              <i class="fa fa-save mr-1"></i> 保存修改
            </button>
          </div>
        </div>
      </div>

      <!-- 修改密码卡片 -->
      <div class="card bg-white rounded-lg shadow-sm p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">修改密码</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
            <input 
              type="password" 
              v-model="password.current" 
              class="input-control"
              placeholder=""
              autocomplete="new-password"  
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <input 
              type="password" 
              v-model="password.new" 
              class="input-control"
              placeholder=""
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
            <input 
              type="password" 
              v-model="password.confirm" 
              class="input-control"
              placeholder=""
            />
          </div>

          <div class="flex justify-end">
            <button @click="confirmChangePassword" class="btn-primary">
              <i class="fa fa-key mr-1"></i> 修改密码
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 二级确认对话框：保存信息 -->
  <dialog ref="profileDialog" class="dialog-box">
    <p class="mb-4">确认保存个人信息修改？</p>
    <div class="flex justify-end gap-2">
      <button @click="closeDialog(profileDialog)">取消</button>
      <button class="btn-primary" @click="confirmSaveProfile">确认</button>
    </div>
  </dialog>
</template>

<script setup lang="ts">
 
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import request from '@/utils/request'


const authStore = useUserStore()

// 用户数据
const user = ref({
  avatar: '',
  username: authStore.username,
  authority: authStore.role, // 从Pinia获取权限
  email: 'admin@example.com',
  phone: '13800138000'
})

// 密码数据
const password = ref({
  current: '',
  new: '',
  confirm: ''
})

// dialog 引用
const profileDialog = ref<HTMLDialogElement | null>(null)
const passwordDialog = ref<HTMLDialogElement | null>(null)

// 打开确认弹窗
const openProfileConfirm = () => profileDialog.value?.showModal()
const openPasswordConfirm = () => passwordDialog.value?.showModal()

// 关闭弹窗
const closeDialog = (dialog: HTMLDialogElement | null) => {
  dialog?.close()
}

// 确认保存信息
const confirmSaveProfile = () => {
  console.log('保存个人信息:', user.value)
  // 发送保存请求
  // await api.updateProfile(user.value)
  profileDialog.value?.close()
}

// 确认修改密码
const confirmChangePassword = async () => {
  const userStore = useUserStore()

  // 1. 表单校验
  if (!password.value.current || !password.value.new) {
    return ElMessage.error('请填写所有密码字段')
  }
  if (password.value.new !== password.value.confirm) {
    return ElMessage.error('两次密码输入不一致')
  }

  try {
    // 2. 确认对话框
    await ElMessageBox.confirm('确定要修改密码吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // 3. 发起修改密码请求
    const res = await request.post(`/api/auth/${userStore.userId}/change-password`, {
      oldPassword: password.value.current,
      newPassword: password.value.new,
    })

    // 4. 响应处理
    if (res.data.status === 200) {
      if (res.data.status === 200) {
        ElMessage.success('密码修改成功')
        userStore.logout()
        await ElMessageBox.confirm('请重新登录', '操作成功', {
          confirmButtonText: '去登录',
          showCancelButton: false
        })
        window.location.href = '/login'
      }

    } else {
      throw new Error(res.data.message || '修改失败')
    }

  } catch (err: any) {
    if (err !== 'cancel') {
      console.error('修改失败:', err)
      ElMessage.error(err.message || '操作失败')
    }
  }
}
// 头像上传处理
const handleAvatarUpload = (e: Event) => {
  const input = e.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (!file.type.match('image.*')) {
      alert('请选择图片文件')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }
    const reader = new FileReader()
    reader.onload = (e) => {
      user.value.avatar = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}
.btn-primary {
  background-color: #3b82f6;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}
.btn-primary:hover {
  background-color: #2563eb;
}
.input-control {
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  outline: none;
}
.input-control:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}
.dialog-box {
  padding: 1.5rem;
  border: none;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.2);
}
.dialog-box::backdrop {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>