import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    token: '',
    username: '',
    role: '', // ✅ 新增角色字段
  }),
  actions: {
    login(user) {
      this.isLoggedIn = true
      this.token = 'mock-token' // 可替换为实际 token
      this.username = user.username
      this.role = user.role // ✅ 存储角色
      localStorage.setItem('token', this.token)
      localStorage.setItem('username', this.username)
      localStorage.setItem('role', this.role)
    },
    logout() {
      this.isLoggedIn = false
      this.token = ''
      this.username = ''
      this.role = ''
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('role')
    },
    restore() {
      const token = localStorage.getItem('token')
      const username = localStorage.getItem('username')
      const role = localStorage.getItem('role')

      if (token && username) {
        this.isLoggedIn = true
        this.token = token
        this.username = username
        this.role = role || '' // ✅ 恢复角色
      }
    },
  },
})
