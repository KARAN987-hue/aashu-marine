import { useState } from 'react';
import './VideoPreview.css';

export function VideoPreview({ src, alt = 'Video preview', onRemove, showRemove = true }) {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleRemoveClick = (e) => {
    e.preventDefault();
    if (onRemove) {
      onRemove();
    }
  };

  if (videoError) {
    return (
      <div className="video-preview-container">
        <div className="video-preview-error">
          <span>Unable to load video</span>
        </div>
      </div>
    );
  }

  return (
    <div className="video-preview-container">
      <video
        src={src}
        className="video-preview"
        onError={handleVideoError}
        controls
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
      {showRemove && (
        <button
          type="button"
          className="video-preview-remove"
          onClick={handleRemoveClick}
          aria-label="Remove video"
        >
          ×
        </button>
      )}
    </div>
  );
}
