import { useState, useEffect } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ImagePreview } from '../common/ImagePreview';
import { VideoPreview } from '../common/VideoPreview';
import { validateProduct, hasErrors } from '../../utils/validation';
import { productService } from '../../services/productService';
import './ProductForm.css';



export function ProductForm({ initialData = null, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    product_type: '',
    manufacturer: '',
    condition: '',
    model: '',
    short_description: '',
    main_description: '',
    search_keyword: '',
    owner: '',
    is_active: true,
    image_url: '',
    price: '',
    stock_quantity: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  // const [manufacturers, setManufacturers] = useState([]);

  // Image upload state - now supports multiple images
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToRemove, setImagesToRemove] = useState([]);
  const [imageError, setImageError] = useState('');

  // Video upload state - supports multiple videos
  const [videoFiles, setVideoFiles] = useState([]);
  const [videoPreviews, setVideoPreviews] = useState([]);
  const [existingVideos, setExistingVideos] = useState([]);
  const [videosToRemove, setVideosToRemove] = useState([]);
  const [videoError, setVideoError] = useState('');


  // Load categories only (manufacturers are now free text input)
  useEffect(() => {
    const loadOptions = async () => {
      try {
        const categoriesData = await productService.getCategories();
        setCategories(categoriesData.categories);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };
    loadOptions();
  }, []);


  // Populate form with initial data for edit mode
  useEffect(() => {
    if (initialData) {
      setFormData({
        product_name: initialData.product_name || '',
        category: initialData.category || '',
        product_type: initialData.product_type || '',
        manufacturer: initialData.manufacturer || '',
        condition: initialData.condition || '',
        model: initialData.model || '',
        short_description: initialData.short_description || '',
        main_description: initialData.main_description || '',
        search_keyword: initialData.search_keyword || '',
        owner: initialData.owner || '',
        is_active: initialData.is_active !== undefined ? initialData.is_active : true,
        image_url: initialData.image_url || '',
        price: initialData.price !== undefined ? initialData.price : '',
        stock_quantity: initialData.stock_quantity !== undefined ? initialData.stock_quantity : '',
      });

      // Set existing images for edit mode - prefer resolved URLs from backend
      if (initialData.imageUrls && Array.isArray(initialData.imageUrls) && initialData.imageUrls.length > 0) {
        setExistingImages(initialData.imageUrls);
      } else if (initialData.thumbnailUrls && Array.isArray(initialData.thumbnailUrls) && initialData.thumbnailUrls.length > 0) {
        setExistingImages(initialData.thumbnailUrls);
      } else if (initialData.imageUrl) {
        setExistingImages([initialData.imageUrl]);
      }

      // Set existing videos for edit mode - prefer resolved URLs from backend
      if (initialData.videoUrls && Array.isArray(initialData.videoUrls) && initialData.videoUrls.length > 0) {
        setExistingVideos(initialData.videoUrls);
      }
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    // Validate single field on blur
    const fieldErrors = validateProduct({ ...formData, [name]: formData[name] });
    if (fieldErrors[name]) {
      setErrors((prev) => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Clear previous errors
    setImageError('');

    // Validate total image count (max 10 including existing)
    const totalImages = existingImages.length - imagesToRemove.length + imageFiles.length + files.length;
    if (totalImages > 10) {
      setImageError(`Maximum 10 images allowed. You currently have ${existingImages.length - imagesToRemove.length + imageFiles.length} images.`);
      e.target.value = '';
      return;
    }

    // Validate each file
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        setImageError('All files must be valid images (JPEG, PNG, GIF, or WebP)');
        e.target.value = '';
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setImageError('All files must be less than 5MB');
        e.target.value = '';
        return;
      }

      validFiles.push(file);
    }

    // Create previews for all valid files
    let loadedCount = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        loadedCount++;

        if (loadedCount === validFiles.length) {
          setImageFiles(prev => [...prev, ...validFiles]);
          setImagePreviews(prev => [...prev, ...previews]);
        }
      };
      reader.onerror = () => {
        setImageError('Failed to load image preview');
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = '';
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageUrl) => {
    setImagesToRemove(prev => [...prev, imageUrl]);
  };

  const handleRestoreExistingImage = (imageUrl) => {
    setImagesToRemove(prev => prev.filter(url => url !== imageUrl));
  };

  const handleVideoSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Clear previous errors
    setVideoError('');

    // Validate total video count (max 5 including existing)
    const totalVideos = existingVideos.length - videosToRemove.length + videoFiles.length + files.length;
    if (totalVideos > 5) {
      setVideoError(`Maximum 5 videos allowed. You currently have ${existingVideos.length - videosToRemove.length + videoFiles.length} videos.`);
      e.target.value = '';
      return;
    }

    // Validate each file
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg'];
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    const validFiles = [];
    const previews = [];

    for (const file of files) {
      // Validate file type
      if (!validTypes.includes(file.type)) {
        setVideoError('All files must be valid videos (MP4, WebM, or OGG)');
        e.target.value = '';
        return;
      }

      // Validate file size
      if (file.size > maxSize) {
        setVideoError('All files must be less than 50MB');
        e.target.value = '';
        return;
      }

      validFiles.push(file);
    }

    // Create previews for all valid files
    let loadedCount = 0;
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        loadedCount++;

        if (loadedCount === validFiles.length) {
          setVideoFiles(prev => [...prev, ...validFiles]);
          setVideoPreviews(prev => [...prev, ...previews]);
        }
      };
      reader.onerror = () => {
        setVideoError('Failed to load video preview');
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    e.target.value = '';
  };

  const handleRemoveNewVideo = (index) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
    setVideoPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingVideo = (videoUrl) => {
    setVideosToRemove(prev => [...prev, videoUrl]);
  };

  const handleRestoreExistingVideo = (videoUrl) => {
    setVideosToRemove(prev => prev.filter(url => url !== videoUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateProduct(formData);
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert numeric fields to numbers
      const submitData = {
        ...formData,
        price: formData.price !== '' ? Number(formData.price) : undefined,
        stock_quantity: formData.stock_quantity !== '' ? Number(formData.stock_quantity) : undefined,
      };

      // Always use FormData for multiple image support
      const formDataObj = new FormData();

      // Append all form fields
      Object.keys(submitData).forEach((key) => {
        if (submitData[key] !== undefined && submitData[key] !== null) {
          formDataObj.append(key, submitData[key]);
        }
      });

      // Append all new image files
      imageFiles.forEach((file) => {
        formDataObj.append('images', file);
      });

      // Append images to remove (send as JSON array)
      if (imagesToRemove.length > 0) {
        formDataObj.append('imagesToRemove', JSON.stringify(imagesToRemove));
      }

      // Append all new video files
      videoFiles.forEach((file) => {
        formDataObj.append('videos', file);
      });

      // Append videos to remove (send as JSON array)
      if (videosToRemove.length > 0) {
        formDataObj.append('videosToRemove', JSON.stringify(videosToRemove));
      }

      await onSubmit(formDataObj);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field">
          <Input
            label="Product Name *"
            name="product_name"
            value={formData.product_name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.product_name}
            placeholder="Enter product name"
          />
        </div>

        <div className="form-field">
          <label htmlFor="category" className="form-label">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-select ${errors.category ? 'error' : ''}`}
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <span className="field-error">{errors.category}</span>}
        </div>

        <div className="form-field">
          <Input
            label="Product Type"
            name="product_type"
            value={formData.product_type}
            onChange={handleChange}
            placeholder="e.g., Electronics, Hardware"
          />
        </div>

        <div className="form-field">
          <Input
            label="Manufacturer *"
            name="manufacturer"
            value={formData.manufacturer}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.manufacturer}
            placeholder="Enter manufacturer name"
            maxLength={100}
          />
        </div>



        <div className="form-field">
          <label htmlFor="condition" className="form-label">
            Condition *
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`form-select ${errors.condition ? 'error' : ''}`}
          >
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Refurbished">Refurbished</option>
            <option value="Used">Used</option>
          </select>
          {errors.condition && <span className="field-error">{errors.condition}</span>}
        </div>

        <div className="form-field">
          <Input
            label="Model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            placeholder="Enter model number"
          />
        </div>

        <div className="form-field">
          <Input
            label="Price"
            name="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.price}
            placeholder="0.00"
          />
        </div>

        <div className="form-field">
          <Input
            label="Stock Quantity"
            name="stock_quantity"
            type="number"
            value={formData.stock_quantity}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.stock_quantity}
            placeholder="0"
          />
        </div>

        <div className="form-field full-width">
          <Input
            label="Short Description"
            name="short_description"
            value={formData.short_description}
            onChange={handleChange}
            placeholder="Brief product description"
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="main_description" className="form-label">
            Main Description
          </label>
          <textarea
            id="main_description"
            name="main_description"
            value={formData.main_description}
            onChange={handleChange}
            className="form-textarea"
            rows="4"
            placeholder="Detailed product description"
          />
        </div>

        <div className="form-field full-width">
          <Input
            label="Search Keywords"
            name="search_keyword"
            value={formData.search_keyword}
            onChange={handleChange}
            placeholder="Comma-separated keywords for search"
          />
        </div>

        <div className="form-field">
          <Input
            label="Owner"
            name="owner"
            value={formData.owner}
            onChange={handleChange}
            placeholder="Product owner"
          />
        </div>

        <div className="form-field full-width">
          <label htmlFor="image" className="form-label">
            Product Images
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageSelect}
            className="form-file-input"
            multiple
          />
          <p className="form-help-text">
            Accepted formats: JPEG, PNG, GIF, WebP. Maximum size: 5MB per file. Maximum 10 images total.
          </p>
          {imageError && <span className="field-error">{imageError}</span>}

          {/* Display existing images with remove buttons */}
          {existingImages.length > 0 && (
            <div className="image-previews-grid">
              <h4 className="previews-heading">Existing Images</h4>
              <div className="previews-container">
                {existingImages.map((imageUrl, index) => {
                  const isMarkedForRemoval = imagesToRemove.includes(imageUrl);
                  return (
                    <div key={`existing-${index}`} className={`image-preview-item ${isMarkedForRemoval ? 'marked-for-removal' : ''}`}>
                      <ImagePreview
                        src={imageUrl}
                        alt={`Existing product image ${index + 1}`}
                        onRemove={() => handleRemoveExistingImage(imageUrl)}
                        showRemove={!isMarkedForRemoval}
                      />
                      {isMarkedForRemoval && (
                        <button
                          type="button"
                          className="restore-button"
                          onClick={() => handleRestoreExistingImage(imageUrl)}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Display new image previews */}
          {imagePreviews.length > 0 && (
            <div className="image-previews-grid">
              <h4 className="previews-heading">New Images</h4>
              <div className="previews-container">
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="image-preview-item">
                    <ImagePreview
                      src={preview}
                      alt={`New product image ${index + 1}`}
                      onRemove={() => handleRemoveNewImage(index)}
                      showRemove={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-field full-width">
          <label htmlFor="video" className="form-label">
            Product Videos
          </label>
          <input
            type="file"
            id="video"
            name="video"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleVideoSelect}
            className="form-file-input"
            multiple
          />
          <p className="form-help-text">
            Accepted formats: MP4, WebM, OGG. Maximum size: 50MB per file. Maximum 5 videos total.
          </p>
          {videoError && <span className="field-error">{videoError}</span>}

          {/* Display existing videos with remove buttons */}
          {existingVideos.length > 0 && (
            <div className="image-previews-grid">
              <h4 className="previews-heading">Existing Videos</h4>
              <div className="previews-container">
                {existingVideos.map((videoUrl, index) => {
                  const isMarkedForRemoval = videosToRemove.includes(videoUrl);
                  return (
                    <div key={`existing-video-${index}`} className={`image-preview-item ${isMarkedForRemoval ? 'marked-for-removal' : ''}`}>
                      <VideoPreview
                        src={videoUrl}
                        alt={`Existing product video ${index + 1}`}
                        onRemove={() => handleRemoveExistingVideo(videoUrl)}
                        showRemove={!isMarkedForRemoval}
                      />
                      {isMarkedForRemoval && (
                        <button
                          type="button"
                          className="restore-button"
                          onClick={() => handleRestoreExistingVideo(videoUrl)}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Display new video previews */}
          {videoPreviews.length > 0 && (
            <div className="image-previews-grid">
              <h4 className="previews-heading">New Videos</h4>
              <div className="previews-container">
                {videoPreviews.map((preview, index) => (
                  <div key={`new-video-${index}`} className="image-preview-item">
                    <VideoPreview
                      src={preview}
                      alt={`New product video ${index + 1}`}
                      onRemove={() => handleRemoveNewVideo(index)}
                      showRemove={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="form-field full-width">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            <span>Active (visible on website)</span>
          </label>
        </div>
      </div>

      <div className="form-actions">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
          {initialData ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}
