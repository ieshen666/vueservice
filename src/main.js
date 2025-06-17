import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { createPinia } from 'pinia'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const app = createApp(App)
const pinia = createPinia()

// 正确的初始化顺序
app.use(pinia)
app.use(router)

router.beforeEach((to, from, next) => {
  const userStore = useUserStore()

  // 仅第一次初始化时 restore
  if (!userStore.token && localStorage.getItem('token')) {
    userStore.restore()
  }

  if (!userStore.isLoggedIn && !to.meta.allowAnonymous) {
    // ✅ 避免死循环跳转：当前已经在 /login 就不再跳
    if (to.path !== '/login') {
      return next('/login')
    } else {
      return next()
    }
  }

  if (userStore.isLoggedIn && to.path === '/login') {
    return next('/project')
  }

  next()
})


app.mount('#app')