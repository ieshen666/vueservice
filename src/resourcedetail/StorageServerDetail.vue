<!-- src/resourcedetail/StorageServerDetail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 模拟数据 - 实际项目中应该通过API获取
const allStorageData = [
  {
    id: 4,
    name: '物理服务器节点1',
    type: '存储服务器',
    range: '鹏城主靶场',
    location: '鹏城实验室',
    price: '32.5万',
    status: '维护中',
    hardware: {
      computing: [
        { field: 'CPU型号', value: 'Intel Xeon Silver 4310' },
        { field: 'CPU核数（核）', value: '24核' },
        { field: 'CPU线程数', value: '48' },
        { field: 'CPU频率', value: '2.1 GHz (基准)' },
      ],
      network: [
        { field: '网络带宽（bit/s）', value: '40 Gbps (40,000,000,000 bit/s)' },
        { field: '网卡型号/芯片', value: 'Mellanox ConnectX-5' },
      ],
      storage: [
        { field: '存储类型', value: '分布式对象存储' },
        { field: '总容量', value: '1.2 PB (1,200,000,000,000,000 B)' },
        { field: '已用/剩余', value: '450 TB / 750 TB' },
        { field: '数据保护策略', value: 'EC 6+2' },
        { field: 'IOPS/吞吐', value: '500K IOPS / 8 GB s⁻¹' },
      ]
    },
    software: [
      {
        component: 'Ceph Octopus',
        version: '15.2.17',
        channel: 'Proxmox integrated',
        deployment: '节点1-10',
        runMode: 'systemd containers',
        role: '分布式存储服务',
        ports: '6800-7300/tcp',
        backendDB: 'LevelDB @/var/lib/ceph',
        dependencies: 'librados, librbd',
        plugins: 'BlueStore backend',
        configPath: '/etc/pve/ceph.conf',
        user: 'ceph',
        status: '8 OSDs active',
        lastUpdate: '2025-07-10 08:45',
        notes: 'EC 4+2 profile'
      },
      {
        component: 'Open vSwitch',
        version: '3.1.5',
        channel: 'Debian backports',
        deployment: '所有物理节点',
        runMode: 'systemd',
        role: 'SDN虚拟网络',
        ports: '6640/tcp (OVSDB)',
        backendDB: 'OVSDB @/etc/openvswitch',
        dependencies: 'DPDK 21.11',
        plugins: 'dpdk, vxlan',
        configPath: '/etc/openvswitch/conf.db',
        user: 'openvswitch',
        status: 'active + VXLAN tunnels',
        lastUpdate: '2025-07-08 14:20',
        notes: 'DPDK bonding'
      }
    ],
    images: [
      {
        id: 'img-ubuntu-2004',
        name: 'Ubuntu 20.04 Base',
        format: 'qcow2',
        size: '2,147,483,648',
        os: 'Ubuntu 20.04 LTS',
        minVcpu: 2,
        minMemory: '4,294,967,296',
        minStorage: '42,949,672,960',
        arch: 'x86',
        hash: 'SHA-256: 7a9f3e2d...',
        version: '2025-05-LTS',
        scenarios: ['边缘节点轻量部署', '网络设备'],
        requirements: '最小 vCPU 2 / RAM 4 GB, cloud-init',
        status: 'active',
        createdAt: '2025-07-01 10:00:00',
        description: '此镜像用于边缘计算节点基础部署'
      }
    ]
  }
]

const storageDetail = ref<any>(null)

onMounted(() => {
  const id = Number(route.params.id)
  storageDetail.value = allStorageData.find(item => item.id === id)
})

