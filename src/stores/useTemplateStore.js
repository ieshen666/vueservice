import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemplateStore = defineStore('template', () => {
  const isTemplateMode = ref(false)
  const selectedTemplateId = ref(null)
  const name = ref('')
  const description = ref('')

  // ✅ 新增：Python 与 JSON 代码内容
  const pyCode = ref('')
  const jsonCode = ref('')

  function setTemplate(template) {
    isTemplateMode.value = true
    selectedTemplateId.value = template.id
    name.value = template.name
    description.value = template.description

    // ✅ 初始化代码内容（如模板包含 py/json 字段）
    pyCode.value = template.pyCode || ''
    jsonCode.value = template.jsonCode || ''
  }

  function resetTemplate() {
    isTemplateMode.value = false
    selectedTemplateId.value = null
    name.value = ''
    description.value = ''
    pyCode.value = ''
    jsonCode.value = ''
  }

  // ✅ 新增：更新代码的方法（可以用作后续保存接口触发）
  function setPyCode(code) {
    pyCode.value = code
  }

  function setJsonCode(code) {
    jsonCode.value = code
  }
  function appendJsonLine(line) {
    jsonCode.value += line + '\n'
  }


  return {
    isTemplateMode,
    selectedTemplateId,
    name,
    description,
    pyCode,
    jsonCode,
    setTemplate,
    resetTemplate,
    setPyCode,
    setJsonCode,
    appendJsonLine
  }
})
