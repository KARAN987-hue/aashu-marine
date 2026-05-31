import { useState } from 'react';
import './ImagePreview.css';

export function ImagePreview({ src, alt = 'Image preview', onRemove, showRemove = true }) {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    if (onRemove) {
      onRemove();
    }
  };

  if (imageError) {
    return (
      <div className="image-preview-container">
        <div className="image-preview-error">
          <span>Unable to load image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="image-preview-container">
      <img
        src={src}
        alt={alt}
        className="image-preview"
        onError={handleImageError}
      />
      {showRemove && (
        <button
          type="button"
          className="image-preview-remove"
          onClick={handleRemoveClick}
          aria-label="Remove image"
        >
          ×
        </button>
      )}
    </div>
  );
}
