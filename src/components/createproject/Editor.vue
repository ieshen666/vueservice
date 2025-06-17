<!-- Editor.vue -->
<template>
  <div ref="editorContainer" class="editor-wrapper"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as monaco from 'monaco-editor'

const editorContainer = ref(null)
let editor = null

onMounted(() => {
  editor = monaco.editor.create(editorContainer.value, {
    value: '# 在这里写代码……',
    language: 'yaml',
    automaticLayout: true,
    // 保留行高亮和滚动条
    renderLineHighlight: 'line', // 'line' | 'all' | 'none'
    scrollbar: {
      vertical: 'auto',  // 'auto' | 'visible' | 'hidden'
      horizontal: 'auto',
      useShadows: true,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8
    },
    // 优化滚动条样式
    overviewRulerBorder: false,
    overviewRulerLanes: 3
  })
  
  // 可选：自定义滚动条颜色
  monaco.editor.defineTheme('my-theme', {
    base: 'vs',
    inherit: true,
    rules: [],
    colors: {
      'scrollbar.shadow': '#e5e7eb', // 滚动条阴影颜色
      'editorOverviewRuler.border': '#e5e7eb' // 右侧滚动条边框
    }
  })
  monaco.editor.setTheme('my-theme')
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<style>
.editor-wrapper {
  width: 100%;
  height: 650px;
  border: 1px solid #e5e7eb; /* 浅灰色边框 */
  border-radius: 6px;
  overflow: hidden;
}

/* 保留行高亮但修改颜色 */
.editor-wrapper :deep(.monaco-editor .view-overlays .current-line) {
  border: none !important;
  background-color: rgba(209, 213, 219, 0.2) !important; /* 浅灰色高亮 */
}

/* 滚动条样式覆盖 */
.editor-wrapper :deep(.monaco-scrollable-element > .scrollbar) {
  background-color: #f3f4f6 !important;
}
.editor-wrapper :deep(.monaco-scrollable-element > .scrollbar > .slider) {
  background: #d1d5db !important;
}
</style>