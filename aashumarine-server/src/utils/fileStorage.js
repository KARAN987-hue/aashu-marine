import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Ensure upload directory exists, create if it doesn't
 * @param {string} dirPath - Directory path to ensure exists
 */
export const ensureUploadDirectory = async (dirPath) => {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Failed to create directory ${dirPath}:`, error);
    throw new Error(`Failed to create upload directory: ${error.message}`);
  }
};

/**
 * Delete file from filesystem with error handling
 * @param {string} filePath - Path to file to delete
 */
export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Log warning but don't throw - file might already be deleted
    if (error.code !== 'ENOENT') {
      console.warn(`Failed to delete file ${filePath}:`, error.message);
    }
  }
};

/**
 * Get full file path from relative path
 * @param {string} relativePath - Relative path from project root
 * @returns {string} Full absolute path
 */
export const getFullPath = (relativePath) => {
  if (!relativePath) return null;

  // Go up from utils directory to project root
  const projectRoot = path.resolve(__dirname, '../../');
  return path.join(projectRoot, relativePath);
};

/**
 * Generate image URL for client
 * @param {string|array} imageData - Relative path or array of paths stored in database
 * @returns {string|array|null} Full URL, array of URLs, or null if no path
 */
export const getImageUrl = (imageData) => {
  if (!imageData) return null;

  // Handle array of images (new format)
  if (Array.isArray(imageData)) {
    return imageData.map(path => {
      if (!path) return null;
      const normalizedPath = path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
      return `${baseUrl}${urlPath}`;
    }).filter(url => url !== null);
  }

  // Handle single image (legacy format)
  const normalizedPath = imageData.replace(/\\/g, '/');
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

  return `${baseUrl}${urlPath}`;
};

/**
 * Parse image data from database (handles both JSON array and legacy string)
 * @param {string|object} imageData - Image data from database
 * @returns {array} Array of image paths
 */
export const parseImageData = (imageData) => {
  if (!imageData) return [];

  // If already an array (parsed JSON), return it
  if (Array.isArray(imageData)) {
    return imageData.filter(path => path && path.trim() !== '');
  }

  // If it's a string that looks like JSON, try to parse it
  if (typeof imageData === 'string') {
    // Check if it's a JSON array string
    if (imageData.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(imageData);
        return Array.isArray(parsed) ? parsed.filter(path => path && path.trim() !== '') : [];
      } catch (e) {
        // If parsing fails, treat as single image path
        return imageData.trim() !== '' ? [imageData] : [];
      }
    }
    // Legacy single image path
    return imageData.trim() !== '' ? [imageData] : [];
  }

  return [];
};

/**
 * Delete multiple files from filesystem
 * @param {array} filePaths - Array of file paths to delete
 */
export const deleteFiles = async (filePaths) => {
  if (!Array.isArray(filePaths)) {
    filePaths = [filePaths];
  }

  const deletePromises = filePaths
    .filter(path => path && path.trim() !== '')
    .map(path => deleteFile(path));

  await Promise.all(deletePromises);
};

/**
 * Generate thumbnail for an uploaded image
 * @param {string} originalPath - Path to the original image file
 * @param {number} size - Thumbnail size (width and height in pixels)
 * @returns {Promise<string>} Path to the generated thumbnail
 */
export const generateThumbnail = async (originalPath, size = 300) => {
  try {
    // Parse the original file path
    const parsedPath = path.parse(originalPath);

    // Create thumbnail filename with "thumb_" prefix
    const thumbnailFilename = `thumb_${parsedPath.name}${parsedPath.ext}`;
    const thumbnailPath = path.join(parsedPath.dir, thumbnailFilename);

    // Generate thumbnail using sharp
    await sharp(originalPath)
      .resize(size, size, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 85 }) // Convert to JPEG for consistent format
      .toFile(thumbnailPath);

    return thumbnailPath;
  } catch (error) {
    console.error(`Failed to generate thumbnail for ${originalPath}:`, error);
    throw new Error(`Thumbnail generation failed: ${error.message}`);
  }
};

/**
 * Generate thumbnails for multiple images
 * @param {array} imagePaths - Array of image file paths
 * @param {number} size - Thumbnail size (width and height in pixels)
 * @returns {Promise<array>} Array of thumbnail paths
 */
export const generateThumbnails = async (imagePaths, size = 300) => {
  if (!Array.isArray(imagePaths)) {
    imagePaths = [imagePaths];
  }

  const thumbnailPromises = imagePaths
    .filter(path => path && path.trim() !== '')
    .map(path => generateThumbnail(path, size));

  return await Promise.all(thumbnailPromises);
};


/**
 * Generate video URL for client (same as image URL but for videos)
 * @param {string|array} videoData - Relative path or array of paths stored in database
 * @returns {string|array|null} Full URL, array of URLs, or null if no path
 */
export const getVideoUrl = (videoData) => {
  if (!videoData) return null;

  // Handle array of videos
  if (Array.isArray(videoData)) {
    return videoData.map(path => {
      if (!path) return null;
      const normalizedPath = path.replace(/\\/g, '/');
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;
      return `${baseUrl}${urlPath}`;
    }).filter(url => url !== null);
  }

  // Handle single video
  const normalizedPath = videoData.replace(/\\/g, '/');
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const urlPath = normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`;

  return `${baseUrl}${urlPath}`;
};

/**
 * Parse video data from database (handles both JSON array and legacy string)
 * @param {string|object} videoData - Video data from database
 * @returns {array} Array of video paths
 */
export const parseVideoData = (videoData) => {
  if (!videoData) return [];

  // If already an array (parsed JSON), return it
  if (Array.isArray(videoData)) {
    return videoData.filter(path => path && path.trim() !== '');
  }

  // If it's a string that looks like JSON, try to parse it
  if (typeof videoData === 'string') {
    // Check if it's a JSON array string
    if (videoData.trim().startsWith('[')) {
      try {
        const parsed = JSON.parse(videoData);
        return Array.isArray(parsed) ? parsed.filter(path => path && path.trim() !== '') : [];
      } catch (e) {
        // If parsing fails, treat as single video path
        return videoData.trim() !== '' ? [videoData] : [];
      }
    }
    // Single video path
    return videoData.trim() !== '' ? [videoData] : [];
  }
  return [];
  
};

