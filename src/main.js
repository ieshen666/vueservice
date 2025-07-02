import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import '@fortawesome/fontawesome-free/css/all.min.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'


const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const userStore = useUserStore()

// ✅ 在挂载 router 之前注册守卫（确保 Pinia 可用）
router.beforeEach((to, from, next) => {
  // 恢复登录状态
  if (!userStore.token && localStorage.getItem('token')) {
    userStore.restore()
  }

  const publicPaths = ['/login', '/register']
  const isPublic = publicPaths.includes(to.path)
  const isLoggedIn = userStore.isLoggedIn

  if (!isLoggedIn && !isPublic) {
    return next('/login')
  }

  if (isLoggedIn && isPublic) {
    return next('/project') // 根据权限也可跳转到不同页面
  }

  next()
})

app.use(router)
app.mount('#app')
app.use(ElementPlus)