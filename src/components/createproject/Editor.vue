

<template>
  <div>
    <!-- 切换按钮 -->
    <div class="flex justify-end mb-2">
      <button
        @click="switchFile"
        class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-all duration-300"
      >
        切换为 {{ currentType === 'py' ? 'JSON' : 'Python' }}
      </button>
    </div>

    <!-- 编辑器容器，固定高度并淡入动画 -->
    <transition name="fade">
      <div
        ref="editorContainer"
        class="editor-wrapper"
        key="editor"
      ></div>
    </transition>
  </div>
</template>

<script setup>
import '@/utils/monaco-editor-setup'

import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import { useTemplateStore } from '@/stores/useTemplateStore'

const editorContainer = ref(null)
let editor = null
const store = useTemplateStore()

const currentType = ref('py')

// 双向绑定的值
const pyCode = ref(store.pyCode)
const jsonCode = ref(store.jsonCode)

function jsonToPython(json) {
  // TODO: 实现 JSON 转 Python 字符串的核心逻辑
  return "# python code generated from JSON\n"
}
function pythonToJson(pythonCode) {
  // TODO: 实现 Python 字符串转 JSON 对象的核心逻辑
  return {}
}

const createEditor = (value, language) => {
  if (editor) editor.dispose()

  editor = monaco.editor.create(editorContainer.value, {
    value,
    language,
    automaticLayout: true,
    renderLineHighlight: 'line',
    scrollbar: {
      vertical: 'auto',
      horizontal: 'auto',
      useShadows: true,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    overviewRulerBorder: false
  })

  // 手动设置尺寸，防止切换后渲染出错
  setTimeout(() => {
    editor.layout()
  }, 0)

  monaco.editor.defineTheme('my-theme', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'scrollbar.shadow': '#e5e7eb',
      'editorOverviewRuler.border': '#e5e7eb'
    }
  })
  monaco.editor.setTheme('my-theme')

  editor.onDidChangeModelContent(() => {
    const value = editor.getValue()

    if (currentType.value === 'py') {
      pyCode.value = value
      store.setPyCode(value)

      try {
        const jsonObj = pythonToJson(value)
        const jsonStr = JSON.stringify(jsonObj, null, 2)
        if (jsonStr !== jsonCode.value) {
          jsonCode.value = jsonStr
          store.setJsonCode(jsonStr)
        }
      } catch (e) {
        console.warn('Python to JSON 转换失败:', e)
      }
    } else {
      jsonCode.value = value
      store.setJsonCode(value)

      try {
        const jsonObj = JSON.parse(value)
        const pyStr = jsonToPython(jsonObj)
        if (pyStr !== pyCode.value) {
          pyCode.value = pyStr
          store.setPyCode(pyStr)
        }
      } catch (e) {
        console.warn('JSON to Python 转换失败:', e)
      }
    }
  })
}

onMounted(() => {
  createEditor(
    currentType.value === 'py' ? pyCode.value : jsonCode.value,
    currentType.value === 'py' ? 'python' : 'json'
  )
})

const switchFile = async () => {
  currentType.value = currentType.value === 'py' ? 'json' : 'py'
  await nextTick()
  createEditor(
    currentType.value === 'py' ? pyCode.value : jsonCode.value,
    currentType.value === 'py' ? 'python' : 'json'
  )
}

watch(
  () => (currentType.value === 'py' ? store.pyCode : store.jsonCode),
  (newCode) => {
    if (editor && newCode !== editor.getValue()) {
      editor.setValue(newCode)
    }
  }
)

onUnmounted(() => {
  editor?.dispose()
})
</script>

<style>
.editor-wrapper {
  width: 100%;
  height: 650px;
  min-height: 650px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

/* 淡入淡出动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Monaco 样式微调 */
.editor-wrapper :deep(.monaco-editor .view-overlays .current-line) {
  border: none !important;
  background-color: rgba(209, 213, 219, 0.2) !important;
}
.editor-wrapper :deep(.monaco-scrollable-element > .scrollbar) {
  background-color: #f3f4f6 !important;
}
.editor-wrapper :deep(.monaco-scrollable-element > .scrollbar > .slider) {
  background: #d1d5db !important;
}
</style>
