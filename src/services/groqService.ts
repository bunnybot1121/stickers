import { Category, Sticker, Order } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.3-70b-versatile';

export class GroqService {
  private getApiKey(): string {
    return (
      import.meta.env.VITE_GROQ_API_KEY ||
      localStorage.getItem('sticker_verse_groq_key') ||
      ''
    );
  }

  public isAvailable(): boolean {
    const key = this.getApiKey();
    return Boolean(key && key.startsWith('gsk_'));
  }

  public setApiKey(key: string) {
    localStorage.setItem('sticker_verse_groq_key', key.trim());
  }

  private async callGroq(messages: { role: string; content: string }[], jsonMode = true): Promise<any> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('Groq API key is not configured. Please add VITE_GROQ_API_KEY to .env or settings.');
    }

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: DEFAULT_MODEL,
        messages,
        temperature: 0.2,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Groq API Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '{}';
    return jsonMode ? JSON.parse(content) : content;
  }

  /**
   * 1. AI Bulk Dump: Parses unstructured text into categorized, styled stickers
   */
  async parseAndDumpStickers(
    rawText: string,
    existingCategories: Category[]
  ): Promise<Partial<Sticker>[]> {
    const categorySlugs = existingCategories.map((c) => c.slug);

    const prompt = `You are an expert sticker catalogue curator and product designer for 'STICKERZ'.
The store owner pasted raw unstructured text containing sticker ideas, names, or inventory dumps.
Your job is to parse each sticker idea, generate clean title, catchy description, style, and match with the closest category slug from the available list:
Available Category Slugs: ${JSON.stringify(categorySlugs)}

Valid styles: ['Kawaii', 'Neo-Brutal', 'Pixel Art', 'Holographic', 'Retro']

Raw input text:
"""
${rawText}
"""

Output JSON object in this exact schema:
{
  "stickers": [
    {
      "name": "string (Catchy Title)",
      "slug": "string (kebab-case)",
      "description": "string (1-2 sentences)",
      "categorySlug": "string (one from available category slugs)",
      "style": "Kawaii | Neo-Brutal | Pixel Art | Holographic | Retro",
      "price": 3.50,
      "stock_on_hand": 50,
      "is_featured": false
    }
  ]
}`;

    const res = await this.callGroq([
      { role: 'system', content: 'You are a sticker e-commerce catalogue assistant that outputs valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    return res.stickers || [];
  }

  /**
   * 2. AI Print & Batch Optimizer:
   * Analyzes unallocated orders and groups them into optimal print production batches.
   */
  async optimizePrintBatches(
    eligibleOrders: Order[]
  ): Promise<{
    strategySummary: string;
    recommendedBatches: {
      batchName: string;
      orderIds: string[];
      notes: string;
      priority: 'high' | 'medium' | 'normal';
      designCountEstimate: number;
    }[];
  }> {
    const simplifiedOrders = eligibleOrders.map((o) => ({
      orderId: o.id,
      orderNumber: o.order_number,
      customerName: o.customer_name,
      status: o.status,
      items: o.items?.map((i) => ({
        stickerId: i.sticker_id,
        stickerName: i.sticker_name_snapshot,
        qty: i.quantity,
        role: i.item_role,
      })),
    }));

    const prompt = `You are a print production coordinator for a sticker business.
Analyze these customer orders awaiting printing and group them into optimal production batches to minimize setup and maximize turnaround time.

Orders:
${JSON.stringify(simplifiedOrders, null, 2)}

Output JSON:
{
  "strategySummary": "Short explanation of the grouping strategy (e.g. grouped by shared popular designs, customer deadlines, or high demand)",
  "recommendedBatches": [
    {
      "batchName": "e.g. Batch 1 - High Volume Tech & Dev Run",
      "orderIds": ["orderId1", "orderId2"],
      "notes": "Advice for print operator (e.g. laminate with matte finish)",
      "priority": "high",
      "designCountEstimate": 12
    }
  ]
}`;

    const res = await this.callGroq([
      { role: 'system', content: 'You are an industrial print operations optimizer that outputs valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    return res;
  }

  /**
   * 3. AI Vibe Pack Curator:
   * Recommends a 10 base + 2 bonus pack based on customer's natural prompt.
   */
  async curatePackByVibe(
    vibePrompt: string,
    availableStickers: Sticker[]
  ): Promise<{
    headline: string;
    reasoning: string;
    baseStickerIds: string[];
    bonusStickerIds: string[];
  }> {
    const compactCatalog = availableStickers.map((s) => ({
      id: s.id,
      name: s.name,
      style: s.style,
      description: s.description,
      categories: s.categories?.map((c) => c.name),
    }));

    const prompt = `The user wants a customized 10 + 2 sticker pack (exactly 10 base stickers and 2 bonus stickers) for the vibe: "${vibePrompt}".
Select exactly 10 distinct base sticker IDs and 2 distinct bonus sticker IDs from this catalogue.

Catalogue:
${JSON.stringify(compactCatalog)}

Return JSON:
{
  "headline": "A fun short title for this curated pack (e.g. The Midnight Coder Pack)",
  "reasoning": "Short 1-2 sentence message why these stickers fit the vibe",
  "baseStickerIds": ["id1", "id2", "id3", "id4", "id5", "id6", "id7", "id8", "id9", "id10"],
  "bonusStickerIds": ["id11", "id12"]
}`;

    const res = await this.callGroq([
      { role: 'system', content: 'You are a playful aesthetic sticker stylist that outputs valid JSON.' },
      { role: 'user', content: prompt },
    ]);

    return res;
  }
}

export const groqService = new GroqService();
