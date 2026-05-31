import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { navItems } from '../data/dummyData';
import './Not_Found_Page.css';

const Not_Found_Page = () => {
  return (
    <div className="not-found-page">
      {/* Navbar for easy navigation */}
      <Navbar navItems={navItems} />
      
      {/* Main content */}
      <main className="not-found-content">
        <h1 className="not-found-heading">404 - Page Not Found</h1>
        <p className="not-found-message">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="home-link">
          Return to Home
        </Link>
      </main>
      
      {/* Footer section */}
      <Footer />
    </div>
  );
};

export default Not_Found_Page;
