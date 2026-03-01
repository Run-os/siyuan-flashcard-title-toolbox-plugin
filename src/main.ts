import {
  Plugin,
} from "siyuan";
import { createApp } from 'vue'
import App from './App.vue'
import { AIService } from './services/ai'
import { FlashcardService } from './services/flashcard'
import FlashcardSettings from './components/FlashcardSettings.vue'

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


let app = null
export function init(plugin: Plugin) {
  // bind plugin hook
  usePlugin(plugin);

  const div = document.createElement('div')
  div.classList.toggle('plugin-sample-vite-vue-app')
  div.id = this.name
  app = createApp(App)
  app.mount(div)
  document.body.appendChild(div)

  // Initialize services
  window._sy_plugin_sample = {
    aiService: new AIService(),
    flashcardService: new FlashcardService(),
    plugin,
    saveSettings: async (settings: any) => {
      await plugin.saveData('ai-settings', settings)
    },
    loadSettings: async () => {
      return await plugin.loadData('ai-settings')
    }
  }

  // Setup settings panel
  const settingsDiv = document.createElement('div')
  settingsDiv.id = 'flashcard-settings-container'
  plugin.setting.addItem({
    title: plugin.i18n.aiSettings || 'AI Settings',
    description: plugin.i18n.aiSettingsDesc || 'Configure AI service for flashcard title generation',
    createActionElement: () => {
      if (!settingsDiv.hasChildNodes()) {
        const settingsApp = createApp(FlashcardSettings)
        settingsApp.mount(settingsDiv)
      }
      return settingsDiv
    }
  })

  // Register event listener for flashcard actions
  plugin.eventBus.on('click-flashcard-action', async (data: any) => {
    if (data.action === 'generate-title') {
      await handleGenerateTitleForCard(data.blockId)
    }
  })

  // Add toolbar button
  plugin.addTopBar({
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    title: plugin.i18n.generateAllTitles || 'Generate All Flashcard Titles',
    callback: () => handleGenerateAllTitles(),
    position: 'right'
  })

  // Add command for generating flashcards from headings
  plugin.addCommand({
    langCmds: {
      'zh_CN': '从标题生成闪卡',
      'en_US': 'Generate Flashcards from Headings'
    },
    callback: async () => {
      await handleGenerateFlashcards()
    }
  })

  // Add command for generating single card title
  plugin.addCommand({
    langCmds: {
      'zh_CN': 'AI 生成当前闪卡标题',
      'en_US': 'AI Generate Current Flashcard Title'
    },
    callback: async () => {
      await handleGenerateTitleForCurrentCard()
    }
  })
}

export function destroy() {
  app.unmount()
  const div = document.getElementById(this.name)
  if (div) {
    document.body.removeChild(div)
  }
}

async function handleGenerateFlashcards() {
  try {
    const { queryBlock } = await import('siyuan')
    const activeBlock = await queryBlock()
    if (!activeBlock) {
      plugin.showMessage(plugin.i18n.noActiveBlock || 'No active block selected')
      return
    }

    const rootId = activeBlock.root_id
    const cardIds = await window._sy_plugin_sample.flashcardService.generateFlashcards(rootId)
    plugin.showMessage(plugin.i18n.generatedCards || `Generated ${cardIds.length} flashcards`)
  } catch (error) {
    console.error('Error generating flashcards:', error)
    plugin.showMessage(plugin.i18n.generateError || 'Error generating flashcards', 5000, 'error')
  }
}

async function handleGenerateAllTitles() {
  try {
    const { queryBlock } = await import('siyuan')
    const activeBlock = await queryBlock()
    if (!activeBlock) {
      plugin.showMessage(plugin.i18n.noActiveBlock || 'No active block selected')
      return
    }

    const rootId = activeBlock.root_id
    const flashcards = await window._sy_plugin_sample.flashcardService.getAllFlashcards(rootId)
    const settings = await window._sy_plugin_sample.loadSettings()

    if (!settings || !settings.apiKey) {
      plugin.showMessage(plugin.i18n.noAISettings || 'Please configure AI settings first', 5000, 'error')
      return
    }

    let successCount = 0
    for (const card of flashcards) {
      const result = await window._sy_plugin_sample.aiService.generateFlashcardTitle(
        card.content,
        settings
      )
      if (result.title) {
        await window._sy_plugin_sample.flashcardService.updateFlashcardTitle(card.id, result.title)
        successCount++
      }
    }

    plugin.showMessage(
      plugin.i18n.titlesGenerated || `Generated ${successCount}/${flashcards.length} titles`
    )
  } catch (error) {
    console.error('Error generating all titles:', error)
    plugin.showMessage(plugin.i18n.generateError || 'Error generating titles', 5000, 'error')
  }
}

async function handleGenerateTitleForCurrentCard() {
  try {
    const { queryBlock } = await import('siyuan')
    const activeBlock = await queryBlock()
    if (!activeBlock) {
      plugin.showMessage(plugin.i18n.noActiveBlock || 'No active block selected')
      return
    }

    await handleGenerateTitleForCard(activeBlock.id)
  } catch (error) {
    console.error('Error generating title:', error)
    plugin.showMessage(plugin.i18n.generateError || 'Error generating title', 5000, 'error')
  }
}

async function handleGenerateTitleForCard(blockId: string) {
  try {
    const settings = await window._sy_plugin_sample.loadSettings()
    if (!settings || !settings.apiKey) {
      plugin.showMessage(plugin.i18n.noAISettings || 'Please configure AI settings first', 5000, 'error')
      return
    }

    const { sql } = await import('siyuan')
    const blocks = await sql(`SELECT id, content FROM blocks WHERE id = '${blockId}'`)
    if (blocks.length === 0) {
      plugin.showMessage(plugin.i18n.blockNotFound || 'Block not found', 5000, 'error')
      return
    }

    const block = blocks[0]
    const result = await window._sy_plugin_sample.aiService.generateFlashcardTitle(
      block.content,
      settings
    )

    if (result.title) {
      await window._sy_plugin_sample.flashcardService.updateFlashcardTitle(blockId, result.title)
      plugin.showMessage(plugin.i18n.titleGenerated || 'Title generated successfully')
    } else {
      plugin.showMessage(
        result.error || plugin.i18n.generateError || 'Error generating title',
        5000,
        'error'
      )
    }
  } catch (error) {
    console.error('Error generating title for card:', error)
    plugin.showMessage(plugin.i18n.generateError || 'Error generating title', 5000, 'error')
  }
}
