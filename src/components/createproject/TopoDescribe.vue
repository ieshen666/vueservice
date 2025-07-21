<template>
  <div class="bg-white rounded-lg border border-gray-200 p-6">

    <!-- 输入框+按钮区域 -->
    <div class="flex justify-center mb-10">
      <div class="flex items-center gap-2">
        <input
          type="text"
          v-model="store.name"
          placeholder="请输入网络拓扑名称"
          class="px-3 py-2 border border-gray-300 rounded-button w-[240px] text-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        <button @click="deployTopology" class="px-4 py-2 bg-blue-500 text-white rounded-button text-lg flex items-center gap-2">
          <i class="fas fa-play"></i> 部署
        </button>
        <button @click="saveTemplate" class="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-button text-lg flex items-center gap-2">
          <i class="fas fa-save"></i> 保存模板
        </button>
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium">网络拓扑描述</h3>
      <div class="flex items-center gap-2">
        <div class="relative" style="min-width: 160px;">
          <button 
            class="h-[40px] px-4 bg-white border border-gray-300 text-gray-700 rounded-button flex items-center justify-between w-full"
            @click="industryOpen = !industryOpen"
          >
            <span class="truncate">{{ selectedIndustry }}</span>
            <i class="fas fa-chevron-down text-xs ml-2 flex-shrink-0 transition-transform duration-200"
              :class="{ 'transform rotate-180': industryOpen }"></i>
          </button>
          <div 
            v-if="industryOpen" 
            class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg py-1 z-10"
          >
            <button 
              v-for="option in industries" 
              :key="option"
              class="w-full px-4 py-2 text-left hover:bg-gray-50 text-sm"
              @click.stop="selectIndustry(option)"
            >
              {{ option }}
            </button>
          </div>
        </div>
        <button @click="generateJson" class="px-4 py-2 bg-blue-500 text-white rounded-button flex items-center gap-2">
          生成代码 <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <!-- 多选靶场 -->
      <div class="relative">
        <button 
          class="w-full px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-between hover:border-blue-500 transition-colors"
          @click.stop="targetOpen = !targetOpen"
        >
          <div class="flex items-center">
            <span v-if="selectedTargets.length > 0" class="flex items-center mr-2">
              <span class="w-5 h-5 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs">
                {{ selectedTargets.length }}
              </span>
            </span>
            <span class="text-sm truncate max-w-[180px]">
              {{ selectedTargets.length > 0 ? selectedTargets.join('，') : '选择目标靶场' }}
            </span>
          </div>
          <i class="fas fa-chevron-down text-xs ml-2 transition-transform duration-200" 
            :class="{ 'transform rotate-180': targetOpen }"></i>
        </button>

        <transition name="fade">
          <div 
            v-if="targetOpen" 
            class="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 max-h-60 overflow-y-auto"
            v-click-outside="closeDropdown"
          >
            <div 
              v-for="target in targetOptions" 
              :key="target" 
              class="px-4 py-2 hover:bg-gray-50 text-sm flex items-center cursor-pointer"
              @click="handleTargetSelect(target)"
            >
              <div class="flex items-center">
                <div class="w-5 h-5 border border-gray-300 rounded mr-3 flex items-center justify-center"
                    :class="{ 'bg-blue-500 border-blue-500': selectedTargets.includes(target) }">
                  <i v-if="selectedTargets.includes(target)" class="fas fa-check text-white text-xs"></i>
                </div>
                <span>{{ target }}</span>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- 描述文本框 -->
      <textarea
        v-model="store.description"
        class="w-full h-[200px] px-3 py-2 border border-gray-300 rounded-md"
        placeholder="在此处输入网络拓扑描述..."
      />
    </div>

    <!-- 使用已有模板提示与按钮，左下角 -->
    <div class="flex justify-end mt-8">
      <button
        @click="goToProjectPage"
        class="px-4 py-2 border border-blue-600 text-blue-600 rounded-button text-sm flex items-center gap-2 hover:bg-blue-50 transition-colors"
      >
        <i class="fas fa-layer-group"></i>
        选择工程模板
      </button>
    </div>

  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid'
import { useUserStore } from '@/stores/user'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useTemplateStore } from '@/stores/useTemplateStore'
import { ElNotification } from 'element-plus'
import axios from 'axios'

const store = useTemplateStore()
const router = useRouter()
const userStore = useUserStore()

onMounted(() => {
  if (store.industry) {
    selectedIndustry.value = store.industry
  }
})

const saveTemplate = async () => {
  if (!store.name || !selectedIndustry.value || !store.jsonCode) {
    ElNotification({
      title: '缺少必要字段',
      message: '请确保填写名称、行业，并生成拓扑代码后再保存模板',
      type: 'warning',
    })
    return
  }

  try {
    const payload = {
      name: store.name,
      description: store.description,
      industry: selectedIndustry.value,
      jsonCode: store.jsonCode,
      pyCode: store.pyCode || '',
      creator: userStore.username || '匿名用户',
      createTime: new Date().toISOString(),
    }

    const res = await axios.post('http://10.10.5.8:8080/api/templates', payload,{
      headers:{
        'Content-Type':'application/json'
      }
    })

    if (res.status === 200) {
      ElNotification({
        title: '保存成功',
        message: '模板已成功保存至后台系统',
        type: 'success',
      })
    } else {
      throw new Error(res.data.message || '保存失败')
    }
  } catch (err) {
    console.error('保存模板失败:', err)
    ElNotification({
      title: '保存失败',
      message: err.message || '后端接口异常',
      type: 'error',
    })
  }
}

