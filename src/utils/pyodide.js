// src/utils/pyodide.js
let pyodide = null

export async function initPyodideIfNeeded() {
  if (!pyodide) {
    pyodide = await window.loadPyodide()
  }
  return pyodide
}

export async function loadConvertScript(scriptText) {
  const pyodide = await initPyodideIfNeeded()
  pyodide.runPython(scriptText)
}

export async function convertJsonToPy(jsonStr) {
  const pyodide = await initPyodideIfNeeded()
  pyodide.globals.set('json_input', jsonStr)

  try {
    const result = pyodide.runPython(`
from convertJsonToPy import convert
convert(json_input)
    `)
    return result
  } catch (e) {
    return '# 转换失败: ' + e
  }
}
