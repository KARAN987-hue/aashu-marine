import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { compressImage } from '../utils/imageProcessor.js';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products';
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename: timestamp-random.extension
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = path.extname(file.originalname);
    const uniqueName = `${timestamp}-${randomString}${extension}`;
    
    cb(null, uniqueName);
  }
});
// -----------------------------------------------------------------------------------
// Configure storage for videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/products/videos';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const extension = path.extname(file.originalname);
    const uniqueName = `${timestamp}-${randomString}${extension}`;
    
    cb(null, uniqueName);
  }
});

// File filter for video types
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only MP4, WebM, and OGG are allowed.'), false);
  }
};

// Configure multer for videos
const videoUpload = multer({
  storage: videoStorage,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB
  },
  fileFilter: videoFileFilter
});

// Export middleware for multiple video uploads (up to 5 videos)
export const uploadProductVideos = videoUpload.array('videos', 5);

// Combined upload for both images and videos
export const uploadProductMedia = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const isVideo = file.mimetype.startsWith('video/');
      const uploadDir = isVideo ? 'uploads/products/videos' : 'uploads/products';
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(7);
      const extension = path.extname(file.originalname);
      const uniqueName = `${timestamp}-${randomString}${extension}`;
      
      cb(null, uniqueName);
    }
  }),
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB max (covers both images and videos)
  },
  fileFilter: (req, file, cb) => {
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const allAllowedTypes = [...allowedImageTypes, ...allowedVideoTypes];
    
    if (allAllowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images (JPEG, PNG, GIF, WebP) and videos (MP4, WebM, OGG) are allowed.'), false);
    }
  }
}).fields([
  { name: 'images', maxCount: 10 },
  { name: 'videos', maxCount: 5 }
]);

// -----------------------------------------------------------------------------------
// File filter for image types
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: fileFilter
});

/**
 * Middleware to compress uploaded images automatically
 * Validates: Requirements 11.4
 */
export const compressUploadedImages = async (req, res, next) => {
  try {
    // Handle single file upload
    if (req.file) {
      const filePath = req.file.path;
      const result = await compressImage(filePath, {
        convertToWebP: true,
        preserveOriginal: false
      });
      
      // Update req.file with compressed image info
      req.file.path = result.outputPath;
      req.file.filename = path.basename(result.outputPath);
      req.file.size = result.optimizedSize;
      req.file.compressionInfo = result;
    }
    
    // Handle multiple file uploads
    if (req.files && Array.isArray(req.files)) {
      const compressionResults = await Promise.all(
        req.files.map(async (file) => {
          const filePath = file.path;
          const result = await compressImage(filePath, {
            convertToWebP: true,
            preserveOriginal: false
          });
          
          // Update file info
          file.path = result.outputPath;
          file.filename = path.basename(result.outputPath);
          file.size = result.optimizedSize;
          file.compressionInfo = result;
          
          return result;
        })
      );
      
      req.compressionResults = compressionResults;
    }
    
    next();
  } catch (error) {
    console.error('Image compression middleware error:', error);
    // Continue even if compression fails, but log the error
    next();
  }
};

// Export middleware for single file upload (legacy)
export const uploadProductImage = upload.single('image');

// Export middleware for multiple file uploads (up to 10 images)
export const uploadProductImages = upload.array('images', 10);

// Error handling middleware for multer errors
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Multer-specific errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size exceeds 5MB limit'
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        error: 'Too many files',
        message: 'Maximum 10 images allowed per product'
      });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        error: 'Unexpected file',
        message: 'Unexpected file upload'
      });
    }
    return res.status(400).json({
      error: 'Upload error',
      message: err.message
    });
  } else if (err) {
    // Other errors (like file filter errors)
    if (err.message.includes('Invalid file type')) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: err.message,
        field: 'image'
      });
    }
    return next(err);
  }
  next();
};
