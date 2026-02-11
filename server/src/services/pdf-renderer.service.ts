import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

interface RenderOptions {
  format?: "png" | "jpg" | "webp" | "avif" | "bmp" | "tiff" | "tga" | "ico";
  quality?: number;
  scale?: number;
  background?: string;
}

// Check if we're in a serverless environment
const isServerless = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME;

/**
 * Render PDF pages to images
 * Note: Full PDF rendering requires canvas which doesn't work in serverless.
 * This is a fallback that creates placeholder images.
 */
export async function renderPdfToImages(
  pdfBuffer: Buffer,
  options: RenderOptions = {}
): Promise<Buffer[]> {
  const {
    format = "png",
    quality = 90,
    scale = 2.0,
  } = options;

  // In serverless, we can't use canvas/pdfjs, so return a placeholder
  if (isServerless) {
    console.warn("PDF rendering with canvas is not supported in serverless environment");
    
    // Get page count to create correct number of placeholders
    const pdf = await PDFDocument.load(pdfBuffer);
    const pageCount = pdf.getPageCount();
    
    // Create placeholder images
    const images: Buffer[] = [];
    for (let i = 0; i < pageCount; i++) {
      const placeholder = await sharp({
        create: {
          width: 612 * 2,
          height: 792 * 2,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .png()
        .toBuffer();
      
      images.push(placeholder);
    }
    
    return images;
  }

  // Local development with canvas support
  try {
    // Dynamically import canvas and pdfjs only in local environment
    const { createCanvas } = await import("canvas");
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    // Load PDF document
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      verbosity: 0,
    });

    const pdfDoc = await loadingTask.promise;
    const numPages = pdfDoc.numPages;
    const images: Buffer[] = [];

    // Render each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdfDoc.getPage(pageNum);
      const viewport = page.getViewport({ scale });

      // Create canvas
      const canvas = createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext("2d");

      // Render page to canvas
      await page.render({
        canvasContext: context as any,
        viewport: viewport,
        canvas: canvas as any,
      }).promise;

      // Convert canvas to image buffer
      let imageBuffer: Buffer;

      if (format === "png") {
        imageBuffer = canvas.toBuffer("image/png");
      } else if (format === "jpg") {
        imageBuffer = canvas.toBuffer("image/jpeg", { quality: quality / 100 });
      } else {
        // For other formats, convert PNG to target format using Sharp
        const pngBuffer = canvas.toBuffer("image/png");
        imageBuffer = await convertImageFormat(pngBuffer, format, quality);
      }

      images.push(imageBuffer);
    }

    return images;
  } catch (error) {
    console.error("PDF rendering error:", error);
    
    // Fallback to placeholder if rendering fails
    const pdf = await PDFDocument.load(pdfBuffer);
    const pageCount = pdf.getPageCount();
    const images: Buffer[] = [];
    
    for (let i = 0; i < pageCount; i++) {
      const placeholder = await sharp({
        create: {
          width: 612 * 2,
          height: 792 * 2,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        }
      })
        .png()
        .toBuffer();
      
      images.push(placeholder);
    }
    
    return images;
  }
}

/**
 * Render single PDF page to image
 */
export async function renderPdfPageToImage(
  pdfBuffer: Buffer,
  pageNumber: number = 1,
  options: RenderOptions = {}
): Promise<Buffer> {
  const {
    format = "png",
    quality = 90,
    scale = 2.0,
  } = options;

  // In serverless, return placeholder
  if (isServerless) {
    console.warn("PDF page rendering is not supported in serverless environment");
    
    const placeholder = await sharp({
      create: {
        width: 612 * 2,
        height: 792 * 2,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .png()
      .toBuffer();
    
    return placeholder;
  }

  try {
    const { createCanvas } = await import("canvas");
    const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(pdfBuffer),
      useSystemFonts: true,
      verbosity: 0,
    });

    const pdfDoc = await loadingTask.promise;
    
    if (pageNumber < 1 || pageNumber > pdfDoc.numPages) {
      throw new Error(`Page ${pageNumber} does not exist`);
    }

    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext("2d");

    await page.render({
      canvasContext: context as any,
      viewport: viewport,
      canvas: canvas as any,
    }).promise;

    let imageBuffer: Buffer;

    if (format === "png") {
      imageBuffer = canvas.toBuffer("image/png");
    } else if (format === "jpg") {
      imageBuffer = canvas.toBuffer("image/jpeg", { quality: quality / 100 });
    } else {
      const pngBuffer = canvas.toBuffer("image/png");
      imageBuffer = await convertImageFormat(pngBuffer, format, quality);
    }

    return imageBuffer;
  } catch (error) {
    console.error("PDF page rendering error:", error);
    
    // Fallback to placeholder
    const placeholder = await sharp({
      create: {
        width: 612 * 2,
        height: 792 * 2,
        channels: 4,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      }
    })
      .png()
      .toBuffer();
    
    return placeholder;
  }
}

/**
 * Convert image to different formats using Sharp
 */
async function convertImageFormat(
  buffer: Buffer,
  format: string,
  quality: number = 90
): Promise<Buffer> {
  let sharpInstance = sharp(buffer);

  switch (format) {
    case "webp":
      return sharpInstance.webp({ quality }).toBuffer();
    case "avif":
      return sharpInstance.avif({ quality }).toBuffer();
    case "bmp":
      return sharpInstance.toFormat("png").toBuffer(); // BMP via PNG
    case "tiff":
      return sharpInstance.tiff({ quality }).toBuffer();
    case "tga":
      // TGA not directly supported, use PNG
      return sharpInstance.png().toBuffer();
    case "ico":
      // Resize to icon size and convert to PNG (browsers support PNG as ICO)
      return sharpInstance.resize(256, 256).png().toBuffer();
    default:
      return sharpInstance.png().toBuffer();
  }
}

/**
 * Get PDF metadata and info
 */
export async function getPdfInfo(pdfBuffer: Buffer) {
  // Use pdf-lib instead of pdfjs for metadata (works in serverless)
  try {
    const { PDFDocument } = await import("pdf-lib");
    const pdf = await PDFDocument.load(pdfBuffer);
    
    return {
      numPages: pdf.getPageCount(),
      metadata: {
        title: pdf.getTitle(),
        author: pdf.getAuthor(),
        subject: pdf.getSubject(),
        creator: pdf.getCreator(),
        producer: pdf.getProducer(),
        creationDate: pdf.getCreationDate(),
        modificationDate: pdf.getModificationDate(),
      },
      fingerprints: [],
    };
  } catch (error) {
    console.error("PDF info error:", error);
    throw new Error("Failed to get PDF info");
  }
}
