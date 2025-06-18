<template>
  <div class="card bg-white rounded-lg shadow-sm p-4 mb-4 flex flex-col min-h-[600px]">
    <!-- 顶部状态栏 -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-semibold">资源监控面板</h2>
      <div class="flex items-center space-x-3">
        <div class="text-sm px-3 py-1 rounded-full bg-gray-50 text-gray-600">
          <i class="fa-solid fa-clock mr-1"></i>
          最后更新: {{ lastUpdateTime }}
        </div>
        <select 
          v-model="pollingInterval" 
          class="border rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-200"
          @change="resetPolling"
        >
          <option value="2000">2秒</option>
          <option value="5000">5秒</option>
          <option value="10000">10秒</option>
        </select>
        <button 
          @click="togglePolling"
          class="px-3 py-1 text-sm rounded-md transition-all"
          :class="isPollingActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'"
        >
          {{ isPollingActive ? '暂停轮询' : '继续轮询' }}
        </button>
      </div>
    </div>

    <!-- 监控指标区域 -->
    <div class="space-y-6">
      <!-- Kubernetes 区域 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-semibold text-blue-600">
            Kubernetes 资源监控
          </h3>
          <div class="flex items-center space-x-2">
            <button @click="scrollK8s(-1)" class="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <i class="fa-solid fa-chevron-left text-gray-600"></i>
            </button>
            <button @click="scrollK8s(1)" class="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <i class="fa-solid fa-chevron-right text-gray-600"></i>
            </button>
          </div>
        </div>
        <div class="relative">
          <div ref="k8sScrollContainer" class="overflow-x-auto pb-4 scrollbar-hide">
            <div class="flex space-x-6 w-max min-w-full">
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>CPU 使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="k8sCpuTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ k8sCpuTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(k8sCpuTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="k8sCpuChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>内存使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="k8sMemTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ k8sMemTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(k8sMemTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="k8sMemChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>GPU 使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="k8sGpuTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ k8sGpuTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(k8sGpuTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="k8sGpuChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>网络带宽</span>
                  <span class="ml-auto text-sm font-normal" :class="k8sNetTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ k8sNetTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(k8sNetTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="k8sNetChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>磁盘IO</span>
                  <span class="ml-auto text-sm font-normal" :class="k8sDiskTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ k8sDiskTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(k8sDiskTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="k8sDiskChart" class="chart-container w-full h-[300px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-6 border-gray-300" />

      <!-- OpenStack 区域 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <h3 class="text-xl font-semibold text-purple-600">
            OpenStack 资源监控
          </h3>
          <div class="flex items-center space-x-2">
            <button @click="scrollOS(-1)" class="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <i class="fa-solid fa-chevron-left text-gray-600"></i>
            </button>
            <button @click="scrollOS(1)" class="p-1 rounded-full bg-gray-100 hover:bg-gray-200">
              <i class="fa-solid fa-chevron-right text-gray-600"></i>
            </button>
          </div>
        </div>
        <div class="relative">
          <div ref="osScrollContainer" class="overflow-x-auto pb-4 scrollbar-hide">
            <div class="flex space-x-6 w-max min-w-full">
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>CPU 使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="osCpuTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ osCpuTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(osCpuTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="osCpuChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>内存使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="osMemTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ osMemTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(osMemTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="osMemChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>GPU 使用率</span>
                  <span class="ml-auto text-sm font-normal" :class="osGpuTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ osGpuTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(osGpuTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="osGpuChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>网络带宽</span>
                  <span class="ml-auto text-sm font-normal" :class="osNetTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ osNetTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(osNetTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="osNetChart" class="chart-container w-full h-[300px]"></div>
              </div>
              <div class="bg-white p-4 rounded-lg shadow overflow-hidden w-[680px] flex-shrink-0">
                <h4 class="text-lg font-medium mb-2 flex items-center">
                  <span>磁盘IO</span>
                  <span class="ml-auto text-sm font-normal" :class="osDiskTrend >= 0 ? 'text-red-500' : 'text-green-500'">
                    {{ osDiskTrend >= 0 ? '↑' : '↓' }} {{ Math.abs(osDiskTrend).toFixed(1) }}%
                  </span>
                </h4>
                <div ref="osDiskChart" class="chart-container w-full h-[300px]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'

// 图表引用
const k8sCpuChart = ref(null)
const k8sMemChart = ref(null)
const k8sGpuChart = ref(null)
const k8sNetChart = ref(null)
const k8sDiskChart = ref(null)
const osCpuChart = ref(null)
const osMemChart = ref(null)
const osGpuChart = ref(null)
const osNetChart = ref(null)
const osDiskChart = ref(null)

// 滚动容器引用
const k8sScrollContainer = ref(null)
const osScrollContainer = ref(null)

// 轮询控制
const pollingInterval = ref('2000')
const isPollingActive = ref(true)
const lastUpdateTime = ref('')
let pollTimer = null

// 趋势计算
const k8sCpuTrend = ref(0)
const k8sMemTrend = ref(0)
const k8sGpuTrend = ref(0)
const k8sNetTrend = ref(0)
const k8sDiskTrend = ref(0)
const osCpuTrend = ref(0)
const osMemTrend = ref(0)
const osGpuTrend = ref(0)
const osNetTrend = ref(0)
const osDiskTrend = ref(0)

// 数据存储（保留10秒历史，5个数据点）
const historyData = ref({
  k8sCpu: Array(5).fill(30),
  k8sMem: Array(5).fill(50),
  k8sGpu: Array(5).fill(20),
  k8sNet: Array(5).fill(40),
  k8sDisk: Array(5).fill(35),
  osCpu: Array(5).fill(30),
  osMem: Array(5).fill(50),
  osGpu: Array(5).fill(25),
  osNet: Array(5).fill(35),
  osDisk: Array(5).fill(40),
  timestamps: Array(5).fill('')
})

// 初始化时间戳（10秒范围）
const initTimestamps = () => {
  const now = new Date()
  historyData.value.timestamps = Array.from({ length: 5 }, (_, i) => 
    new Date(now.getTime() - (4 - i) * 2000).toLocaleTimeString().slice(0, 8)
  )
}

// 滚动控制
const scrollK8s = (direction) => {
  if (k8sScrollContainer.value) {
    const scrollAmount = 680 + 24 // 卡片宽度 + 间距
    k8sScrollContainer.value.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    })
  }
}

