import db from '../database/db.js';
import path from 'path';
import { validateRequiredFields, validatePagination, sanitizeString } from '../utils/validation.js';
import { deleteFile, deleteFiles, getImageUrl, getVideoUrl, parseImageData, parseVideoData, generateThumbnails } from '../utils/fileStorage.js';

/**
 * Get all products with filtering and pagination
 */
export const getAllProducts = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      product_type,
      condition,
      manufacturer,
      search,
      is_active 
    } = req.query;

    const { page: validPage, limit: validLimit, offset } = validatePagination(page, limit);

    // Build query
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    // Add filters
    if (is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(is_active === 'true' || is_active === true ? 1 : 0);
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (product_type) {
      query += ' AND product_type = ?';
      params.push(product_type);
    }

    if (condition) {
      query += ' AND `condition` = ?';
      params.push(condition);
    }

    if (manufacturer) {
  query += ' AND manufacturer LIKE ?';
  params.push(`%${manufacturer}%`);
}


    if (search) {
      query += ' AND (product_name LIKE ? OR search_keyword LIKE ? OR short_description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Get total count
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Add pagination
    query += ' ORDER BY created_date DESC LIMIT ? OFFSET ?';
    params.push(validLimit, offset);

       // Execute query
    const [products] = await db.query(query, params);

    // Add imageUrl to each product and parse images array
    const productsWithUrls = products.map(product => {
      const images = parseImageData(product.images || product.image);
      const thumbnails = parseImageData(product.thumbnails);
      const videos = parseVideoData(product.videos);
      return {
        ...product,
        images: images,
        thumbnails: thumbnails,
        videos: videos,
        imageUrl: getImageUrl(images[0]), // First image for backward compatibility
        imageUrls: getImageUrl(images), // Array of all image URLs
        thumbnailUrl: getImageUrl(thumbnails[0]), // First thumbnail for backward compatibility
        thumbnailUrls: getImageUrl(thumbnails), // Array of all thumbnail URLs
        videoUrls: getVideoUrl(videos)
      };
    });

    res.json({
      products: productsWithUrls,
      pagination: {
        page: validPage,
        limit: validLimit,
        total,
        totalPages: Math.ceil(total / validLimit)
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Get single product by ID
 */
export const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const product = products[0];
    const images = parseImageData(product.images || product.image);
    const thumbnails = parseImageData(product.thumbnails);
    const videos = parseVideoData(product.videos);

    res.json({
      product: {
        ...product,
        images: images,
        thumbnails: thumbnails,
        videos: videos,
        imageUrl: getImageUrl(images[0]), // First image for backward compatibility
        imageUrls: getImageUrl(images), // Array of all image URLs
        thumbnailUrl: getImageUrl(thumbnails[0]), // First thumbnail for backward compatibility
        thumbnailUrls: getImageUrl(thumbnails), // Array of all thumbnail URLs
        videoUrls: getVideoUrl(videos)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create new product
 */
export const createProduct = async (req, res, next) => {
  try {
    const {
      product_name,
      category,
      product_type,
      manufacturer,
      condition = 'New',
      model,
      search_keyword,
      short_description,
      main_description,
      owner,
      is_active = true
    } = req.body;

    // Validate required fields
    const validation = validateRequiredFields(req.body, ['product_name', 'category']);
    if (!validation.valid) {
      return res.status(400).json({
        error: 'Validation error',
        message: `Missing required fields: ${validation.missing.join(', ')}`
      });
    }

    // Handle multiple image uploads
    let imagePaths = [];
    let thumbnailPaths = [];
    
    if (req.files && req.files.images && req.files.images.length > 0) {
      // Multiple images uploaded
      imagePaths = req.files.images.map(file => file.path);
      
      // Generate thumbnails for all uploaded images
      try {
        thumbnailPaths = await generateThumbnails(imagePaths, 300);
      } catch (error) {
        // If thumbnail generation fails, clean up uploaded files and return error
        await deleteFiles(imagePaths);
        return res.status(500).json({
          error: 'Thumbnail generation failed',
          message: error.message
        });
      }
    } else if (req.file) {
      // Single image uploaded (legacy support)
      imagePaths = [req.file.path];
      
      // Generate thumbnail for single image
      try {
        thumbnailPaths = await generateThumbnails(imagePaths, 300);
      } catch (error) {
        // If thumbnail generation fails, clean up uploaded file and return error
        await deleteFile(req.file.path);
        return res.status(500).json({
          error: 'Thumbnail generation failed',
          message: error.message
        });
      }
    }

    // Handle multiple video uploads
    let videoPaths = [];

    if (req.files && req.files.videos && req.files.videos.length > 0) {
      videoPaths = req.files.videos.map(file => file.path);
    }

    // Store as JSON arrays
    const imagesJson = JSON.stringify(imagePaths);
    const thumbnailsJson = JSON.stringify(thumbnailPaths);
    const videosJson = JSON.stringify(videoPaths);

    // Insert product
    const [result] = await db.query(
      `INSERT INTO products (
        product_name, images, thumbnails, videos, category, product_type, manufacturer, 
        \`condition\`, model, search_keyword, short_description, 
        main_description, owner, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sanitizeString(product_name),
        imagesJson,
        thumbnailsJson,
        videosJson,
        sanitizeString(category),
        product_type,
        manufacturer,
        condition,
        model,
        search_keyword,
        short_description,
        main_description,
        owner,
        is_active === 'true' || is_active === true ? 1 : 0
      ]
    );

    // Get created product
    const [products] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    const product = products[0];
    const images = parseImageData(product.images);
    const thumbnails = parseImageData(product.thumbnails);
    const videos = parseVideoData(product.videos);

    // Add imageUrls, thumbnailUrls, and videoUrls to response
    const productWithUrls = {
      ...product,
      images: images,
      thumbnails: thumbnails,
      videos: videos,
      imageUrl: getImageUrl(images[0]), // First image for backward compatibility
      imageUrls: getImageUrl(images), // Array of all image URLs
      thumbnailUrl: getImageUrl(thumbnails[0]), // First thumbnail for backward compatibility
      thumbnailUrls: getImageUrl(thumbnails), // Array of all thumbnail URLs
      videoUrls: getVideoUrl(videos)
    };

    res.status(201).json({
      message: 'Product created successfully',
      product: productWithUrls
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 */
export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check if product exists and get current data
    const [existing] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentProduct = existing[0];
    let currentImages = parseImageData(currentProduct.images || currentProduct.image);
    let currentThumbnails = parseImageData(currentProduct.thumbnails);
    let currentVideos = parseVideoData(currentProduct.videos);

    // Parse media removal arrays from FormData
    let imagesToRemove = [];
    let videosToRemove = [];

    // Helper to strip base URL and normalize to relative path
    const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
    const toRelativePath = (url) => {
      if (!url) return url;
      if (url.startsWith(baseUrl)) {
        return url.slice(baseUrl.length).replace(/^\//, '');
      }
      // Strip any http(s)://host:port prefix
      return url.replace(/^https?:\/\/[^/]+\//, '');
    };
    
    if (updates.imagesToRemove) {
      try {
        const parsed = JSON.parse(updates.imagesToRemove);
        imagesToRemove = Array.isArray(parsed) ? parsed.map(toRelativePath) : [];
      } catch (e) {
        console.warn('Failed to parse imagesToRemove:', e);
        imagesToRemove = [];
      }
    }
    
    if (updates.videosToRemove) {
      try {
        const parsed = JSON.parse(updates.videosToRemove);
        videosToRemove = Array.isArray(parsed) ? parsed.map(toRelativePath) : [];
      } catch (e) {
        console.warn('Failed to parse videosToRemove:', e);
        videosToRemove = [];
      }
    }

    // Process image removals
    if (imagesToRemove.length > 0) {
      // Delete marked images from filesystem
      await deleteFiles(imagesToRemove);
      
      // Find and delete corresponding thumbnails
      const thumbnailsToDelete = imagesToRemove.map(imagePath => {
        const parsedPath = path.parse(imagePath);
        const thumbnailFilename = `thumb_${parsedPath.name}${parsedPath.ext}`;
        return path.join(parsedPath.dir, thumbnailFilename);
      });
      await deleteFiles(thumbnailsToDelete);
      
      // Remove deleted images from current arrays
      currentImages = currentImages.filter(img => !imagesToRemove.includes(img));
      currentThumbnails = currentThumbnails.filter(thumb => !thumbnailsToDelete.includes(thumb));
    }

    // Process video removals
    if (videosToRemove.length > 0) {
      // Delete marked videos from filesystem
      await deleteFiles(videosToRemove);
      
      // Remove deleted videos from current array
      currentVideos = currentVideos.filter(video => !videosToRemove.includes(video));
    }

    // Handle image operations
    let imagesToStore = [...currentImages]; // Start with existing images (after removals)
    let thumbnailsToStore = [...currentThumbnails]; // Start with existing thumbnails (after removals)

    // Check if new images are being uploaded
    // When using .fields(), req.files is an object with 'images' and 'videos' properties
    if (req.files && req.files.images && req.files.images.length > 0) {
      // Add new images to existing collection
      const newImagePaths = req.files.images.map(file => file.path);
      imagesToStore = [...imagesToStore, ...newImagePaths];
      
      // Enforce maximum 10 images
      if (imagesToStore.length > 10) {
        // Delete the newly uploaded files since we're rejecting the request
        await deleteFiles(newImagePaths);
        return res.status(400).json({
          error: 'Too many images',
          message: 'Maximum 10 images allowed per product'
        });
      }
      
      // Generate thumbnails for new images
      try {
        const newThumbnailPaths = await generateThumbnails(newImagePaths, 300);
        thumbnailsToStore = [...thumbnailsToStore, ...newThumbnailPaths];
      } catch (error) {
        // If thumbnail generation fails, clean up uploaded files and return error
        await deleteFiles(newImagePaths);
        return res.status(500).json({
          error: 'Thumbnail generation failed',
          message: error.message
        });
      }
    }

    // Check if all images should be removed
    if (updates.removeAllImages === 'true') {
      // Delete all existing image files and thumbnails
      await deleteFiles(currentImages);
      await deleteFiles(currentThumbnails);
      imagesToStore = [];
      thumbnailsToStore = [];
    }

    // Handle video operations
    let videosToStore = [...currentVideos]; // Start with existing videos (after removals)

    // Check if new videos are being uploaded
    if (req.files && req.files.videos && req.files.videos.length > 0) {
      // Add new videos to existing collection
      const newVideoPaths = req.files.videos.map(file => file.path);
      videosToStore = [...videosToStore, ...newVideoPaths];
      
      // Enforce maximum 5 videos
      if (videosToStore.length > 5) {
        // Delete the newly uploaded files since we're rejecting the request
        await deleteFiles(newVideoPaths);
        return res.status(400).json({
          error: 'Too many videos',
          message: 'Maximum 5 videos allowed per product'
        });
      }
    }

    // Check if all videos should be removed
    if (updates.removeAllVideos === 'true') {
      // Delete all existing video files
      await deleteFiles(currentVideos);
      videosToStore = [];
    }

    // Store as JSON arrays
    const imagesJson = JSON.stringify(imagesToStore);
    const thumbnailsJson = JSON.stringify(thumbnailsToStore);
    const videosJson = JSON.stringify(videosToStore);

    // Build update query dynamically
    const allowedFields = [
      'product_name', 'category', 'product_type', 'manufacturer',
      'condition', 'model', 'search_keyword', 'short_description',
      'main_description', 'owner', 'is_active'
    ];

    const updateFields = ['images = ?', 'thumbnails = ?', 'videos = ?'];
    const params = [imagesJson, thumbnailsJson, videosJson];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key)) {
        updateFields.push(`${key === 'condition' ? '`condition`' : key} = ?`);
        // Convert is_active string to integer for MySQL
        const value = key === 'is_active'
          ? (updates[key] === 'true' || updates[key] === true ? 1 : 0)
          : updates[key];
        params.push(value);
      }
    });

    params.push(id);

    await db.query(
      `UPDATE products SET ${updateFields.join(', ')} WHERE id = ?`,
      params
    );

    // Get updated product
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    const product = products[0];
    const images = parseImageData(product.images);
    const thumbnails = parseImageData(product.thumbnails);
    const videos = parseVideoData(product.videos);

    // Add imageUrls and thumbnailUrls to response
    const productWithUrls = {
      ...product,
      images: images,
      thumbnails: thumbnails,
      videos: videos,
      imageUrl: getImageUrl(images[0]), // First image for backward compatibility
      imageUrls: getImageUrl(images), // Array of all image URLs
      thumbnailUrl: getImageUrl(thumbnails[0]), // First thumbnail for backward compatibility
      thumbnailUrls: getImageUrl(thumbnails), // Array of all thumbnail URLs
      videoUrls: getVideoUrl(videos)
    };

    res.json({
      message: 'Product updated successfully',
      product: productWithUrls
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get product with image paths before deletion
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];

    // Delete product from database
    await db.query('DELETE FROM products WHERE id = ?', [id]);

    // Delete all image files and thumbnails
    const images = parseImageData(product.images || product.image);
    const thumbnails = parseImageData(product.thumbnails);
    
    if (images.length > 0) {
      await deleteFiles(images);
    }
    
    if (thumbnails.length > 0) {
      await deleteFiles(thumbnails);
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product categories
 */
export const getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query(
      'SELECT DISTINCT category FROM products WHERE is_active = true ORDER BY category'
    );

    res.json({
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get product manufacturers
 */
export const getManufacturers = async (req, res, next) => {
  try {
    const [manufacturers] = await db.query(
      'SELECT DISTINCT manufacturer FROM products WHERE is_active = true AND manufacturer IS NOT NULL ORDER BY manufacturer'
    );

    res.json({
      manufacturers: manufacturers.map(m => m.manufacturer)
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete individual image from product
 */
export const deleteProductImage = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { imagePath } = req.body;

    if (!imagePath) {
      return res.status(400).json({
        error: 'Validation error',
        message: 'imagePath is required'
      });
    }

    // Get product
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);

    if (products.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const product = products[0];
    let currentImages = parseImageData(product.images || product.image);
    let currentThumbnails = parseImageData(product.thumbnails);

    // Check if image exists in product
    if (!currentImages.includes(imagePath)) {
      return res.status(404).json({
        error: 'Image not found',
        message: 'The specified image does not belong to this product'
      });
    }

    // Find the index of the image to remove
    const imageIndex = currentImages.indexOf(imagePath);

    // Remove image from array
    const updatedImages = currentImages.filter(img => img !== imagePath);
    
    // Remove corresponding thumbnail from array
    const updatedThumbnails = currentThumbnails.filter((_, index) => index !== imageIndex);
    const thumbnailToDelete = currentThumbnails[imageIndex];

    // Update database
    const imagesJson = JSON.stringify(updatedImages);
    const thumbnailsJson = JSON.stringify(updatedThumbnails);
    await db.query(
      'UPDATE products SET images = ?, thumbnails = ? WHERE id = ?',
      [imagesJson, thumbnailsJson, id]
    );

    // Delete physical files
    await deleteFile(imagePath);
    if (thumbnailToDelete) {
      await deleteFile(thumbnailToDelete);
    }

    // Get updated product
    const [updatedProducts] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const updatedProduct = updatedProducts[0];
    const images = parseImageData(updatedProduct.images);
    const thumbnails = parseImageData(updatedProduct.thumbnails);
    const videos = parseVideoData(updatedProduct.videos);

    res.json({
      message: 'Image deleted successfully',
      product: {
        ...updatedProduct,
        images: images,
        thumbnails: thumbnails,
        videos: videos,
        imageUrl: getImageUrl(images[0]),
        imageUrls: getImageUrl(images),
        thumbnailUrl: getImageUrl(thumbnails[0]),
        thumbnailUrls: getImageUrl(thumbnails),
        videoUrls: getVideoUrl(videos)
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get related products based on keyword matching with fallback logic
 */
export const getRelatedProducts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = 3; // Requirement 8.2: Limit to 2-3 related products

    // Get current product
    const [currentProducts] = await db.query(
      'SELECT category, manufacturer FROM products WHERE id = ? AND is_active = true',
      [id]
    );

    if (currentProducts.length === 0) {
      return res.status(404).json({
        error: 'Product not found'
      });
    }

    const currentProduct = currentProducts[0];
    let relatedProducts = [];

    // Strategy 1: Match by engine type (category) or manufacturer (Requirement 8.3)
    if (currentProduct.category || currentProduct.manufacturer) {
      const conditions = [];
      const params = [];

      if (currentProduct.category) {
        conditions.push('category = ?');
        params.push(currentProduct.category);
      }

      if (currentProduct.manufacturer) {
        conditions.push('manufacturer = ?');
        params.push(currentProduct.manufacturer);
      }

      const query = `
        SELECT *,
          CASE
            WHEN category = ? AND manufacturer = ? THEN 3
            WHEN category = ? THEN 2
            WHEN manufacturer = ? THEN 1
            ELSE 0
          END as match_score
        FROM products
        WHERE id != ?
          AND is_active = true
          AND (${conditions.join(' OR ')})
        ORDER BY match_score DESC, created_date DESC
        LIMIT ?
      `;

      const queryParams = [
        currentProduct.category || '',
        currentProduct.manufacturer || '',
        currentProduct.category || '',
        currentProduct.manufacturer || '',
        id,
        ...params,
        limit
      ];

      const [products] = await db.query(query, queryParams);
      relatedProducts = products;
    }

    // Strategy 2: Fallback to recently added products
    if (relatedProducts.length === 0) {
      const [products] = await db.query(
        `SELECT * FROM products
         WHERE id != ?
           AND is_active = true
         ORDER BY created_date DESC
         LIMIT ?`,
        [id, limit]
      );
      relatedProducts = products;
    }

    // Add imageUrls to each product
    const productsWithUrls = relatedProducts.map(product => {
      const images = parseImageData(product.images || product.image);
      const thumbnails = parseImageData(product.thumbnails);
      const videos = parseVideoData(product.videos);
      return {
        ...product,
        images: images,
        thumbnails: thumbnails,
        videos: videos,
        imageUrl: getImageUrl(images[0]),
        imageUrls: getImageUrl(images),
        thumbnailUrl: getImageUrl(thumbnails[0]),
        thumbnailUrls: getImageUrl(thumbnails),
        videoUrls: getVideoUrl(videos)
      };
    });

    res.json({
      relatedProducts: productsWithUrls
    });
  } catch (error) {
    next(error);
  }
};

