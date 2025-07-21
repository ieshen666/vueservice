import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    token: '',
    userId: '',     // 新增：用户唯一ID
    username: '',
    role: '',       // 角色字段
  }),
  actions: {
    login(user) {
      this.isLoggedIn = true
      this.token = user.token
      this.userId = user.userId || ''   // 新增：从登录参数中获取userId
      this.username = user.username
      this.role = user.role || ''

      localStorage.setItem('token', this.token)
      localStorage.setItem('userId', this.userId)   // 新增存储userId
      localStorage.setItem('username', this.username)
      localStorage.setItem('role', this.role)
    },
    logout() {
      this.isLoggedIn = false
      this.token = ''
      this.userId = ''
      this.username = ''
      this.role = ''
      localStorage.clear()
      localStorage.removeItem('token')
      localStorage.removeItem('userId')   // 新增删除userId
      localStorage.removeItem('username')
      localStorage.removeItem('role')
    },
    restore() {
      const token = localStorage.getItem('token')
      const userId = localStorage.getItem('userId')   // 新增读取userId
      const username = localStorage.getItem('username')
      const role = localStorage.getItem('role')

      if (token && username) {
        this.isLoggedIn = true
        this.token = token
        this.userId = userId || ''
        this.username = username
        this.role = role || ''
      }
    },
  },
})
