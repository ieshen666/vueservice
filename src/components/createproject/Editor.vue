<template>
  <div class="monaco-editor-container">
    <div class="flex justify-end mb-2">
      <button
        @click="toggleConversion"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
      >
        {{ isPythonMode ? '返回JSON编辑' : '转换为Python' }}
      </button>

      <button
      @click="loadDemo"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-all duration-300 flex items-center"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
      </svg>
      加载示例
    </button>

    </div>
    <transition name="fade">
      <div ref="editorContainer" class="editor-wrapper"></div>
    </transition>
  </div>
</template>


<script setup>

import { DEMO_JSON } from '@/assets/demoConfig'

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { useTemplateStore } from '@/stores/useTemplateStore'
import loader from '@monaco-editor/loader'

const store = useTemplateStore()
const editorContainer = ref(null)
const isPythonMode = ref(false) // 新增状态控制
let editor = null

function loadDemo() {
  if (editor) {
    editor.setValue(DEMO_JSON)
  }
}

// 主题配置
const setupMonacoTheme = (monacoInstance) => {
  monacoInstance.editor.defineTheme('my-theme', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: '', foreground: '333333', background: 'f9f9f9' },
      { token: 'comment', foreground: '999999', fontStyle: 'italic' }
    ],
    colors: {
      'editor.background': '#ffffff',
      'editor.lineHighlightBackground': '#d1d5db33',
      'scrollbar.shadow': '#e5e7eb',
      'editorOverviewRuler.border': '#e5e7eb',
      'editorGutter.background': '#ffffff',
      'editorWhitespace.foreground': '#f3f4f6'
    }
  })
}

// JSON转Python逻辑（保持原有实现）
function convertJsonToPy(jsonCode) {
  try {
    const obj = JSON.parse(jsonCode);
    
    let result = "from pcl import library2 as pcl\n\n";
    result += generateNetworkSegmentation(obj);
    result += generateFirewallConfig(obj);
    result += generateRouterConfig(obj);
    result += generateVMConfig(obj);
    
    return `# Converted from JSON\n${result}`;
    
  } catch (err) {
    // 专门处理JSON语法错误
    if (err instanceof SyntaxError) {
      return formatJsonError(err, jsonCode);
    }
    
    // 其他类型错误仍保留基本信息
    return `# 转换错误: ${err.message}\n` + 
           `# 请检查JSON结构是否符合要求`;
  }
}

// 专门格式化JSON错误信息
function formatJsonError(err, jsonCode) {
  const message = err.message.replace(/^JSON\.parse: /, '');
  
  // 尝试提取位置信息
  const lineMatch = message.match(/at line (\d+) column (\d+)/i);
  const posMatch = message.match(/position (\d+)/i);
  
  let errorInfo = `# JSON语法错误: ${message}\n`;
  
  if (lineMatch) {
    const [_, line, column] = lineMatch;
    errorInfo += `# 位于 行 ${line} 列 ${column}\n\n`;
    errorInfo += getCodeSnippet(jsonCode, parseInt(line), parseInt(column));
  } else if (posMatch) {
    const pos = parseInt(posMatch[1]);
    errorInfo += `# 位于字符位置 ${pos}\n\n`;
    errorInfo += getCodeContext(jsonCode, pos);
  }
  
  return errorInfo;
}

// 获取错误行上下文
function getCodeSnippet(code, errorLine, errorColumn) {
  const lines = code.split('\n');
  const start = Math.max(0, errorLine - 2);
  const end = Math.min(lines.length, errorLine + 1);
  
  let snippet = '';
  for (let i = start; i < end; i++) {
    const lineNum = i + 1;
    const marker = lineNum === errorLine ? 
      `# > ${lineNum}: ` : `#   ${lineNum}: `;
    
    snippet += marker + lines[i] + '\n';
    
    // 添加错误位置指示
    if (lineNum === errorLine) {
      snippet += '#    ' + ' '.repeat(errorColumn - 1) + '^\n';
    }
  }
  
  return snippet;
}

// 获取字符位置上下文
function getCodeContext(code, pos) {
  const start = Math.max(0, pos - 20);
  const end = Math.min(code.length, pos + 20);
  const context = code.slice(start, end);
  
  return `# 上下文: ${context}\n` +
         `#         ${' '.repeat(Math.min(20, pos - start))}^`;
}

// 生成网络划分配置
function generateNetworkSegmentation(data) {
  const networkPartition = data["网络划分"];
  const myNetwork = {};
  
  let startId = 120;
  Object.entries(networkPartition).forEach(([area, info], index) => {
    const networks = info["包含网段"];
    myNetwork[area] = [startId + index, ...networks];
  });
  
  let output = "my_network = {\n";
  Object.entries(myNetwork).forEach(([area, values]) => {
    const valuesStr = values.map(v => typeof v === 'string' ? `'${v}'` : v).join(", ");
    output += `    "${area}": [${valuesStr}],\n`;
  });
  output = output.slice(0, -2); // 移除最后的逗号和换行符
  output += "\n}\n\n";
  
  return output;
}

