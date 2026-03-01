import { HeadingBlock, FlashcardData } from "../types/flashcard"
import { getChildBlocks, getBlockByID, updateBlock, setBlockAttrs, sql } from "../api"

export class FlashcardService {
  async getHeadingTree(rootId: string): Promise<HeadingBlock[]> {
    const allBlocks = await getChildBlocks(rootId)
    const headings: HeadingBlock[] = []

    for (const block of allBlocks) {
      if (block.type === "NodeHeading") {
        const level = parseInt(block.subtype?.replace("h", "") || "1", 10)
        const headingBlock = await getBlockByID(block.id)
        
        const children = await this.getHeadingTree(block.id)
        const { hasOwnContent, ownContent } = await this.getOwnContent(block.id, children.map(c => c.id))

        headings.push({
          id: block.id,
          type: block.type,
          content: headingBlock.content,
          level,
          hasOwnContent,
          ownContent,
          children
        })
      }
    }

    return headings
  }

  private async getOwnContent(headingId: string, childIds: string[]): Promise<{ hasOwnContent: boolean; ownContent: string }> {
    const allBlocks = await getChildBlocks(headingId)
    const childHeadingIds = new Set(childIds)

    const ownContentBlocks = allBlocks.filter(
      block => block.type !== "NodeHeading" && !childHeadingIds.has(block.id)
    )

    if (ownContentBlocks.length === 0) {
      return { hasOwnContent: false, ownContent: "" }
    }

    const contentParts: string[] = []
    for (const block of ownContentBlocks) {
      const blockData = await getBlockByID(block.id)
      contentParts.push(blockData.content || blockData.markdown || "")
    }

    return {
      hasOwnContent: true,
      ownContent: contentParts.join("\n\n")
    }
  }

  async generateFlashcards(rootId: string): Promise<string[]> {
    const headingTree = await this.getHeadingTree(rootId)
    const createdCardIds: string[] = []

    for (const heading of headingTree) {
      const cardId = await this.createFlashcard(heading)
      if (cardId) {
        createdCardIds.push(cardId)
      }

      for (const child of heading.children) {
        if (child.hasOwnContent) {
          const childCardId = await this.createFlashcard(child)
          if (childCardId) {
            createdCardIds.push(childCardId)
          }
        }
      }
    }

    return createdCardIds
  }

  private async createFlashcard(heading: HeadingBlock): Promise<string | null> {
    if (!heading.hasOwnContent) {
      return null
    }

    const superBlockContent = `{{{row
${heading.content}
${heading.ownContent}
}}}`

    const kramdown = await this.getBlockKramdown(heading.id)
    const markdown = `${heading.content}\n\n${heading.ownContent}\n\n${superBlockContent}`

    await updateBlock("markdown", markdown, heading.id)

    await setBlockAttrs(heading.id, {
      "custom-riff-decks": "1",
      "flashcard-title": heading.content
    })

    return heading.id
  }

  private async getBlockKramdown(id: string): Promise<string> {
    const result = await sql(`SELECT content FROM blocks WHERE id = '${id}'`)
    return result[0]?.content || ""
  }

  async getAllFlashcards(docId: string): Promise<FlashcardData[]> {
    const result = await sql(`
      SELECT id, content 
      FROM blocks 
      WHERE root_id = '${docId}' 
      AND type = 'NodeHeading' 
      AND content LIKE '%{{{row%'
    `)

    const flashcards: FlashcardData[] = []
    for (const block of result) {
      const attrs = await this.getBlockAttrs(block.id)
      flashcards.push({
        id: block.id,
        title: block.content,
        content: block.content,
        flashcardTitle: attrs["flashcard-title"]
      })
    }

    return flashcards
  }

  private async getBlockAttrs(id: string): Promise<{ [key: string]: string }> {
    const result = await sql(`SELECT * FROM attributes WHERE block_id = '${id}'`)
    const attrs: { [key: string]: string } = {}
    for (const attr of result) {
      attrs[attr.name] = attr.value
    }
    return attrs
  }

  async updateFlashcardTitle(blockId: string, newTitle: string): Promise<boolean> {
    try {
      await setBlockAttrs(blockId, {
        "flashcard-title": newTitle
      })
      return true
    } catch (error) {
      console.error("Error updating flashcard title:", error)
      return false
    }
  }
}
