import { createRouter, createWebHistory} from 'vue-router'

import ProjectPage from '@/pages/ProjectPage.vue'
import UserPage from '@/pages/UserPage.vue'
import TemplatePage from '@/pages/TemplatePage.vue'
import FilePage from '@/pages/FilePage.vue'
import ImagePage from '@/pages/ImagePage.vue'
import TargetPage from '@/pages/TargetPage.vue'
import ProfilePage from '@/pages/ProfilePage.vue'
import CreateProject from '@/views/Project_cre.vue'
import Login from '@/views/Login.vue'
import Monitor  from '@/pages/Monitor.vue'

const routes = [
  { path: '/', redirect: '/login' ,meta: { fullscreen: true }},
  { path: '/project', component: ProjectPage ,meta: { fullscreen: false }},
  { path: '/user', component: UserPage ,meta: { fullscreen: false }},
  { path: '/template', component: TemplatePage ,meta: { fullscreen: false }},
  { path: '/monitor', component: Monitor ,meta: { fullscreen: false }},
  { path: '/file', component: FilePage ,meta: { fullscreen: false }},
  { path: '/image', component: ImagePage ,meta: { fullscreen: false }},
  { path: '/target', component: TargetPage ,meta: { fullscreen: false }},
  { path: '/profile', component: ProfilePage ,meta: { fullscreen: false }},
  { path: '/create-project', name: 'CreateProject',component: CreateProject,meta: { fullscreen: true }},
  { path: '/login', name: 'Login',component: Login,meta: { fullscreen: true },
  
}

]

export default createRouter({
  history: createWebHistory(),
  routes,
})