// 生成防火墙配置
function generateFirewallConfig(data) {
  const firewalls = data["防火墙"];
  let output = "network = pcl.Network(detail=my_network)\n";
  output += "network_total, subnet_total = network.create()\n\n";
  
  let firewallNum = 1;
  let firewallId = 130;
  
  Object.entries(firewalls).forEach(([firewallName, firewallInfo]) => {
    const instanceSpec = firewallInfo["实例规格"];
    const image = firewallInfo["镜像"];
    const subnets = firewallInfo["子网"];
    
    const userData = `#!/bin/vbash
source /opt/vyatta/etc/functions/script-template
configure

commit
save
`;
    
    output += `user_data_${firewallNum} = """\n${userData}"""\n`;
    output += `firewall_${firewallNum} = pcl.firewall("${firewallName}", "${instanceSpec}", "${image}", ${firewallId}, ${JSON.stringify(subnets)}, user_data_${firewallNum})\n`;
    output += `firewall_vm_${firewallNum}, firewall_subnet_${firewallNum} = firewall_${firewallNum}.create()\n\n`;
    
    firewallNum++;
    firewallId++;
  });
  
  return output;
}

// 生成路由器配置
function generateRouterConfig(data) {
  const networkSegments = data["网络划分"];
  const firewalls = data["防火墙"];
  const routers = data["路由器交换机"];
  
  // 建立网络划分索引
  const subnetIndex = {};
  Object.entries(networkSegments).forEach(([area, config], i) => {
    config["包含网段"].forEach((subnet, j) => {
      subnetIndex[subnet] = [i, j];
    });
  });
  
  // 建立防火墙索引
  const firewallIndex = {};
  Object.keys(firewalls).forEach((name, i) => {
    firewallIndex[name] = i + 1;
  });
  
  // 构建路由器字典
  const myRouter = {};
  
  Object.entries(routers).forEach(([routerName, routerConfig]) => {
    const parts = [];
    
    // 处理接入网段
    if (routerConfig["接入网段"]) {
      routerConfig["接入网段"].forEach(subnet => {
        if (subnetIndex[subnet]) {
          const [i, j] = subnetIndex[subnet];
          parts.push(`subnet_total[${i}][${j}]`);
        }
      });
    }
    
    // 处理接入防火墙
    if (routerConfig["接入防火墙"]) {
      routerConfig["接入防火墙"].forEach(firewallSubnet => {
        for (const [fwName, fwConfig] of Object.entries(firewalls)) {
          if (fwConfig["子网"].includes(firewallSubnet)) {
            const fwIdx = firewallIndex[fwName];
            const fwSubnetIdx = fwConfig["子网"].indexOf(firewallSubnet);
            parts.push(`firewall_subnet_${fwIdx}[${fwSubnetIdx}]`);
            break;
          }
        }
      });
    }
    
    myRouter[routerName] = parts;
  });
  
  let output = "my_router = {\n";
  Object.entries(myRouter).forEach(([routerName, parts]) => {
    output += `    "${routerName}": [${parts.join(", ")}],\n`;
  });
  output = output.slice(0, -2); // 移除最后的逗号和换行符
  output += "\n}\n\n";
  output += "router = pcl.Router(detail=my_router)\n";
  output += "router_total = router.create()\n\n";
  
  return output;
}

