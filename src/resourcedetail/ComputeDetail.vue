<!-- src/resourcedetail/ComputeServerDetail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 模拟数据 - 实际项目中应该通过API获取
const allComputeData = [
  {
    id: 1,
    name: '计算服务器集群A',
    type: '计算服务器',
    range: '鹏城主靶场',
    location: '鹏城实验室',
    price: '24.8万',
    status: '运行中',
    hardware: {
      computing: [
        { field: 'CPU型号', value: 'Intel Xeon Gold 6326' },
        { field: 'CPU核数（核）', value: '32核' },
        { field: 'CPU线程数', value: '64' },
        { field: 'CPU频率', value: '2.9 GHz (基准)' },
        { field: 'CPU缓存', value: 'L3 48 MB' },
        { field: '指令集/虚拟化', value: 'AVX-512, VT-x/VT-d, AMD-V' },
        { field: 'GPU/协处理器', value: 'NVIDIA A40 × 2 (48 GB VRAM)' },
        { field: '内存型号', value: 'DDR5-4800 ECC RDIMM' },
        { field: '内存容量（B）', value: '256 GB (274,877,906,944 B)' },
        { field: '内存插槽/已用', value: '16/8' },
        { field: 'power_idle_w / power_full_w', value: '250 W / 850 W' },
      ],
      network: [
        { field: '网络带宽（bit/s）', value: '100 Gbps (100,000,000,000 bit/s)' },
        { field: '网卡型号/芯片', value: 'Mellanox ConnectX-6 DX' },
        { field: 'MAC地址', value: '00:1A:3F:2B:44:AA' },
        { field: 'IP / VLAN', value: '172.18.3.10 / VLAN 210' },
        { field: '网络设置', value: 'Bond mode 4 (LACP)' },
        { field: 'RDMA / SR-IOV', value: '启用 / 启用' },
      ],
      storage: [
        { field: '硬盘型号', value: 'Samsung PM1733 3.2 TB NVMe' },
        { field: '容量', value: '系统盘 × 2 (3.2 TB) + 数据盘 × 8 (12.8 TB)' },
        { field: '类型', value: 'NVMe SSD' },
        { field: '接口/协议', value: 'PCIe 4.0 × 4 / NVMe' },
        { field: '磁盘数量 / RAID', value: '10 × NVMe SSD，RAID 60' },
        { field: '已用/剩余', value: '9.5 TB / 14.5 TB' },
        { field: '策略', value: '快照+异地备份，写前缓存' },
        { field: 'IOPS/吞吐', value: '2M IOPS / 12 GB s⁻¹' },
        { field: '副本数', value: '3' },
        { field: '数据保护策略', value: 'EC 8+2' },
        { field: '管理协议', value: 'Redfish v1.15.0' },
      ]
    },
    software: [
      {
        component: 'Proxmox VE Kernel',
        version: 'Linux 6.5.11-7-pve',
        channel: 'Proxmox official repository',
        deployment: '物理节点1-4',
        runMode: 'bare-metal hypervisor',
        role: '虚拟化平台核心',
        ports: '',
        backendDB: '',
        dependencies: '',
        plugins: 'ZFS on Linux 2.1.12',
        configPath: '/etc/pve/version',
        user: 'root',
        status: 'active',
        lastUpdate: '2025-07-09 11:30',
        notes: ''
      },
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
      }
    ]
  }
]

const computeDetail = ref<any>(null)

onMounted(() => {
  const id = Number(route.params.id)
  computeDetail.value = allComputeData.find(item => item.id === id)
})

const statusClass = (status: string) => {
  switch (status) {
    case '运行中': return 'bg-green-100 text-green-800'
    case '可用': return 'bg-blue-100 text-blue-800'
    case '维护中': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const handleDelete = () => {
  if (confirm(`确定要删除服务器资源 "${computeDetail.value?.name}" 吗？此操作不可撤销。`)) {
    router.push('/element')
  }
}

const handleEdit = () => {
  alert(`正在编辑服务器配置: ${computeDetail.value?.name}`)
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4">
    <!-- 头部标题和返回按钮 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">服务器资源详情</h2>
      <button 
        @click="router.push('/networkelement')"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
      >
        <i class="fa fa-arrow-left mr-2"></i> 返回列表
      </button>
    </div>

    <template v-if="computeDetail">
      <!-- 主详情表格 -->
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50 w-1/5">服务器名称</td>
              <td class="px-4 py-3">{{ computeDetail.name }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">服务器类型</td>
              <td class="px-4 py-3">{{ computeDetail.type }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">所属靶场</td>
              <td class="px-4 py-3">{{ computeDetail.range }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">地理位置</td>
              <td class="px-4 py-3">{{ computeDetail.location }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">价格</td>
              <td class="px-4 py-3">{{ computeDetail.price }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">状态</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(computeDetail.status)]">
                  {{ computeDetail.status }}
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
              <tr v-for="(item, index) in computeDetail.hardware.computing" :key="index" class="hover:bg-gray-50">
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
              <tr v-for="(item, index) in computeDetail.hardware.network" :key="index" class="hover:bg-gray-50">
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
              <tr v-for="(item, index) in computeDetail.hardware.storage" :key="index" class="hover:bg-gray-50">
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
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(item, index) in computeDetail.software" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm">{{ item.component }}</td>
              <td class="px-4 py-2 text-sm">{{ item.version }}</td>
              <td class="px-4 py-2 text-sm">{{ item.channel }}</td>
              <td class="px-4 py-2 text-sm">{{ item.deployment }}</td>
              <td class="px-4 py-2 text-sm">{{ item.runMode }}</td>
              <td class="px-4 py-2 text-sm">{{ item.role }}</td>
              <td class="px-4 py-2 text-sm">{{ item.ports }}</td>
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
        <p class="text-gray-500 font-medium text-lg mb-1">未找到该服务器资源</p>
        <p class="text-gray-400 text-sm">请返回列表页面重试</p>
      </div>
    </template>
  </div>
</template>