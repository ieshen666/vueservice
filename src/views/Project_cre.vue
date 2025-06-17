<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <Topbar />

    <!-- 主内容区 -->
    <main class="flex-1 overflow-auto p-8">
      <!-- 上部编辑区，左右分屏 -->
      <section class="flex gap-8 mb-8">
        <div class="flex-1 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">拓扑描述</h2>
          <TopoDescribe />
        </div>
        <div class="flex-1 bg-white rounded-lg shadow p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-700">编辑器</h2>
          <Editor />
        </div>
      </section>

      <!-- 下部图片和节点列表 -->
      <section class="mb-8 bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">拓扑图像</h2>
        <TopoImage />
      </section>

      <section class="bg-white rounded-lg shadow p-6 overflow-auto max-h-[300px]">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">节点列表</h2>
        <NodeList />
      </section>

    </main>

    <!-- 页脚 -->
    <Footer />
  </div>
</template>

<script setup>
import Topbar from '../components/createproject/Topbar.vue'
import TopoDescribe from '../components/createproject/TopoDescribe.vue'
import Editor from '../components/createproject/Editor.vue'
import TopoImage from '../components/createproject/TopoImage.vue'
import NodeList from '../components/createproject/NodeList.vue'
import Footer from '../components/createproject/Footer.vue'
</script>
