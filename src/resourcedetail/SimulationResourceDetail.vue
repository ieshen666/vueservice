<!-- src/resourcedetail/SimulationResourceDetail.vue -->
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

// 模拟数据 - 实际项目中应该通过API获取
const allSimulationResources = [
  {
    id: 2,
    type: 'router',
    basicInfo: {
      deviceId: 'RTR-CORE-01',
      deviceType: 'Router',
      brandModel: 'Cisco ASR 9901',
      serialNumber: 'FOC1234ZABC',
      role: '核心路由',
      location: 'R42-U08',
      deploymentDate: '2024-12-01',
      status: 'active',
      managementIP: '10.10.1.1',
      firmwareVersion: 'IOS XR 7.7.1',
      lastModified: '2025-07-15 09:23',
      tags: ['dept=network', 'env=prod'],
      interfaceIds: ['Gi0/0/0/0', 'Gi0/0/0/1', 'Te0/0/0/0']
    },
    interfaces: [
      {
        id: 'Gi0/0/0/0',
        speedType: '10G SFP+',
        mac: '00:E0:4C:68:12:34',
        vlanSubnet: 'VLAN 100',
        purpose: '核心上联',
        status: 'up'
      },
      {
        id: 'Gi0/0/0/1',
        speedType: '10G SFP+',
        mac: '00:E0:4C:68:12:35',
        vlanSubnet: 'VLAN 200',
        purpose: '内网互联',
        status: 'up'
      },
      {
        id: 'Te0/0/0/0',
        speedType: '40G QSFP+',
        mac: '00:E0:4C:68:12:36',
        vlanSubnet: 'VLAN 300',
        purpose: '数据中心互联',
        status: 'up'
      }
    ],
    specificInfo: {
      forwardingPerformance: '240 Gbps',
      routingProtocols: ['OSPF', 'BGP'],
      chassisCards: '2 × line-card A9K-4T-TR',
      vrfCount: 32
    }
  },
  {
    id: 2,
    type: 'firewall',
    basicInfo: {
      deviceId: 'FW-DC-02',
      deviceType: 'Firewall',
      brandModel: 'Palo Alto PA-5220',
      serialNumber: 'PA12345678',
      role: '内网东西向防火墙',
      location: 'R12-U05',
      deploymentDate: '2024-11-15',
      status: 'active',
      managementIP: '192.168.0.254',
      firmwareVersion: 'PAN-OS 11.0.3',
      lastModified: '2025-07-14 14:30',
      tags: ['dept=security', 'env=prod'],
      interfaceIds: ['ethernet1/1', 'ethernet1/2', 'ethernet1/3']
    },
    interfaces: [
      {
        id: 'ethernet1/1',
        speedType: '10G SFP+',
        mac: '00:0B:86:64:12:34',
        vlanSubnet: 'VLAN 10',
        purpose: 'DMZ-inside',
        status: 'up'
      },
      {
        id: 'ethernet1/2',
        speedType: '10G SFP+',
        mac: '00:0B:86:64:12:35',
        vlanSubnet: 'VLAN 20',
        purpose: '内网互联',
        status: 'up'
      },
      {
        id: 'ethernet1/3',
        speedType: '1G',
        mac: '00:0B:86:64:12:36',
        vlanSubnet: 'VLAN 30',
        purpose: '管理接口',
        status: 'up'
      }
    ],
    specificInfo: {
      newSessionsPerSec: '1 M cps',
      throughput: '20 Gbps',
      securitySubscriptions: ['IPS', 'SSL-Decrypt', 'Threat-Intel'],
      haMode: 'Active-Passive'
    }
  },
  {
    id: 3,
    type: 'switch',
    basicInfo: {
      deviceId: 'SW-ACCESS-03',
      deviceType: 'Switch',
      brandModel: 'Cisco Catalyst 9300',
      serialNumber: 'CAT9876ZYX',
      role: '接入交换机',
      location: 'R05-U10',
      deploymentDate: '2024-10-20',
      status: 'active',
      managementIP: '10.10.3.1',
      firmwareVersion: 'IOS-XE 17.9.3',
      lastModified: '2025-07-13 11:15',
      tags: ['dept=network', 'env=prod'],
      interfaceIds: ['Gi1/0/1', 'Gi1/0/2', 'Gi1/0/3']
    },
    interfaces: [
      {
        id: 'Gi1/0/1',
        speedType: '1G',
        mac: '00:1B:53:12:34:56',
        vlanSubnet: 'VLAN 10',
        purpose: '用户接入',
        status: 'up',
        poe: '15.4 W class 3'
      },
      {
        id: 'Gi1/0/2',
        speedType: '1G',
        mac: '00:1B:53:12:34:57',
        vlanSubnet: 'VLAN 20',
        purpose: '用户接入',
        status: 'up',
        poe: '15.4 W class 3'
      },
      {
        id: 'Gi1/0/3',
        speedType: '10G SFP+',
        mac: '00:1B:53:12:34:58',
        vlanSubnet: 'VLAN 100',
        purpose: '上行链路',
        status: 'up'
      }
    ],
    specificInfo: {
      backplaneBandwidth: '6.4 Tbps',
      stacking: 'StackWise-480',
      totalPoePower: '1440 W',
      bufferCapacity: '16 MB'
    }
  },
  {
    id: 4,
    type: 'basestation',
    basicInfo: {
      deviceId: 'BS-5G-04',
      deviceType: 'BaseStation',
      brandModel: 'Huawei AAU5613',
      serialNumber: 'HW5678ABCD',
      role: '5G基站',
      location: '塔楼B 屋顶',
      deploymentDate: '2024-09-05',
      status: 'active',
      managementIP: '192.168.5.1',
      firmwareVersion: 'V100R005C10',
      lastModified: '2025-07-12 09:45',
      tags: ['dept=wireless', 'env=prod'],
      interfaceIds: ['eth1/1', 'eth1/2']
    },
    interfaces: [
      {
        id: 'eth1/1',
        speedType: '10G SFP+',
        mac: '00:1E:65:78:90:12',
        vlanSubnet: 'VLAN 500',
        purpose: '回传链路',
        status: 'up'
      },
      {
        id: 'eth1/2',
        speedType: '1G',
        mac: '00:1E:65:78:90:13',
        vlanSubnet: 'VLAN 600',
        purpose: '管理接口',
        status: 'up'
      }
    ],
    specificInfo: {
      standardBand: '5G NR n78 3.5 GHz',
      transmitPower: '40 dBm',
      coverageRadius: '500 m',
      backhaul: '10 GbE',
      antennaType: '64T64R AAU',
      licenseId: 'MIIT-5G-2024-12345'
    }
  }
]

