-- Migration to add thumbnails column for storing thumbnail image paths
-- This supports the performance optimization requirement for multiple images

-- Add thumbnails column to store JSON array of thumbnail paths
ALTER TABLE products 
ADD COLUMN thumbnails JSON NULL AFTER images;

-- Set empty array for existing products
UPDATE products 
SET thumbnails = JSON_ARRAY() 
WHERE thumbnails IS NULL;

-- Note: Thumbnails will be generated automatically when images are uploaded
-- The thumbnails array will have the same length as the images array
-- Each thumbnail corresponds to the image at the same index
