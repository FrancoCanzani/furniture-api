import sharp from 'sharp';

export async function compressImage(buffer: Buffer) {
  try {
    const compressedImageBuffer = await sharp(buffer)
      .webp({
        quality: 80,
        lossless: true, // use lossless compression mode
        smartSubsample: true, // use high quality chroma subsampling
      })
      .resize({
        width: 1200, // Max width
        height: 1200, // Max height
        fit: 'inside', // Maintain aspect ratio
        withoutEnlargement: true, // Don't upscale smaller images
      })
      .toBuffer();

    return compressedImageBuffer;
  } catch (error) {
    console.error('Image compression failed:', error);
    throw error;
  }
}
