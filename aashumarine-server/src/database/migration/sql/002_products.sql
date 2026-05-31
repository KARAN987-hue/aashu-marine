-- Create products table matching frontend schema
CREATE TABLE products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(255) NOT NULL,
  image VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  product_type VARCHAR(100),
  manufacturer VARCHAR(255),
  `condition` ENUM('New', 'Refurbished', 'Used') DEFAULT 'New',
  model VARCHAR(100),
  search_keyword TEXT,
  short_description TEXT,
  main_description LONGTEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  owner VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_category (category),
  INDEX idx_product_type (product_type),
  INDEX idx_condition (`condition`),
  INDEX idx_is_active (is_active),
  FULLTEXT idx_search (product_name, search_keyword, short_description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
