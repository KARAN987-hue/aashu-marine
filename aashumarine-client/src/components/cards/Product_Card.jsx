import React, { useRef } from "react";
import "./Product_Card.css";

const Product_Card = ({
  image,
  imageUrl,
  name,
  engineType,
  manufacturer,
  onClick,
}) => {
  const cardRef = useRef(null);

  const imageSrc = imageUrl || image;
  // console.log("imgSRC---> ", imageSrc)

  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='18' fill='%23999'%3ENo Image%3C/text%3E%3C/svg%3E`;

  const handleMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y - rect.height / 2) / rect.height) * 12;
    const rotateY = ((x - rect.width / 2) / rect.width) * -12;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
  };

  const reset = () => {
    cardRef.current.style.transform = "rotateX(0) rotateY(0) scale(1)";
  };

  return (
    <div
      ref={cardRef}
      className="product-card"
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onClick={onClick}
    >
      <div className="product-card__shine"></div>

      <div className="product-card__image">
        <img
          src={imageSrc || placeholderSvg}
          alt={`${name}${engineType ? ` - ${engineType}` : ""}`}
          loading="lazy"
          onError={(e) => (e.target.src = placeholderSvg)}
        />
      </div>

      <div className="product-card__content">
        <h3 className="product-card__name">{name}</h3>

        {engineType && (
          <p className="product-card__engine-type">{engineType}</p>
        )}

        {manufacturer && (
          <p className="product-card__manufacturer">{manufacturer}</p>
        )}
      </div>
    </div>
  );
};

export default Product_Card;