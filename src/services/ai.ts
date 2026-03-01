import { AISettings, GenerateTitleResponse } from "../types/flashcard"

export class AIService {
  async generateFlashcardTitle(content: string, settings: AISettings): Promise<GenerateTitleResponse> {
    if (!settings.apiKey || !settings.baseUrl || !settings.model) {
      throw new Error("AI settings are incomplete")
    }

    const prompt = settings.prompt || "请根据以下内容生成一个适合作为闪卡正面的问题，要求简洁明了：\n\n{content}"

    const finalPrompt = prompt.replace("{content}", content)

    try {
      const response = await fetch(`${settings.baseUrl}/v1/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${settings.apiKey}`
        },
        body: JSON.stringify({
          model: settings.model,
          messages: [
            {
              role: "user",
              content: finalPrompt
            }
          ],
          temperature: 0.7,
          max_tokens: 200
        })
      })

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`)
      }

      const data = await response.json()
      const title = data.choices?.[0]?.message?.content?.trim() || ""

      if (!title) {
        throw new Error("Empty response from AI")
      }

      return { title }
    } catch (error) {
      console.error("Error generating flashcard title:", error)
      return {
        title: "",
        error: error instanceof Error ? error.message : "Unknown error"
      }
    }
  }

  async testConnection(settings: AISettings): Promise<boolean> {
    try {
      const response = await fetch(`${settings.baseUrl}/v1/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${settings.apiKey}`
        }
      })
      return response.ok
    } catch {
      return false
    }
  }
}
