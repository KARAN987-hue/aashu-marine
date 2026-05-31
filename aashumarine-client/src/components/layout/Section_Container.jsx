import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import "./Section_Container.css";

const Section_Container = ({
  heading,
  subheading,
  children,
  bgVideo = false,
  videoSrc = ""
}) => {
  const sectionRef = useRef(null);

  const headingId = heading
    ? `section-heading-${heading.toLowerCase().replace(/\s+/g, "-")}`
    : undefined;

  useEffect(() => {
    const section = sectionRef.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.classList.add("section-visible");
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`section-container ${bgVideo ? "video-bg-section" : ""}`}
      aria-labelledby={headingId}
    >
      {/* Background Video */}
      {bgVideo && (
        <video
          className="section-bg-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Dark overlay for readability */}
      {bgVideo && <div className="video-overlay"></div>}

      {/* Decorative Background */}
      {!bgVideo && (
        <>
          <div className="section-bg-blur blur1"></div>
          <div className="section-bg-blur blur2"></div>
        </>
      )}

      <div className="section-content">
        {heading && (
          <h2 id={headingId} className="section-heading">
            {heading}
          </h2>
        )}

        {subheading && (
          // <p className="section-subheading">{subheading}</p>
      <p className={`section-subheading ${bgVideo ? "section-subheading-white" : ""}`}>{subheading}</p>
        )}

        <div className="section-children">{children}</div>
      </div>
    </section>
  );
};

Section_Container.propTypes = {
  heading: PropTypes.string,
  subheading: PropTypes.string,
  children: PropTypes.node.isRequired,
  bgVideo: PropTypes.bool,
  videoSrc: PropTypes.string
};

export default Section_Container;