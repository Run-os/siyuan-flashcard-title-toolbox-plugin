import {
  Plugin,
} from "siyuan";
import { createApp } from 'vue'
import App from './App.vue'
import { init as initFlashcardTitleEditor, cleanup as cleanupFlashcardTitleEditor } from './features/flashcard-title-editor/index';

let plugin = null
export function usePlugin(pluginProps?: Plugin): Plugin {
  console.log('usePlugin', pluginProps, plugin)
  if (pluginProps) {
    plugin = pluginProps
  }
  if (!plugin && !pluginProps) {
    console.error('need bind plugin')
  }
  return plugin;
}


let app = null;
let appDiv: HTMLDivElement | null = null;

export function init(plugin: Plugin) {
  // bind plugin hook
  usePlugin(plugin);

  appDiv = document.createElement('div');
  appDiv.classList.add('siyuan-flashcard-title-toolbox-plugin-app');
  appDiv.id = 'siyuan-flashcard-title-toolbox-plugin-app';
  app = createApp(App);
  app.mount(appDiv);
  document.body.appendChild(appDiv);

  // 初始化闪卡标题编辑器功能
  initFlashcardTitleEditor(plugin);
}

export function destroy() {
  // 清理闪卡标题编辑器资源
  cleanupFlashcardTitleEditor();

  // 清理 Vue 应用
  if (app) {
    app.unmount();
    app = null;
  }

  // 移除 DOM 元素
  if (appDiv && appDiv.parentNode) {
    appDiv.parentNode.removeChild(appDiv);
    appDiv = null;
  }
}
