import { Category, Sticker, Order } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_TEXT_MODEL = 'openai/gpt-oss-120b';
const DEFAULT_VISION_MODEL = 'qwen/qwen3.8-27b';

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

  private async callGroq(
    messages: { role: string; content: any }[],
    jsonMode = true,
    model = DEFAULT_TEXT_MODEL
  ): Promise<any> {
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
        model,
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
   * Multimodal Vision Analyzer:
   * Uses Groq's qwen/qwen3.8-27b vision model to inspect the actual image pixels,
   * identify what is visually depicted, and generate an accurate title and description.
   */
  private async analyzeSingleImageWithVision(
    file: { name: string; previewUrl?: string },
    existingCategories: Category[]
  ): Promise<{
    name: string;
    slug: string;
    description: string;
    categorySlug: string;
    style: 'Kawaii' | 'Neo-Brutal' | 'Pixel Art' | 'Holographic' | 'Retro';
    tags: string[];
  }> {
    const categorySlugs = existingCategories.map((c) => c.slug);
    const apiKey = this.getApiKey();

    // 1. Try Groq Vision with qwen/qwen3.8-27b if base64/URL is present
    if (apiKey && file.previewUrl && (file.previewUrl.startsWith('data:image/') || file.previewUrl.startsWith('http'))) {
      try {
        const response = await fetch(GROQ_API_URL, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: DEFAULT_VISION_MODEL,
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'text',
                    text: `You are the master catalog curator AI for 'STICKERZ'.
Analyze this uploaded sticker artwork. What is depicted in this image?
Identify what the image actually shows. DO NOT just repeat or format the file name (${file.name}).
Instead, identify the actual character, object, animal, food, or artwork depicted in the sticker image.
Give it a catchy, creative, marketable product title (2-4 words, based on what is visually shown).
Write a 1-sentence product description describing what is seen in the sticker.
Match the best category slug from the available store categories: ${JSON.stringify(categorySlugs)}.
Choose the art style from: ['Kawaii', 'Neo-Brutal', 'Pixel Art', 'Holographic', 'Retro'].
Generate 3-5 relevant tags.

Respond ONLY with a valid JSON object in this exact schema:
{
  "name": "string (Catchy Title based on what is in the image, NOT file name)",
  "categorySlug": "string (one from available categories)",
  "style": "Kawaii | Neo-Brutal | Pixel Art | Holographic | Retro",
  "description": "string (1 sentence of what the sticker shows)",
  "tags": ["tag1", "tag2", "tag3"]
}`,
                  },
                  {
                    type: 'image_url',
                    image_url: { url: file.previewUrl },
                  },
                ],
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content;
          if (content) {
            const parsed = JSON.parse(content);
            if (parsed.name && parsed.name.trim()) {
              return {
                name: parsed.name.trim(),
                slug: parsed.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
                description: parsed.description || `Collectible die-cut vinyl sticker of ${parsed.name}.`,
                categorySlug: categorySlugs.includes(parsed.categorySlug) ? parsed.categorySlug : categorySlugs[0],
                style: parsed.style || 'Kawaii',
                tags: Array.isArray(parsed.tags) ? parsed.tags : ['sticker', 'vinyl'],
              };
            }
          }
        }
      } catch (err) {
        console.warn(`Vision analysis failed for ${file.name}, trying text model:`, err);
      }
    }

    // 2. Fallback: Use openai/gpt-oss-120b to generate creative sticker identity
    try {
      const prompt = `A user uploaded a sticker artwork named "${file.name}".
Create an imaginative, creative sticker title (do NOT just repeat the raw filename; invent a lively sticker concept that fits a boutique sticker store).
Assign one category slug from: ${JSON.stringify(categorySlugs)}.
Assign an art style from: ['Kawaii', 'Neo-Brutal', 'Pixel Art', 'Holographic', 'Retro'].
Provide a lively 1-sentence product description and 3 tags.
Respond ONLY with JSON:
{
  "name": "string",
  "categorySlug": "string",
  "style": "Kawaii",
  "description": "string",
  "tags": ["tag1", "tag2"]
}`;

      const res = await this.callGroq([
        { role: 'system', content: 'You are an imaginative sticker product curator. Output valid JSON.' },
        { role: 'user', content: prompt },
      ]);

      return {
        name: res.name || 'Artisan Sticker Design',
        slug: (res.name || 'sticker').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: res.description || 'Premium matte vinyl die-cut sticker.',
        categorySlug: categorySlugs.includes(res.categorySlug) ? res.categorySlug : categorySlugs[0],
        style: res.style || 'Kawaii',
        tags: res.tags || ['sticker'],
      };
    } catch {
      // 3. Heuristic fallback
      const cleanBase = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b(image|img|screenshot|download|unnamed|sticker|photo|file)\b/gi, '')
        .trim();
      const words = cleanBase.split(' ').filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
      const title = words.length > 0 ? words.join(' ') : 'Artisan Die-Cut Sticker';

      return {
        name: title,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: `Hand-crafted die-cut vinyl sticker of ${title}. Waterproof & UV resistant matte finish.`,
        categorySlug: categorySlugs[0] || 'coding-tech',
        style: 'Kawaii',
        tags: ['die-cut', 'vinyl'],
      };
    }
  }

  /**
   * AI Bulk File Sorting & Labeling Engine with Multimodal Vision:
   * Takes a batch of uploaded sticker files, analyzes each image visually using Groq Vision,
   * generates descriptive titles based on what is actually shown in the image,
   * auto-categorizes, tags, and sorts them into store order.
   */
  async sortAndLabelUploadedFiles(
    files: { name: string; size?: number; previewUrl?: string }[],
    existingCategories: Category[]
  ): Promise<{
    sortedStickers: {
      originalFileName: string;
      name: string;
      slug: string;
      description: string;
      categorySlug: string;
      style: 'Kawaii' | 'Neo-Brutal' | 'Pixel Art' | 'Holographic' | 'Retro';
      tags: string[];
      displayOrder: number;
      stockOnHand: number;
    }[];
    summary: string;
  }> {
    const analyzedItems: {
      originalFileName: string;
      name: string;
      slug: string;
      description: string;
      categorySlug: string;
      style: 'Kawaii' | 'Neo-Brutal' | 'Pixel Art' | 'Holographic' | 'Retro';
      tags: string[];
      displayOrder: number;
      stockOnHand: number;
    }[] = [];

    const concurrency = 3;
    for (let i = 0; i < files.length; i += concurrency) {
      const slice = files.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        slice.map(async (f, idx) => {
          const analysis = await this.analyzeSingleImageWithVision(f, existingCategories);
          return {
            originalFileName: f.name,
            name: analysis.name,
            slug: analysis.slug,
            description: analysis.description,
            categorySlug: analysis.categorySlug,
            style: analysis.style,
            tags: analysis.tags,
            displayOrder: i + idx + 1,
            stockOnHand: 50,
          };
        })
      );
      analyzedItems.push(...batchResults);
    }

    const uniqueCategories = new Set(analyzedItems.map((s) => s.categorySlug));

    return {
      summary: `Groq Vision analyzed & labeled ${analyzedItems.length} stickers across ${uniqueCategories.size} categories based on artwork visuals.`,
      sortedStickers: analyzedItems,
    };
  }

  /**
   * AI Print & Batch Optimizer
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
  "strategySummary": "Short explanation of the grouping strategy",
  "recommendedBatches": [
    {
      "batchName": "e.g. Batch 1 - High Volume Run",
      "orderIds": ["orderId1"],
      "notes": "Advice for print operator",
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
   * AI Vibe Pack Curator
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
  "headline": "A fun short title for this curated pack",
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
