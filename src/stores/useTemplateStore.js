import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useTemplateStore = defineStore('template', () => {
  const isTemplateMode = ref(false)
  const selectedTemplateId = ref(null)
  const name = ref('')
  const description = ref('')
  const industry = ref('') // ✅ 所属行业字段
  const shouldMoveCursorToEnd = ref(false)
  let onAppendLineCallback = null


  // ✅ 新增：Python 与 JSON 代码内容
  const pyCode = ref('')
  const jsonCode = ref('')

  function setTemplate(template) {
    isTemplateMode.value = true
    selectedTemplateId.value = template.id
    name.value = template.name
    description.value = template.description
    industry.value = template.industry || '' // ✅ 新增

    // ✅ 初始化代码内容（如模板包含 py/json 字段）
    pyCode.value = template.pyCode || ''
    jsonCode.value = template.jsonCode || ''
  }

  function resetTemplate() {
    isTemplateMode.value = false
    selectedTemplateId.value = null
    name.value = ''
    description.value = ''
    industry.value = '' // ✅ 新增
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
      if (onAppendLineCallback) {
        onAppendLineCallback(line)
      }
  }
  function setShouldMoveCursorToEnd(flag) {
    shouldMoveCursorToEnd.value = flag
  }
  function registerAppendLineHandler(handler) {
    onAppendLineCallback = handler
  }



  return {
    isTemplateMode,
    selectedTemplateId,
    name,
    description,
    industry,
    pyCode,
    jsonCode,
    setTemplate,
    resetTemplate,
    setPyCode,
    setJsonCode,
    appendJsonLine,
    shouldMoveCursorToEnd,
    setShouldMoveCursorToEnd,
    appendJsonLine,
    registerAppendLineHandler
  }
})