const statusClass = (status: string) => {
  switch (status) {
    case '运行中': return 'bg-green-100 text-green-800'
    case '可用': return 'bg-blue-100 text-blue-800'
    case '维护中': return 'bg-yellow-100 text-yellow-800'
    case 'active': return 'bg-green-100 text-green-800'
    case 'deprecated': return 'bg-gray-100 text-gray-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const handleDelete = () => {
  if (confirm(`确定要删除存储服务器 "${storageDetail.value?.name}" 吗？此操作不可撤销。`)) {
    router.push('/element')
  }
}

const handleEdit = () => {
  alert(`正在编辑存储服务器配置: ${storageDetail.value?.name}`)
}

const formatScenarios = (scenarios: string[]) => {
  return scenarios?.join('，') || '-'
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4">
    <!-- 头部标题和返回按钮 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">存储服务器资源详情</h2>
      <button 
        @click="router.push('/networkelement')"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
      >
        <i class="fa fa-arrow-left mr-2"></i> 返回列表
      </button>
    </div>

    <template v-if="storageDetail">
      <!-- 主详情表格 -->
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50 w-1/5">服务器名称</td>
              <td class="px-4 py-3">{{ storageDetail.name }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">服务器类型</td>
              <td class="px-4 py-3">{{ storageDetail.type }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">所属靶场</td>
              <td class="px-4 py-3">{{ storageDetail.range }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">地理位置</td>
              <td class="px-4 py-3">{{ storageDetail.location }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">价格</td>
              <td class="px-4 py-3">{{ storageDetail.price }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">状态</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(storageDetail.status)]">
                  {{ storageDetail.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 硬件资源 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-microchip mr-2 text-blue-500"></i>硬件资源
      </h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <!-- 计算资源 -->
        <div class="border border-gray-200 rounded-md overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 font-medium">计算资源</div>
          <table class="min-w-full divide-y divide-gray-200">
            <tbody>
              <tr v-for="(item, index) in storageDetail.hardware.computing" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm font-medium text-gray-500">{{ item.field }}</td>
                <td class="px-4 py-2 text-sm">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 网络资源 -->
        <div class="border border-gray-200 rounded-md overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 font-medium">网络资源</div>
          <table class="min-w-full divide-y divide-gray-200">
            <tbody>
              <tr v-for="(item, index) in storageDetail.hardware.network" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm font-medium text-gray-500">{{ item.field }}</td>
                <td class="px-4 py-2 text-sm">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 存储资源 -->
        <div class="border border-gray-200 rounded-md overflow-hidden">
          <div class="bg-gray-50 px-4 py-2 font-medium">存储资源</div>
          <table class="min-w-full divide-y divide-gray-200">
            <tbody>
              <tr v-for="(item, index) in storageDetail.hardware.storage" :key="index" class="hover:bg-gray-50">
                <td class="px-4 py-2 text-sm font-medium text-gray-500">{{ item.field }}</td>
                <td class="px-4 py-2 text-sm">{{ item.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 软件资源 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-code mr-2 text-blue-500"></i>软件资源
      </h3>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">组件</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">版本</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">发行渠道/镜像</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">部署节点/AZ</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">运行模式</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">角色/作用</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">关键端口</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">状态</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(item, index) in storageDetail.software" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium text-blue-600">{{ item.component }}</td>
              <td class="px-4 py-2 text-sm">{{ item.version }}</td>
              <td class="px-4 py-2 text-sm">{{ item.channel }}</td>
              <td class="px-4 py-2 text-sm">{{ item.deployment }}</td>
              <td class="px-4 py-2 text-sm">{{ item.runMode }}</td>
              <td class="px-4 py-2 text-sm">{{ item.role }}</td>
              <td class="px-4 py-2 text-sm">{{ item.ports }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(item.status)]">
                  {{ item.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 镜像资源表 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-hdd mr-2 text-blue-500"></i> 镜像资源
      </h3>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">镜像ID</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">名称</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">格式</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">镜像大小(B)</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">操作系统</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">最小vCPU</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">最小内存(B)</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">状态</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">创建时间</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(image, index) in storageDetail.images" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium text-blue-600">{{ image.id }}</td>
              <td class="px-4 py-2 text-sm">{{ image.name }}</td>
              <td class="px-4 py-2 text-sm">{{ image.format }}</td>
              <td class="px-4 py-2 text-sm">{{ image.size }}</td>
              <td class="px-4 py-2 text-sm">{{ image.os }}</td>
              <td class="px-4 py-2 text-sm">{{ image.minVcpu }}核</td>
              <td class="px-4 py-2 text-sm">{{ image.minMemory }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(image.status)]">
                  {{ image.status }}
                </span>
              </td>
              <td class="px-4 py-2 text-sm">{{ image.createdAt }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-3">
        <button 
          @click="handleDelete"
          class="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-md flex items-center"
        >
          <i class="fa fa-trash mr-2"></i> 删除资源
        </button>
        <button 
          @click="handleEdit"
          class="px-4 py-2 bg-blue-500 text-white hover:bg-blue-600 rounded-md flex items-center"
        >
          <i class="fa fa-edit mr-2"></i> 编辑配置
        </button>
      </div>
    </template>

    <template v-else>
      <div class="text-center py-8">
        <i class="fa fa-exclamation-circle text-4xl text-gray-400 mb-4"></i>
        <p class="text-gray-500 font-medium text-lg mb-1">未找到该存储服务器资源</p>
        <p class="text-gray-400 text-sm">请返回列表页面重试</p>
      </div>
    </template>
  </div>
</template>