const scrollOS = (direction) => {
  if (osScrollContainer.value) {
    const scrollAmount = 680 + 24 // 卡片宽度 + 间距
    osScrollContainer.value.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    })
  }
}

// 图表尺寸调整
const resizeCharts = () => {
  const charts = [
    k8sCpuChart, k8sMemChart, k8sGpuChart, k8sNetChart, k8sDiskChart,
    osCpuChart, osMemChart, osGpuChart, osNetChart, osDiskChart
  ]
  
  charts.forEach(chart => {
    if (!chart.value) return
    const instance = echarts.getInstanceByDom(chart.value)
    if (instance) {
      instance.resize({
        width: 'auto',
        height: 'auto'
      })
    }
  })
}

// 初始化图表
const initCharts = () => {
  // 清理旧图表实例
  const chartRefs = [
    k8sCpuChart, k8sMemChart, k8sGpuChart, k8sNetChart, k8sDiskChart,
    osCpuChart, osMemChart, osGpuChart, osNetChart, osDiskChart
  ]
  
  chartRefs.forEach(chartRef => {
    if (chartRef.value && echarts.getInstanceByDom(chartRef.value)) {
      echarts.dispose(echarts.getInstanceByDom(chartRef.value))
    }
  })
  
  initTimestamps()
  
  const charts = [
    { ref: k8sCpuChart, title: 'k8sCpu', color: '#5470C6' },
    { ref: k8sMemChart, title: 'k8sMem', color: '#91CC75' },
    { ref: k8sGpuChart, title: 'k8sGpu', color: '#FAC858' },
    { ref: k8sNetChart, title: 'k8sNet', color: '#EE6666' },
    { ref: k8sDiskChart, title: 'k8sDisk', color: '#73C0DE' },
    { ref: osCpuChart, title: 'osCpu', color: '#5470C6' },
    { ref: osMemChart, title: 'osMem', color: '#91CC75' },
    { ref: osGpuChart, title: 'osGpu', color: '#FAC858' },
    { ref: osNetChart, title: 'osNet', color: '#EE6666' },
    { ref: osDiskChart, title: 'osDisk', color: '#73C0DE' }
  ]

  // 使用 setTimeout 确保 DOM 完全渲染
  setTimeout(() => {
    charts.forEach(chart => {
      if (!chart.ref.value) return
      const instance = echarts.init(chart.ref.value)
      instance.setOption(createChartOption(chart.title, chart.color))
      updateChartData(instance, chart.title)
      // 初始 resize
      instance.resize()
    })
  }, 0)
}

