export interface AISettings {
  baseUrl: string
  apiKey: string
  model: string
  prompt: string
}

export interface FlashcardData {
  id: string
  title: string
  content: string
  flashcardTitle?: string
}

export interface HeadingBlock {
  id: string
  type: string
  content: string
  level: number
  hasOwnContent: boolean
  ownContent: string
  children: HeadingBlock[]
}

export interface GenerateTitleRequest {
  content: string
  settings: AISettings
}

export interface GenerateTitleResponse {
  title: string
  error?: string
}

export interface BlockTree {
  id: string
  type: string
  subtype?: string
  content: string
  level: number
  parentID?: string
}
