import PropTypes from 'prop-types';
import './Hero_Section.css';

// Background image imports
import bgImage1 from '../../assets/images/hero-section-bg-image1.jpg';
import bgImage2 from '../../assets/images/hero-section-bg-image2.jpg';
import bgImage3 from '../../assets/images/hero-section-bg-image3.jpg';
import bgImage4 from '../../assets/images/hero-section-bg-image4.png';
import bgImage5 from '../../assets/images/hero-section-bg-image5.jpg';
import bgImage6 from '../../assets/images/hero-section-bg-image6.avif';
import AutoSlideTile from '../cards/AutoSlideTile';

// Image mapper - maps BGimageNumber (1-5) to image references
const BACKGROUND_IMAGES = {
  1: bgImage1,
  2: bgImage2,
  3: bgImage3,
  4: bgImage4,
  5: bgImage5,
  6: bgImage6
};

/**
 * Hero_Section component displays the primary value proposition and welcome message
 * 
 * @param {Object} props - Component props
 * @param {string} props.heading - Main heading text
 * @param {string} props.subheading - Supporting subheading text
 * @param {number} props.BGimageNumber - Background image selector (1-5), defaults to 1
 */
const Hero_Section = ({ heading, subheading, BGimageNumber = 1, heightFull }) => {
  // Validate and select background image (default to 1 if invalid)
  const imageNumber = (BGimageNumber >= 1 && BGimageNumber <= 5) ? BGimageNumber : 1;
  const backgroundImage = BACKGROUND_IMAGES[imageNumber];
  
  // Apply background image as inline style
  const sectionStyle = {
    backgroundImage: `url(${backgroundImage})`
  };
  
  return (
    <>
    {/* <section className="hero-section" style={sectionStyle} aria-label="Hero banner"> */}
    <section className={`hero-section ${heightFull === 1 ? "hero-section-full" : ""}`}  style={sectionStyle} aria-label="Hero banner">
      <div className="hero-content">
        <h1 className="hero-heading">{heading}</h1>
        <p className="hero-subheading">{subheading}</p>
      </div>
    </section>
    <AutoSlideTile />
    </>
  );
};

Hero_Section.propTypes = {
  heading: PropTypes.string.isRequired,
  subheading: PropTypes.string.isRequired,
  BGimageNumber: PropTypes.number
};

Hero_Section.defaultProps = {
  BGimageNumber: 1
};

export default Hero_Section;
