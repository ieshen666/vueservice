<template>
  <aside class="w-64 bg-white shadow-sm h-[calc(100vh-64px)] overflow-y-auto">
    <nav class="py-4">
      <!-- 主菜单标题 -->
      <div class="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">
        主菜单
      </div>

      <!-- 工程管理 -->
      <RouterLink
        to="/project"
        class="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
        :class="{
          'sidebar-item-active': isActive('/project'),
          'text-gray-700': !isActive('/project')
        }"
      >
        <i class="fa far fa-folder-open w-6 text-center"></i>
        <span class="ml-2">工程管理</span>
      </RouterLink>

      <!-- 人员管理 仅管理员显示 -->
      <RouterLink
        v-if="showUserManagement"
        to="/user"
        class="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
        :class="{
          'sidebar-item-active': isActive('/user'),
          'text-gray-700': !isActive('/user')
        }"
      >
        <i class="fa fa-users w-6 text-center"></i>
        <span class="ml-2">人员管理</span>
      </RouterLink>

      <!-- 资源管理（带子菜单） -->
      <div>
        <div
          @click="toggleResource"
          class="flex items-center justify-between px-4 py-3 cursor-pointer transition-colors duration-200"
          :class="{
            'sidebar-item-active': isAnyResourceItemActive,
            'hover:bg-gray-100 text-gray-700': !isResourceOpen
          }"
        >
          <div class="flex items-center">
            <i class="fa fa-cubes w-6 text-center"></i>
            <span class="ml-2">资源管理</span>
          </div>
          <i 
            class="fa transition-transform duration-200"
            :class="isResourceOpen ? 'fa-angle-up' : 'fa-angle-down'"
          ></i>
        </div>

        <!-- 子菜单过渡动画 -->
        <Transition name="slide">
          <div 
            v-show="isResourceOpen"
            class="bg-gray-50 overflow-hidden rounded-md mx-3 my-1"
          >
            <RouterLink
              v-for="item in resourceItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center py-2 pl-12 pr-4 hover:bg-gray-100 transition-colors duration-200"
              :class="{
                'sidebar-item-active': isActive(item.path),
                'text-gray-700': !isActive(item.path)
              }"
            >
              <i :class="`fa ${item.icon} w-6 text-center`"></i>
              <span class="ml-2">{{ item.label }}</span>
            </RouterLink>
          </div>
        </Transition>
      </div>

      <!-- 资源监控 仅管理员显示 -->
      <RouterLink
        v-if="showUserManagement"
        to="/monitor"
        class="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
          :class="{
            'sidebar-item-active': isActive('/monitor'),
            'text-gray-700': !isActive('/monitor')
        }"
       >
        <i class="fa fa-desktop w-6 text-center"></i>
        <span class="ml-2">资源监控</span>
      </RouterLink>


      <!-- 个人信息 -->
      <RouterLink
        to="/profile"
        class="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors duration-200"
        :class="{
          'sidebar-item-active': isActive('/profile'),
          'text-gray-700': !isActive('/profile')
        }"
      >
        <i class="fa far fa-user w-6 text-center"></i>
        <span class="ml-2">个人信息</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../stores/user'  // 引入Pinia用户状态

const route = useRoute()
const isResourceOpen = ref(false)

const userStore = useUserStore()

// 只有角色为 'admin' 才显示人员管理菜单
const showUserManagement = computed(() => userStore.role === 'admin')


const resourceItems = [
  { path: '/template', label: '工程模板', icon: 'far fa-file' },
  { path: '/image', label: '镜像管理', icon: 'fa-clone' },
  //{ path: '/topo', label: '拓扑管理', icon: 'fa-project-diagram' },
  { path: '/file', label: '文件管理', icon: 'far fa-file-alt' },
  { path: '/networkelement', label: '网元列表', icon: 'fa-network-wired' },
  //{ path: '/target', label: '靶标管理', icon: 'fa-crosshairs' }
];

// 检查当前路由是否激活
const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

// 判断是否有资源子菜单被激活
const isAnyResourceItemActive = computed(() => {
  return resourceItems.some(item => isActive(item.path))
})

// 切换资源菜单展开状态
const toggleResource = () => {
  isResourceOpen.value = !isResourceOpen.value
}

// 当路由变化时自动展开对应的资源菜单
watch(
  () => route.path,
  (newPath) => {
    if (resourceItems.some(item => isActive(item.path))) {
      isResourceOpen.value = true
    }
  },
  { immediate: true }
)
</script>

<style scoped>
/* 选中状态样式 */
.sidebar-item-active {
  background-color: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  border-left: 3px solid #165DFF;
  font-weight: 500;
}

/* 滑动动画 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
}
.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

/* 确保图标正确显示 */
.fa {
  font-family: 'FontAwesome' !important;
}
</style>