const resourceDetail = ref<any>(null)

onMounted(() => {
  const id = Number(route.params.id)
  resourceDetail.value = allSimulationResources.find(item => item.id === id)
})

const statusClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800'
    case 'standby': return 'bg-blue-100 text-blue-800'
    case 'maintenance': return 'bg-yellow-100 text-yellow-800'
    case 'up': return 'bg-green-100 text-green-800'
    case 'down': return 'bg-red-100 text-red-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

const deviceTypeText = (type: string) => {
  switch (type) {
    case 'router': return '路由器'
    case 'firewall': return '防火墙'
    case 'switch': return '交换机'
    case 'basestation': return '通讯基站'
    default: return '其他设备'
  }
}

const handleDelete = () => {
  if (confirm(`确定要删除仿真实体资源 "${resourceDetail.value?.basicInfo.deviceId}" 吗？此操作不可撤销。`)) {
    router.push('/element')
  }
}

const handleEdit = () => {
  alert(`正在编辑仿真实体资源配置: ${resourceDetail.value?.basicInfo.deviceId}`)
}

const formatTags = (tags: string[]) => {
  return tags?.join('，') || '-'
}
</script>

<template>
  <div class="card bg-white rounded-lg shadow-sm p-4">
    <!-- 头部标题和返回按钮 -->
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-xl font-bold">仿真实体资源详情</h2>
      <button 
        @click="router.push('/networkelement')"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
      >
        <i class="fa fa-arrow-left mr-2"></i> 返回列表
      </button>
    </div>

    <template v-if="resourceDetail">
      <!-- 通用基础信息 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-info-circle mr-2 text-blue-500"></i>通用基础信息
      </h3>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <tbody class="divide-y divide-gray-200">
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50 w-1/4">设备编号</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.deviceId }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">设备类型</td>
              <td class="px-4 py-3">{{ deviceTypeText(resourceDetail.type) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">品牌/型号</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.brandModel }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">序列号</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.serialNumber }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">角色/作用</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.role }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">机架/位置</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.location }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">上线日期</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.deploymentDate }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">状态</td>
              <td class="px-4 py-3">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(resourceDetail.basicInfo.status)]">
                  {{ resourceDetail.basicInfo.status }}
                </span>
              </td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">管理地址</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.managementIP }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">固件/OS版本</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.firmwareVersion }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">最后变更时间</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.lastModified }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">标签/元数据</td>
              <td class="px-4 py-3">{{ formatTags(resourceDetail.basicInfo.tags) }}</td>
            </tr>
            <tr>
              <td class="px-4 py-3 font-semibold bg-gray-50">接口ID</td>
              <td class="px-4 py-3">{{ resourceDetail.basicInfo.interfaceIds.join(', ') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 接口与性能信息 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-network-wired mr-2 text-blue-500"></i>接口与性能信息
      </h3>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">接口ID</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">速率/类型</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">MAC/IMEI</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">VLAN/子网</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">用途</th>
              <th class="px-4 py-2 text-left text-sm font-medium text-gray-500">状态</th>
              <th v-if="resourceDetail.type === 'switch'" class="px-4 py-2 text-left text-sm font-medium text-gray-500">PoE</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="(intf, index) in resourceDetail.interfaces" :key="index" class="hover:bg-gray-50">
              <td class="px-4 py-2 text-sm font-medium text-blue-600">{{ intf.id }}</td>
              <td class="px-4 py-2 text-sm">{{ intf.speedType }}</td>
              <td class="px-4 py-2 text-sm">{{ intf.mac }}</td>
              <td class="px-4 py-2 text-sm">{{ intf.vlanSubnet }}</td>
              <td class="px-4 py-2 text-sm">{{ intf.purpose }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="['px-2 py-1 rounded-full text-xs font-semibold', statusClass(intf.status)]">
                  {{ intf.status }}
                </span>
              </td>
              <td v-if="resourceDetail.type === 'switch'" class="px-4 py-2 text-sm">{{ intf.poe || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 设备特有信息 -->
      <h3 class="text-lg font-semibold mb-3 flex items-center">
        <i class="fa fa-microchip mr-2 text-blue-500"></i>{{ deviceTypeText(resourceDetail.type) }}特有信息
      </h3>
      <div class="overflow-x-auto mb-6">
        <table class="min-w-full border border-gray-200">
          <tbody class="divide-y divide-gray-200">
            <template v-if="resourceDetail.type === 'router'">
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50 w-1/4">转发性能</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.forwardingPerformance }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">路由协议</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.routingProtocols.join(', ') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">机箱/插卡</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.chassisCards }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">VRF/实例数</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.vrfCount }}</td>
              </tr>
            </template>

            <template v-else-if="resourceDetail.type === 'firewall'">
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50 w-1/4">新建会话/秒</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.newSessionsPerSec }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">吞吐 (IMIX)</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.throughput }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">安全订阅</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.securitySubscriptions.join(', ') }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">高可用模式</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.haMode }}</td>
              </tr>
            </template>

            <template v-else-if="resourceDetail.type === 'switch'">
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50 w-1/4">背板带宽</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.backplaneBandwidth }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">堆叠/VSS</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.stacking }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">PoE总功率</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.totalPoePower }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">Buffer容量</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.bufferCapacity }}</td>
              </tr>
            </template>

            <template v-else-if="resourceDetail.type === 'basestation'">
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50 w-1/4">制式/频段</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.standardBand }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">发射功率</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.transmitPower }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">覆盖半径</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.coverageRadius }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">回传链路</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.backhaul }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">天线类型</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.antennaType }}</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold bg-gray-50">许可证编号</td>
                <td class="px-4 py-3">{{ resourceDetail.specificInfo.licenseId }}</td>
              </tr>
            </template>
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
        <p class="text-gray-500 font-medium text-lg mb-1">未找到该仿真实体资源</p>
        <p class="text-gray-400 text-sm">请返回列表页面重试</p>
      </div>
    </template>
  </div>
</template>

<style scoped>
.card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1);
}

.bg-green-100 {
  background-color: #f0fff4;
}
.text-green-800 {
  color: #276749;
}

.bg-blue-100 {
  background-color: #ebf8ff;
}
.text-blue-800 {
  color: #2b6cb0;
}

.bg-yellow-100 {
  background-color: #fffff0;
}
.text-yellow-800 {
  color: #975a16;
}

.bg-red-100 {
  background-color: #fff5f5;
}
.text-red-800 {
  color: #9b2c2c;
}

.bg-gray-100 {
  background-color: #f7fafc;
}
.text-gray-800 {
  color: #2d3748;
}

.hover\:bg-gray-50:hover {
  background-color: #f9fafb;
}
</style>