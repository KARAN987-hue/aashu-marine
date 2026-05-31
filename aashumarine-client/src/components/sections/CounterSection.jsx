import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "./CounterSection.css";

const CounterSection = ({ counters, animationDuration = 2000 }) => {
  const [animatedValues, setAnimatedValues] = useState({});
  const sectionRef = useRef(null);
  const animationFrameRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  // Ease-out function
  const easeOut = (t) => {
    return 1 - Math.pow(1 - t, 3);
  };

  const startAnimation = () => {
    if (hasAnimatedRef.current) return;
    hasAnimatedRef.current = true;

    const startTime = performance.now();

    const animate = (time) => {
      const elapsed = time - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);
      const eased = easeOut(progress);

      const values = {};

      counters.forEach((counter) => {
        values[counter.id] = Math.floor(counter.targetValue * eased);
      });

      setAnimatedValues(values);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        const finalValues = {};
        counters.forEach((counter) => {
          finalValues[counter.id] = counter.targetValue;
        });
        setAnimatedValues(finalValues);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Reduced motion support
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      const finalValues = {};
      counters.forEach((counter) => {
        finalValues[counter.id] = counter.targetValue;
      });
      setAnimatedValues(finalValues);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(section); // trigger once
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [counters, animationDuration]);

  return (
    <section className="counter-section" ref={sectionRef}>
      <div className="counter-section__container">
        {counters.map((counter) => (
          <div key={counter.id} className="counter-section__item">
            {counter.icon && (
              <div className="counter-section__icon" aria-hidden="true">
                {typeof counter.icon === "string" ? (
                  <img src={counter.icon} alt="" />
                ) : (
                  counter.icon
                )}
              </div>
            )}

            <div className="counter-section__value" aria-live="polite">
              <span className="counter-section__number">
                {animatedValues[counter.id] ?? 0}
              </span>

              {counter.suffix && (
                <span className="counter-section__suffix">
                  {counter.suffix}
                </span>
              )}
            </div>

            <div className="counter-section__label">
              {counter.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

CounterSection.propTypes = {
  counters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      targetValue: PropTypes.number.isRequired,
      suffix: PropTypes.string,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    })
  ).isRequired,
  animationDuration: PropTypes.number,
};

export default CounterSection;