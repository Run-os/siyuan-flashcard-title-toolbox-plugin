<template>
  <div class="flashcard-settings">
    <div class="setting-item">
      <div class="setting-label">{{ t('ai.baseUrl') }}</div>
      <input 
        v-model="settings.baseUrl" 
        type="text" 
        :placeholder="t('ai.baseUrlPlaceholder')"
        class="setting-input"
      />
    </div>

    <div class="setting-item">
      <div class="setting-label">{{ t('ai.apiKey') }}</div>
      <input 
        v-model="settings.apiKey" 
        type="password" 
        :placeholder="t('ai.apiKeyPlaceholder')"
        class="setting-input"
      />
    </div>

    <div class="setting-item">
      <div class="setting-label">{{ t('ai.model') }}</div>
      <input 
        v-model="settings.model" 
        type="text" 
        :placeholder="t('ai.modelPlaceholder')"
        class="setting-input"
      />
    </div>

    <div class="setting-item">
      <div class="setting-label">{{ t('ai.prompt') }}</div>
      <textarea 
        v-model="settings.prompt" 
        :placeholder="t('ai.promptPlaceholder')"
        class="setting-textarea"
        rows="6"
      />
      <div class="setting-hint">
        { { t('ai.promptHint') } }
      </div>
    </div>

    <div class="setting-actions">
      <button @click="testConnection" :disabled="testing" class="btn btn-secondary">
        {{ testing ? t('ai.testing') : t('ai.testConnection') }}
      </button>
      <button @click="saveSettings" class="btn btn-primary">
        {{ t('ai.save') }}
      </button>
    </div>

    <div v-if="message" :class="['setting-message', message.type]">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { AIService } from '../services/ai'

const aiService = new AIService()

const settings = reactive({
  baseUrl: '',
  apiKey: '',
  model: '',
  prompt: '请根据以下内容生成一个适合作为闪卡正面的问题，要求简洁明了：\n\n{content}'
})

const testing = ref(false)
const message = ref<{ type: string; text: string } | null>(null)

function t(key: string): string {
  return (window._sy_plugin_sample?.i18n?.[key] || key) as string
}

async function testConnection() {
  testing.value = true
  message.value = null

  try {
    const success = await aiService.testConnection(settings)
    if (success) {
      message.value = { type: 'success', text: t('ai.connectionSuccess') }
    } else {
      message.value = { type: 'error', text: t('ai.connectionFailed') }
    }
  } catch (error) {
    message.value = { type: 'error', text: t('ai.connectionError') }
  } finally {
    testing.value = false
  }
}

async function saveSettings() {
  try {
    await window._sy_plugin_sample.saveSettings(settings)
    message.value = { type: 'success', text: t('ai.saveSuccess') }
  } catch (error) {
    message.value = { type: 'error', text: t('ai.saveFailed') }
  }
}

async function loadSettings() {
  try {
    const saved = await window._sy_plugin_sample.loadSettings()
    if (saved) {
      Object.assign(settings, saved)
    }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

loadSettings()
</script>

<style scoped>
.flashcard-settings {
  padding: 16px;
}

.setting-item {
  margin-bottom: 20px;
}

.setting-label {
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--b3-theme-on-background);
}

.setting-input,
.setting-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--b3-border-color);
  border-radius: 4px;
  background: var(--b3-theme-background);
  color: var(--b3-theme-on-background);
  font-size: 14px;
}

.setting-textarea {
  resize: vertical;
  font-family: inherit;
}

.setting-hint {
  margin-top: 8px;
  font-size: 12px;
  color: var(--b3-theme-on-surface);
  opacity: 0.7;
}

.setting-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary {
  background: var(--b3-theme-primary);
  color: var(--b3-theme-on-primary);
}

.btn-primary:hover {
  background: var(--b3-theme-primary-light);
}

.btn-secondary {
  background: var(--b3-theme-surface);
  color: var(--b3-theme-on-surface);
}

.btn-secondary:hover {
  background: var(--b3-theme-surface-light);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.setting-message {
  margin-top: 16px;
  padding: 12px;
  border-radius: 4px;
  font-size: 14px;
}

.setting-message.success {
  background: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.setting-message.error {
  background: rgba(244, 67, 54, 0.1);
  color: #f44336;
}
</style>