// 创建图表配置
const createChartOption = (title, color) => ({
  animationDuration: 800,
  grid: {
    top: 40,
    right: 30,
    bottom: 40,
    left: 50,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      const time = params[0].axisValue
      const value = params[0].data
      const idx = historyData.value.timestamps.indexOf(time)
      const prevValue = idx > 0 ? historyData.value[title][idx-1] : value
      const change = value - prevValue
      return `
        <div class="font-bold">${time}</div>
        <div>${title.replace(/([A-Z])/g, ' $1').trim()}: ${value.toFixed(1)}%</div>
        <div>变化: ${change >= 0 ? '+' : ''}${change.toFixed(1)}%</div>
      `
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: historyData.value.timestamps,
    axisLabel: { 
      color: '#666',
      rotate: 0,
      interval: 0,
      margin: 10
    }
  },
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    axisLabel: { 
      formatter: '{value}%',
      margin: 10
    }
  },
  series: [{
    name: title,
    type: 'line',
    showSymbol: true,
    symbolSize: 6,
    data: historyData.value[title],
    lineStyle: { width: 2, color },
    areaStyle: { color: `${color}10` }
  }]
})

// 更新图表数据
const updateChartData = (chartInstance, dataKey) => {
  if (!chartInstance) return
  
  const option = chartInstance.getOption() || createChartOption(dataKey)
  
  option.xAxis[0].data = [...historyData.value.timestamps]
  option.series[0].data = [...historyData.value[dataKey]]
  
  chartInstance.setOption(option, {
    notMerge: false,
    lazyUpdate: true
  })
  
  // 每次更新后 resize
  chartInstance.resize()
}

// 生成新数据点（带趋势）
const generateNewDataPoint = (historyArray, isMemory = false, isGpu = false, isNet = false, isDisk = false) => {
  const lastValue = historyArray[historyArray.length - 1]
  let base = 30
  let volatility = 12
  
  if (isMemory) {
    base = 50
    volatility = 8
  } else if (isGpu) {
    base = 25
    volatility = 15
  } else if (isNet) {
    base = 35
    volatility = 20
  } else if (isDisk) {
    base = 40
    volatility = 18
  }
  
  // 30%概率上升，30%概率下降，40%概率平稳
  const trend = Math.random() < 0.3 ? 1 : (Math.random() < 0.6 ? -1 : 0)
  const change = trend * (1 + Math.random() * volatility/2)
  
  return Math.max(5, Math.min(95, lastValue + change))
}

