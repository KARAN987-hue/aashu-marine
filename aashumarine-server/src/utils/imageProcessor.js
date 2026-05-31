import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

/**
 * Image processing utilities using Sharp
 * Handles compression, format conversion, and optimization
 * 
 * Validates: Requirements 11.4
 */

const MAX_IMAGE_SIZE_KB = 200; // 200KB as per requirement 11.4
const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_KB * 1024;

/**
 * Compress and optimize an image to meet size requirements
 * Converts to WebP format with fallback to original format
 * 
 * @param {string} inputPath - Path to the input image
 * @param {string} outputPath - Path to save the optimized image
 * @param {Object} options - Compression options
 * @returns {Promise<Object>} - Information about the processed image
 */
export async function compressImage(inputPath, options = {}) {
  const {
    maxSizeBytes = MAX_IMAGE_SIZE_BYTES,
    quality = 80,
    convertToWebP = true,
    preserveOriginal = false
  } = options;

  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const metadata = await sharp(inputBuffer).metadata();
    
    // Determine output format
    const outputFormat = convertToWebP ? 'webp' : metadata.format;
    const outputExt = convertToWebP ? '.webp' : path.extname(inputPath);
    const outputPath = inputPath.replace(path.extname(inputPath), outputExt);
    
    // Start with initial quality
    let currentQuality = quality;
    let outputBuffer;
    let attempts = 0;
    const maxAttempts = 10;
    
    // Iteratively reduce quality until size requirement is met
    while (attempts < maxAttempts) {
      const sharpInstance = sharp(inputBuffer);
      
      // Apply format-specific compression
      if (outputFormat === 'webp') {
        sharpInstance.webp({ quality: currentQuality, effort: 6 });
      } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
        sharpInstance.jpeg({ quality: currentQuality, mozjpeg: true });
      } else if (outputFormat === 'png') {
        sharpInstance.png({ 
          quality: currentQuality, 
          compressionLevel: 9,
          adaptiveFiltering: true
        });
      }
      
      outputBuffer = await sharpInstance.toBuffer();
      
      // Check if size requirement is met
      if (outputBuffer.length <= maxSizeBytes) {
        break;
      }
      
      // Reduce quality for next attempt
      currentQuality = Math.max(10, currentQuality - 10);
      attempts++;
    }
    
    // If still too large, resize the image
    if (outputBuffer.length > maxSizeBytes) {
      const scaleFactor = Math.sqrt(maxSizeBytes / outputBuffer.length);
      const newWidth = Math.floor(metadata.width * scaleFactor);
      const newHeight = Math.floor(metadata.height * scaleFactor);
      
      const sharpInstance = sharp(inputBuffer)
        .resize(newWidth, newHeight, {
          fit: 'inside',
          withoutEnlargement: true
        });
      
      if (outputFormat === 'webp') {
        sharpInstance.webp({ quality: 75, effort: 6 });
      } else if (outputFormat === 'jpeg' || outputFormat === 'jpg') {
        sharpInstance.jpeg({ quality: 75, mozjpeg: true });
      } else if (outputFormat === 'png') {
        sharpInstance.png({ quality: 75, compressionLevel: 9 });
      }
      
      outputBuffer = await sharpInstance.toBuffer();
    }
    
    // Save the optimized image
    fs.writeFileSync(outputPath, outputBuffer);
    
    // Remove original if not preserving
    if (!preserveOriginal && outputPath !== inputPath) {
      fs.unlinkSync(inputPath);
    }
    
    const finalMetadata = await sharp(outputBuffer).metadata();
    
    return {
      success: true,
      originalPath: inputPath,
      outputPath: outputPath,
      originalSize: inputBuffer.length,
      optimizedSize: outputBuffer.length,
      compressionRatio: ((1 - outputBuffer.length / inputBuffer.length) * 100).toFixed(2),
      format: finalMetadata.format,
      width: finalMetadata.width,
      height: finalMetadata.height,
      quality: currentQuality
    };
  } catch (error) {
    console.error('Image compression error:', error);
    throw new Error(`Failed to compress image: ${error.message}`);
  }
}

/**
 * Process multiple images in parallel
 * 
 * @param {Array<string>} imagePaths - Array of image paths to process
 * @param {Object} options - Compression options
 * @returns {Promise<Array<Object>>} - Array of processing results
 */
export async function compressMultipleImages(imagePaths, options = {}) {
  const results = await Promise.allSettled(
    imagePaths.map(imagePath => compressImage(imagePath, options))
  );
  
  return results.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        success: false,
        originalPath: imagePaths[index],
        error: result.reason.message
      };
    }
  });
}

/**
 * Create a WebP version with JPEG/PNG fallback
 * Saves both formats for browser compatibility
 * 
 * @param {string} inputPath - Path to the input image
 * @returns {Promise<Object>} - Paths to both versions
 */
export async function createWebPWithFallback(inputPath) {
  try {
    const inputBuffer = fs.readFileSync(inputPath);
    const metadata = await sharp(inputBuffer).metadata();
    const basePath = inputPath.replace(path.extname(inputPath), '');
    
    // Create WebP version
    const webpResult = await compressImage(inputPath, {
      convertToWebP: true,
      preserveOriginal: true
    });
    
    // Create fallback version (JPEG for photos, PNG for graphics)
    const fallbackFormat = metadata.format === 'png' ? 'png' : 'jpeg';
    const fallbackPath = `${basePath}.${fallbackFormat === 'jpeg' ? 'jpg' : 'png'}`;
    
    const sharpInstance = sharp(inputBuffer);
    
    if (fallbackFormat === 'jpeg') {
      sharpInstance.jpeg({ quality: 80, mozjpeg: true });
    } else {
      sharpInstance.png({ quality: 80, compressionLevel: 9 });
    }
    
    const fallbackBuffer = await sharpInstance.toBuffer();
    
    // Compress fallback if needed
    if (fallbackBuffer.length > MAX_IMAGE_SIZE_BYTES) {
      fs.writeFileSync(fallbackPath, fallbackBuffer);
      const fallbackResult = await compressImage(fallbackPath, {
        convertToWebP: false,
        preserveOriginal: false
      });
      
      return {
        success: true,
        webp: webpResult.outputPath,
        fallback: fallbackResult.outputPath,
        webpSize: webpResult.optimizedSize,
        fallbackSize: fallbackResult.optimizedSize
      };
    } else {
      fs.writeFileSync(fallbackPath, fallbackBuffer);
      
      return {
        success: true,
        webp: webpResult.outputPath,
        fallback: fallbackPath,
        webpSize: webpResult.optimizedSize,
        fallbackSize: fallbackBuffer.length
      };
    }
  } catch (error) {
    console.error('WebP conversion error:', error);
    throw new Error(`Failed to create WebP with fallback: ${error.message}`);
  }
}

/**
 * Get image information without processing
 * 
 * @param {string} imagePath - Path to the image
 * @returns {Promise<Object>} - Image metadata
 */
export async function getImageInfo(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    const stats = fs.statSync(imagePath);
    
    return {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: stats.size,
      sizeKB: (stats.size / 1024).toFixed(2),
      exceedsLimit: stats.size > MAX_IMAGE_SIZE_BYTES
    };
  } catch (error) {
    throw new Error(`Failed to get image info: ${error.message}`);
  }
}

export default {
  compressImage,
  compressMultipleImages,
  createWebPWithFallback,
  getImageInfo,
  MAX_IMAGE_SIZE_KB,
  MAX_IMAGE_SIZE_BYTES
};
