import sharp from 'sharp';

export async function compressImage(buffer: Buffer) {
  try {
    const compressedImageBuffer = await sharp(buffer)
      .jpeg({
        quality: 80, // Lower = smaller file, reduced quality
        mozjpeg: true, // Use mozjpeg for better compression
        chromaSubsampling: '4:4:4', // Better quality for text/sharp edges
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