const generateJson = async () => {
  if (!store.description.trim()) {
    ElNotification({
      title: '提示',
      message: '请先输入网络拓扑描述',
      type: 'warning',
    })
    return
  }

  store.setJsonCode('') // 清空旧内容
  let fullResponse = '' // 用于存储完整的响应

    ElNotification({
      title: '提示',
      message: '请求已发送，等待服务器响应...',
      type: 'warning',
      duration: 3000, // 3秒后自动关闭
    })

    try {
    const response = await fetch('http://10.10.5.8:8080/api/generate-json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ text: store.description })
    });

    // ========== 关键修改1：严格响应验证 ==========
    if (!response) {
      throw new Error('未收到服务器响应');
    }
    
    if (!response.ok) {
      // 尝试解析后端返回的错误详情
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `服务器返回错误状态: HTTP ${response.status}`
      );
    }

    if (!response.body) {
      throw new Error('服务器返回空数据');
    }

    // ========== 关键修改2：成功通知位置调整 ==========
    // 只有在所有验证通过后才显示连接成功
    ElNotification({
      title: '连接建立',
      message: '正在接收数据流...',
      type: 'success',
      duration: 2000,
    });

    // ========== 数据流处理 ==========
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullResponse = ''; // 补充缺失的变量声明

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data:')) {
          const clean = trimmed.replace(/^data:\s*/, '');
          fullResponse += clean;
          store.appendJsonLine(clean); // 实时更新
        }
      }
    }

    // ========== 关键修改3：结果处理 ==========
    try {
          const parsedJson = JSON.parse(fullResponse)
          store.setShouldMoveCursorToEnd(true)
          store.setJsonCode(JSON.stringify(parsedJson, null, 2))

          ElNotification({
            title: '处理完成',
            message: 'JSON 数据已格式化',
            type: 'success',
            duration: 3000,
          })
        } catch (e) {
          console.error('JSON 解析失败:', e)
          store.setShouldMoveCursorToEnd(true)
          store.setJsonCode(fullResponse)  // 直接使用原始返回文本

          ElNotification({
            title: '部分完成',
            message: '已接收数据，但JSON格式化失败',
            type: 'warning',
            duration: 4000,
          })
        }


  } catch (error) {
    // ========== 关键修改4：统一错误处理 ==========
    console.error('请求异常:', error);
    
    // 根据错误类型显示不同提示
    const isNetworkError = error.message.includes('Failed to fetch');
    const isServerError = error.message.includes('HTTP');
    
    ElNotification({
      title: isNetworkError ? '网络错误' : '处理失败',
      message: isNetworkError 
        ? '无法连接服务器，请检查网络' 
        : error.message || '服务器处理请求时出错',
      type: 'error',
      duration: 5000,
      customClass: 'error-notification' // 可添加自定义样式类
    });
  }
}

const deployTopology = async () => {
  const userId = userStore.userId  // 假设你登录后存了这个字段
  const pyCode = store.pyCode
  const topoId = uuidv4()

  if (!userId || !pyCode) {
    alert('用户未登录或代码为空，无法部署')
    return
  }

  try {
    // 创建 py 文件 Blob
    const file = new File([pyCode], `${topoId}.py`, { type: 'text/x-python' })

    // 构造 FormData
    const formData = new FormData()
    formData.append('topoFile', file)

    // 构造 URL（带参数）
    const url = `https://ip:12319/outApi/topo/deploy?userId=${userId}&topoId=${topoId}`

    // 发起请求（假设允许跨域）
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (response.status === 200 && result.code === 1) {
      alert('部署申请成功！')
      console.log('返回设备信息:', result.data)
    } else {
      alert(`部署失败: ${result.message || '未知错误'}`)
    }
  } catch (error) {
    console.error('部署出错:', error)
    alert('网络错误或后端服务异常')
  }
}

// 跳转至模板选择页面
const goToProjectPage = () => {
  router.push('/template')
}

// 行业选择
const industryOpen = ref(false)
const selectedIndustry = ref('行业选择')
const industries = ['教育行业', '电力行业', '医疗行业']
const selectIndustry = (item) => {
  selectedIndustry.value = item
  industryOpen.value = false
}

// 多选靶场
const targetOpen = ref(false)
const selectedTargets = ref([])
const targetOptions = [
  '分靶场一（OpenStack）', 
  '分靶场二（H3C）', 
  '分靶场三（K8S）', 
  '分靶场四（H3C）', 
  '分靶场五（OpenStack）'
]
const closeDropdown = () => { targetOpen.value = false }
const handleTargetSelect = (target) => {
  const index = selectedTargets.value.indexOf(target)
  if (index > -1) {
    selectedTargets.value.splice(index, 1)
  } else {
    selectedTargets.value.push(target)
  }
}

// 自定义指令：点击外部关闭下拉框
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value()
      }
    }
    document.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent)
  }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.max-h-60::-webkit-scrollbar {
  width: 6px;
}
.max-h-60::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 3px;
}
.max-h-60::-webkit-scrollbar-track {
  background-color: #f3f4f6;
}
</style>