import React, { useRef } from "react";
import "./Service_Card.css";

const Service_Card = ({ icon, heading, description }) => {
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 8;
    const rotateY = ((x - centerX) / centerX) * -8;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
  };

  return (
    <div
      className="service-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="service-card__glow"></div>

      <div className="service-card__icon">
        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
      </div>

      <h3 className="service-card__heading">{heading}</h3>

      <p className="service-card__description">{description}</p>
    </div>
  );
};

export default Service_Card;