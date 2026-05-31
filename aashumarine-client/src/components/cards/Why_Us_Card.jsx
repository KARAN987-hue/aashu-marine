import React from 'react';
import PropTypes from 'prop-types';
import AnimationWrapper from '../AnimationWrapper';
import './Why_Us_Card.css';

const Why_Us_Card = ({ icon, heading, description, animationDelay = 0 }) => {
  return (
    <AnimationWrapper animationType="fade-in" duration={800} delay={animationDelay}>
      <div className="why-us-card">
        <div className="why-us-card__icon" aria-hidden="true">
          {typeof icon === 'string' ? (
            <img src={icon} alt="" />
          ) : (
            icon
          )}
        </div>
        <h3 className="why-us-card__heading">{heading}</h3>
        <p className="why-us-card__description">{description}</p>
      </div>
    </AnimationWrapper>
  );
};

Why_Us_Card.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  heading: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  animationDelay: PropTypes.number,
};

export default Why_Us_Card;
