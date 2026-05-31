import { useState } from 'react';
import './MapEmbed.css';

const MapEmbed = ({ 
  businessName = "Aashu Marine Equipment"
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Your Google Maps Embed URL
  const mapUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29641.80091098827!2d72.1235442098189!3d21.7715468744637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5b1f2f6421c1%3A0x43a34be947e94042!2sGoodCap%20Digital%20Services%20Private%20limited!5e0!3m2!1sen!2sin!4v1774507630529!5m2!1sen!2sin";

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className="map-embed">
      <div className="map-container">
        {!isLoaded && (
          <div className="map-loading">
            Loading map...
          </div>
        )}

        <iframe
          title={`Map showing location of ${businessName}`}
          src={mapUrl}
          className="map-iframe"
          onLoad={handleLoad}
          loading="lazy"
          style={{ border: 0 }}
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default MapEmbed;