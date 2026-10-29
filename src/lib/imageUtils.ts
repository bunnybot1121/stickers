/**
 * Utility functions for client-side image processing, optimization, and compression.
 * Ensures uploaded sticker images fit comfortably within browser storage and API payloads.
 */

export interface OptimizedImageResult {
  previewUrl: string;
  name: string;
  size: number;
  originalSize: number;
}

/**
 * Compresses and resizes an uploaded image file on the client side using Canvas.
 * For SVGs, converts to clean data URL directly.
 * For raster images (PNG, JPG, WebP), scales down to max dimensions (default 800x800)
 * and compresses as WebP/JPEG, typically reducing 2-8MB photos to ~40-80KB.
 */
export async function optimizeImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  // If SVG, read directly as data URL or text
  if (file.type === 'image/svg+xml') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) || '');
      reader.onerror = () => reject(new Error(`Failed to read SVG file ${file.name}`));
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to original data URL if 2D context is unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Try WebP first for ultra-lightweight size with alpha transparency, fallback to PNG if transparent or JPEG
        const hasAlpha = file.type === 'image/png';
        const targetMime = hasAlpha ? 'image/png' : 'image/webp';

        try {
          const optimizedDataUrl = canvas.toDataURL(targetMime, quality);
          resolve(optimizedDataUrl);
        } catch {
          resolve(readerEvent.target?.result as string);
        }
      };
      img.onerror = () => reject(new Error(`Failed to decode image ${file.name}`));
      img.src = readerEvent.target?.result as string;
    };
    reader.onerror = () => reject(new Error(`Failed to read file ${file.name}`));
    reader.readAsDataURL(file);
  });
}

/**
 * Cleans a file name into a human-readable title (e.g., "my_cool-sticker.png" -> "My Cool Sticker")
 */
export function formatFileNameToTitle(fileName: string): string {
  const baseName = fileName
    .replace(/\.[^/.]+$/, '') // remove extension
    .replace(/[-_]+/g, ' ') // replace dashes/underscores with space
    .replace(/\b(image|img|screenshot|download|unnamed|sticker|photo|file)\b/gi, '') // clean junk words
    .trim();

  if (!baseName) return 'Custom Sticker';

  return baseName
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
