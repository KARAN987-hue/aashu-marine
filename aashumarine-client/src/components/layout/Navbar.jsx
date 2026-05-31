import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import logo from '../../assets/images/Logo.avif';
import './Navbar.css';

function Navbar({ navItems }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-container">
        <div className="navbar-brand">
          <img src={logo} alt="Aashumarine Logo" className="brand-logo" />
          <span className="brand-name">Aashumarine</span>
        </div>
        
        <button 
          className="hamburger-menu"
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`hamburger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>

        {/* Mobile menu overlay */}
        <div 
          className={`navbar-overlay ${isMenuOpen ? 'open' : ''}`}
          onClick={closeMenu}
          aria-hidden="true"
        ></div>

        <ul className={`navbar-menu ${isMenuOpen ? 'open' : ''}`} role="menubar">
          {navItems.map((item, index) => (
            <li key={index} className="navbar-item" role="none">
              <Link 
                to={item.path} 
                className={`navbar-link ${location.pathname === item.path ? 'active' : ''}`}
                role="menuitem"
                aria-label={`Navigate to ${item.label}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

Navbar.propTypes = {
  navItems: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Navbar;
