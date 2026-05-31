-- Migration to support multiple images per product
-- Changes image column from VARCHAR to JSON to store array of image paths
-- Maintains backward compatibility by converting existing single images to arrays

-- Step 1: Add new column for image array
ALTER TABLE products 
ADD COLUMN images JSON NULL AFTER image;

-- Step 2: Migrate existing single images to array format
UPDATE products 
SET images = JSON_ARRAY(image) 
WHERE image IS NOT NULL AND image != '';

-- Step 3: Set empty array for products with no images
UPDATE products 
SET images = JSON_ARRAY() 
WHERE image IS NULL OR image = '';

-- Step 4: Drop old image column (optional - can be kept for rollback)
-- Uncomment the line below if you want to remove the old column completely
-- ALTER TABLE products DROP COLUMN image;

-- Note: For backward compatibility, we keep the 'image' column for now
-- The application will use 'images' (JSON array) as the primary field
-- and 'image' (VARCHAR) as a fallback for legacy data