// 生成虚拟机配置
function generateVMConfig(data) {
  const networkDivisions = data["网络划分"];
  const instances = data["实例"];
  
  // 建立网络划分名称到索引的映射
  const divisionNames = Object.keys(networkDivisions);
  const divisionIndex = {};
  divisionNames.forEach((name, i) => {
    divisionIndex[name] = i;
  });
  
  // 初始化VM结构
  const vm = {};
  
  // 处理每个实例区域
  Object.entries(instances).forEach(([areaName, areaInstances]) => {
    vm[areaName] = [];
    const areaIdx = divisionIndex[areaName];
    
    // 处理每个实例
    areaInstances.forEach(instanceData => {
      const instanceName = Object.keys(instanceData)[0];
      const instanceProps = instanceData[instanceName];
      
      // 构建基础条目
      const entry = [
        `"${instanceName}"`,
        `"${instanceProps["镜像"]}"`,
        `"${instanceProps["实例规格"]}"`,
        `network_total[${areaIdx}]`
      ];
      
      // 处理接入网段
      const accessNetwork = instanceProps["接入网段"];
      if (accessNetwork !== null) {
        if (areaName === "运营商") {
          const subnets = networkDivisions[areaName]["包含网段"];
          const subnetIndex = subnets.indexOf(accessNetwork);
          if (subnetIndex !== -1) {
            entry.push(`subnet_total[${areaIdx}][${subnetIndex}]`);
          }
        } else {
          entry.push(`subnet_total[${areaIdx}][0]`);
        }
      }
      
      // 处理指定IP
      const specifiedIp = instanceProps["指定IP"];
      if (specifiedIp !== null) {
        entry.push(`"${specifiedIp}"`);
      }
      
      vm[areaName].push(`[${entry.join(", ")}]`);
    });
  });
  
  // 生成结果字符串
  let output = "vm = {\n";
  Object.entries(vm).forEach(([areaName, areaEntries]) => {
    output += `    "${areaName}": [\n        ${areaEntries.join(",\n        ")}\n    ],\n`;
  });
  output = output.slice(0, -2); // 移除最后的逗号和换行符
  output += "\n}\n\n";
  output += "vm_cr = pcl.VM(detail=vm)\n";
  output += "vm_total = vm_cr.create()\n";
  
  return output;
}



// 切换转换模式
const toggleConversion = async () => {
  const currentValue = editor.getValue()
  
  if (isPythonMode.value) {
    // 返回JSON编辑模式
    isPythonMode.value = false
    editor.setValue(store.jsonCode)
    monaco.editor.setModelLanguage(editor.getModel(), 'json')
    editor.updateOptions({ readOnly: false })
  } else {
    try {
      // 转换为Python模式
      store.setJsonCode(currentValue) // 保存当前JSON
      const converted = convertJsonToPy(currentValue)
      store.setPyCode(converted) // 保存转换结果
      isPythonMode.value = true
      editor.setValue(converted)
      monaco.editor.setModelLanguage(editor.getModel(), 'python')
      editor.updateOptions({ readOnly: true })
    } catch (err) {
      // 这里捕获任何未处理的错误
      const errorMessage = `# 转换过程中发生未捕获错误\n` +
                           `'''\n${err.stack}\n'''`;
      editor.setValue(errorMessage)
      monaco.editor.setModelLanguage(editor.getModel(), 'python')
      editor.updateOptions({ readOnly: true })
      isPythonMode.value = true
    }
  }
}

// 初始化编辑器
const initEditor = async () => {
  try {
    const monacoInstance = await loader.init()
    setupMonacoTheme(monacoInstance)

    editor = monacoInstance.editor.create(editorContainer.value, {
      value: store.jsonCode, // 默认显示JSON
      language: 'json',
      theme: 'my-theme',
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineHeight: 22,
      renderLineHighlight: 'line',
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8,
        useShadows: false
      },
      padding: { top: 10 },
      readOnly: false // 初始可编辑
    })

    // 仅在JSON模式下监听内容变化
    editor.onDidChangeModelContent(() => {
      if (!isPythonMode.value) {
        store.setJsonCode(editor.getValue())
      }
    })

    window.addEventListener('resize', handleResize)
  } catch (error) {
    console.error('Monaco Editor 初始化失败:', error)
  }
}

const handleResize = () => {
  if (editor) {
    editor.layout()
  }
}

onMounted(async () => {
  await nextTick()
  await initEditor()
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
  }
  window.removeEventListener('resize', handleResize)
})

// 监听store中的jsonCode变化（外部可能修改）
watch(
  () => store.jsonCode,
  (newVal) => {
    if (editor && !isPythonMode.value && newVal !== editor.getValue()) {
      editor.setValue(newVal)
    }
  }
)
</script>

<style scoped>
.monaco-editor-container {
  width: 100%;
}

.editor-wrapper {
  width: 100%;
  flex: 1;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  overflow: hidden;
  min-height: 500px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

<style>
/* Monaco 编辑器全局样式覆盖 */
.monaco-editor .view-overlays .current-line {
  background-color: rgba(209, 213, 219, 0.2) !important;
}

.monaco-editor .margin {
  background-color: #fff !important;
}

.monaco-editor .monaco-editor-background {
  background-color: #fff !important;
}

.monaco-editor .overflow-guard {
  background-color: #f3f4f6 !important;
}

.monaco-scrollable-element > .scrollbar > .slider {
  background: rgba(156, 163, 175, 0.6) !important;
}

.monaco-scrollable-element > .scrollbar {
  background-color: #f3f4f6 !important;
}

.monaco-editor .line-numbers {
  color: #9ca3af !important;
}

/* 只读模式下的样式 */
.monaco-editor.read-only .view-lines {
  cursor: default !important;
}
</style>