// 执行数据更新
const updateMetrics = () => {
  const now = new Date()
  const currentTime = now.toLocaleTimeString().slice(0, 8)
  
  // 生成新数据
  const newData = {
    k8sCpu: generateNewDataPoint(historyData.value.k8sCpu),
    k8sMem: generateNewDataPoint(historyData.value.k8sMem, true),
    k8sGpu: generateNewDataPoint(historyData.value.k8sGpu, false, true),
    k8sNet: generateNewDataPoint(historyData.value.k8sNet, false, false, true),
    k8sDisk: generateNewDataPoint(historyData.value.k8sDisk, false, false, false, true),
    osCpu: generateNewDataPoint(historyData.value.osCpu),
    osMem: generateNewDataPoint(historyData.value.osMem, true),
    osGpu: generateNewDataPoint(historyData.value.osGpu, false, true),
    osNet: generateNewDataPoint(historyData.value.osNet, false, false, true),
    osDisk: generateNewDataPoint(historyData.value.osDisk, false, false, false, true)
  }
  
  // 计算趋势（当前值与前值比较）
  k8sCpuTrend.value = newData.k8sCpu - historyData.value.k8sCpu[3]
  k8sMemTrend.value = newData.k8sMem - historyData.value.k8sMem[3]
  k8sGpuTrend.value = newData.k8sGpu - historyData.value.k8sGpu[3]
  k8sNetTrend.value = newData.k8sNet - historyData.value.k8sNet[3]
  k8sDiskTrend.value = newData.k8sDisk - historyData.value.k8sDisk[3]
  osCpuTrend.value = newData.osCpu - historyData.value.osCpu[3]
  osMemTrend.value = newData.osMem - historyData.value.osMem[3]
  osGpuTrend.value = newData.osGpu - historyData.value.osGpu[3]
  osNetTrend.value = newData.osNet - historyData.value.osNet[3]
  osDiskTrend.value = newData.osDisk - historyData.value.osDisk[3]
  
  // 滚动更新数据
  historyData.value.timestamps.shift()
  historyData.value.timestamps.push(currentTime)
  
  Object.keys(newData).forEach(key => {
    historyData.value[key].shift()
    historyData.value[key].push(newData[key])
  })
  
  // 更新视图
  lastUpdateTime.value = currentTime
  updateAllCharts()
}

// 更新所有图表
const updateAllCharts = () => {
  const charts = [
    { ref: k8sCpuChart, key: 'k8sCpu' },
    { ref: k8sMemChart, key: 'k8sMem' },
    { ref: k8sGpuChart, key: 'k8sGpu' },
    { ref: k8sNetChart, key: 'k8sNet' },
    { ref: k8sDiskChart, key: 'k8sDisk' },
    { ref: osCpuChart, key: 'osCpu' },
    { ref: osMemChart, key: 'osMem' },
    { ref: osGpuChart, key: 'osGpu' },
    { ref: osNetChart, key: 'osNet' },
    { ref: osDiskChart, key: 'osDisk' }
  ]
  
  charts.forEach(chart => {
    if (!chart.ref.value) return
    const instance = echarts.getInstanceByDom(chart.ref.value)
    if (instance) updateChartData(instance, chart.key)
  })
}

// 轮询控制
const startPolling = () => {
  stopPolling()
  isPollingActive.value = true
  
  const poll = () => {
    updateMetrics()
    pollTimer = setTimeout(poll, parseInt(pollingInterval.value))
  }
  
  poll()
}

const stopPolling = () => {
  clearTimeout(pollTimer)
  pollTimer = null
  isPollingActive.value = false
}

const resetPolling = () => {
  stopPolling()
  startPolling()
}

const togglePolling = () => {
  if (isPollingActive.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

// 生命周期
onMounted(() => {
  initCharts()
  startPolling()
  
  // 添加窗口 resize 监听
  window.addEventListener('resize', resizeCharts)
})

onBeforeUnmount(() => {
  stopPolling()
  // 移除窗口 resize 监听
  window.removeEventListener('resize', resizeCharts)
  
  // 清理所有图表实例
  const chartRefs = [
    k8sCpuChart, k8sMemChart, k8sGpuChart, k8sNetChart, k8sDiskChart,
    osCpuChart, osMemChart, osGpuChart, osNetChart, osDiskChart
  ]
  
  chartRefs.forEach(chartRef => {
    if (chartRef.value && echarts.getInstanceByDom(chartRef.value)) {
      echarts.dispose(echarts.getInstanceByDom(chartRef.value))
    }
  })
})
</script>

<style scoped>
.chart-container {
  min-height: 300px;
  width: 100%;
  position: relative;
}

/* 水平滚动容器样式 */
.overflow-x-auto {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

.overflow-x-auto::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}

.w-max {
  width: max-content;
}

/* 卡片固定宽度 */
/* .w-[680px] {
  width: 680px;
} */

/* 优化图表悬停效果 */
.chart-container:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease;
}

/* 提示用户可滑动的提示 */
.text-gray-500 {
  color: #6b7280;
}

.fa-arrows-left-right {
  color: #9ca3af;
}
</style>