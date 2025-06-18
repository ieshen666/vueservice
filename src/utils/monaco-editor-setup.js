// src/utils/monaco-editor-setup.js
self.MonacoEnvironment = {
  getWorker: function (_, label) {
    if (label === 'json') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/json/json.worker?worker', import.meta.url),
        { type: 'module' }
      )
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/css/css.worker?worker', import.meta.url),
        { type: 'module' }
      )
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/html/html.worker?worker', import.meta.url),
        { type: 'module' }
      )
    }
    if (label === 'typescript' || label === 'javascript') {
      return new Worker(
        new URL('monaco-editor/esm/vs/language/typescript/ts.worker?worker', import.meta.url),
        { type: 'module' }
      )
    }
    // 默认是编辑器工作线程
    return new Worker(
      new URL('monaco-editor/esm/vs/editor/editor.worker?worker', import.meta.url),
      { type: 'module' }
    )
  }
}
