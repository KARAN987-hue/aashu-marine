import ship from '../assets/images/ship-machinery.avif'
import electronic from '../assets/images/electronic.avif'
import provision from '../assets/images/provision.avif'
import life from '../assets/images/life.avif'
import quality from '../assets/images/quality.avif'
import support from '../assets/images/support.avif'
import response from '../assets/images/response.avif'
import around from '../assets/images/around.avif'
// ----------
import facebookIcon from '../assets/images/facebookIcon.png';
import twitterIcon from '../assets/images/twitterIcon.png';
import linkedinIcon from '../assets/images/linkedinIcon.png';
import instagramIcon from '../assets/images/instagramIcon.png';


// Navigation Items
export const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About Us', path: '/about' },
  { label: 'Products', path: '/products' },
  { label: 'Contact', path: '/contact' }
];

// Services Data
export const services = [
  {
    id: 1,
    icon: ship,
    heading: 'Ship Machinery Supply',
    description: 'Comprehensive supply of high-quality ship machinery and equipment for all vessel types, ensuring optimal performance and reliability at sea.'
  },
  {
    id: 2,
    icon: electronic,
    heading: 'Spare Parts Distribution',
    description: 'Extensive inventory of genuine spare parts for marine engines, pumps, and auxiliary systems with fast delivery worldwide.'
  },
  {
    id: 3,
    icon: provision,
    heading: 'Technical Support',
    description: 'Expert technical consultation and support services to help you select the right equipment and maintain your marine systems efficiently.'
  },
  {
    id: 4,
    icon: life,
    heading: 'Maintenance Solutions',
    description: 'Comprehensive maintenance and repair solutions for marine equipment, ensuring minimal downtime and maximum operational efficiency.'
  },

  // New Services

  {
    id: 5,
    icon: ship,
    heading: 'Marine Engine Overhaul',
    description: 'Professional overhaul and servicing of marine diesel engines, ensuring optimal efficiency, reliability, and long service life.'
  },
  {
    id: 6,
    icon: electronic,
    heading: 'Navigation Equipment Supply',
    description: 'Supply of advanced navigation systems including radar, GPS, AIS, and communication equipment for safe and efficient maritime operations.'
  }
];

// Products Data
export const products = [
  {
    id: 1,
    productName: 'Marine Diesel Engine MAN B&W 6S50MC',
    image: 'https://static.wixstatic.com/media/0dbecc_577a65c6c2fa4ed1b6f2594489c78e8d~mv2.jpeg/v1/fill/w_459,h_281,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0dbecc_577a65c6c2fa4ed1b6f2594489c78e8d~mv2.jpeg',
    category: 'Engines',
    productType: 'Main Propulsion Engine',
    manufacturer: 'MAN Energy Solutions',
    condition: 'New',
    model: '6S50MC',
    searchKeyword: 'diesel engine, main engine, propulsion, MAN, 6S50MC',
    shortDescription: 'High-performance marine diesel engine suitable for cargo ships and tankers, offering exceptional fuel efficiency and durability.',
    mainDescription: 'The MAN B&W 6S50MC is a two-stroke, low-speed marine diesel engine designed for main propulsion in medium to large cargo vessels. With a bore of 500mm and stroke of 2000mm, this 6-cylinder engine delivers reliable power output of approximately 9,480 kW at 127 RPM. The engine features advanced fuel injection technology, optimized combustion chamber design, and robust construction for extended service life. Suitable for container ships, bulk carriers, and tankers operating on international routes. Complies with IMO Tier II emission standards and can be upgraded to Tier III with SCR system.',
    createdDate: '2024-01-15T10:30:00Z',
    updatedDate: '2024-01-20T14:45:00Z',
    owner: 'Aashumarine Equipment Division'
  },
  {
    id: 2,
    productName: 'Hydraulic Steering Gear System',
    image: 'https://static.wixstatic.com/media/0dbecc_36d206167dee4ab3b2918de1ed058e71~mv2.jpeg/v1/fill/w_375,h_375,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0dbecc_36d206167dee4ab3b2918de1ed058e71~mv2.jpeg',
    category: 'Hydraulics',
    productType: 'Steering System',
    manufacturer: 'Kawasaki Heavy Industries',
    condition: 'Refurbished',
    model: 'KHI-SG-2500',
    searchKeyword: 'hydraulic pump, steering gear, rudder control, Kawasaki',
    shortDescription: 'Advanced hydraulic pump system for ship steering and cargo handling operations with reliable performance in harsh marine environments.',
    mainDescription: 'The Kawasaki KHI-SG-2500 hydraulic steering gear system provides precise rudder control for vessels up to 50,000 DWT. This refurbished unit has been completely overhauled with new seals, bearings, and hydraulic components. The system features dual pump configuration for redundancy, automatic changeover capability, and integrated control panel with digital monitoring. Maximum working pressure of 250 bar with flow rate of 180 L/min ensures responsive steering even in heavy seas. Includes emergency manual operation capability and complies with SOLAS requirements for steering gear systems.',
    createdDate: '2024-01-18T09:15:00Z',
    updatedDate: '2024-01-25T11:20:00Z',
    owner: 'Aashumarine Hydraulics Department'
  },
  {
    id: 3,
    productName: 'Marine Radar Navigation System',
    image: 'https://static.wixstatic.com/media/0dbecc_8594a115ffc646c48018d7d790601eea~mv2.jpeg/v1/fill/w_375,h_375,al_c,q_80,usm_0.66_1.00_0.01,enc_avif,quality_auto/0dbecc_8594a115ffc646c48018d7d790601eea~mv2.jpeg',
    category: 'Electronics',
    productType: 'Navigation Equipment',
    manufacturer: 'Furuno Electric',
    condition: 'New',
    model: 'FAR-2228',
    searchKeyword: 'radar, navigation, ARPA, Furuno, collision avoidance',
    shortDescription: 'State-of-the-art navigation and communication equipment ensuring safe and efficient maritime operations.',
    mainDescription: 'The Furuno FAR-2228 is a 25kW X-band radar system with integrated ARPA (Automatic Radar Plotting Aid) functionality. Features a 10.4-inch high-resolution color LCD display with customizable presentation modes, target tracking for up to 100 objects, and advanced signal processing for superior target detection in all weather conditions. The system includes collision avoidance algorithms, guard zone alarms, and electronic bearing lines. Compatible with ECDIS integration and supports AIS target overlay. IMO and IEC type-approved for SOLAS vessels. Includes 6-foot open array antenna with 45 RPM rotation speed for rapid target acquisition.',
    createdDate: '2024-01-22T13:00:00Z',
    updatedDate: '2024-01-22T13:00:00Z',
    owner: 'Aashumarine Electronics Division'
  }
];

// Why Us Reasons
export const whyUsReasons = [
  {
    id: 1,
    icon: quality,
    heading: 'Premium Quality',
    description: 'We supply only genuine, certified marine equipment from trusted manufacturers, ensuring reliability and longevity.'
  },
  {
    id: 2,
    icon: support,
    heading: 'Industry Experience',
    description: 'Over 20 years of experience in marine equipment supply, serving clients across the globe with expertise and dedication.'
  },
  {
    id: 3,
    icon: response,
    heading: 'Fast Delivery',
    description: 'Efficient logistics network ensuring timely delivery of equipment and spare parts to ports worldwide.'
  },
  {
    id: 4,
    icon: around,
    heading: '24/7 Customer Support',
    description: 'Round-the-clock customer support to address your queries and provide technical assistance whenever you need it.'
  },
  {
    id: 5,
    icon: around,
    heading: 'Competitive Pricing',
    description: 'Best market prices without compromising on quality, helping you optimize operational costs effectively.'
  },
  {
  id: 6,
  icon: around,
  heading: 'Global Network',
  description: 'Strong global supplier network enabling efficient sourcing and delivery of marine equipment to major ports worldwide.'
}
];

// Testimonials Data
export const testimonials = [
  {
    id: 1,
    name: 'Captain James Morrison',
    company: 'Pacific Shipping Lines',
    text: 'Aashumarine has been our trusted partner for marine equipment supply for over 5 years. Their product quality and customer service are exceptional.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah Chen',
    company: 'Global Maritime Solutions',
    text: 'The technical expertise and prompt delivery from Aashumarine have helped us maintain our fleet efficiently. Highly recommended!',
    rating: 5
  },
  {
    id: 3,
    name: 'Michael Rodriguez',
    company: 'Atlantic Cargo Services',
    text: 'Outstanding service and genuine spare parts. Aashumarine understands the urgency of marine operations and always delivers on time.',
    rating: 5
  },
  {
    id: 4,
    name: 'Emma Thompson',
    company: 'Nordic Shipping Co.',
    text: 'Professional team with deep knowledge of marine equipment. They helped us find the perfect solutions for our vessel requirements.',
    rating: 4
  }
];

// Footer Data
export const footerData = {
  company: {
    name: 'Aashumarine',
    tagline: 'Your Trusted Marine Equipment Partner',
    description: 'Leading supplier of premium marine equipment, spare parts, and technical solutions for the global maritime industry. Committed to excellence and reliability since 2004.'
  },
  contact: {
    // address: 'Kumbharwada, Bhavnagar, Gujarat, India',
    address: 'Revenue Survey No 434/1,3 Plot No 12/B Amar CO OP.HO Society Gadhechi Road, Bhavnagar-364001 Gujarat India',
    phone: '+91 8320431691',
    email1: 'aashu.marines@gmail.com',
    email2: 'info.aashumarine@gmail.com',
    hours: 'Mon - Sat: 9:00 AM - 6:00 PM'
  },
  quickLinks: [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    { label: 'Products', path: '/products' },
    { label: 'Contact', path: '/contact' }
  ],
  socialMedia: [
    { platform: 'Facebook', url: '#', icon: facebookIcon },
    { platform: 'Twitter', url: '#', icon: twitterIcon },
    { platform: 'LinkedIn', url: '#', icon: linkedinIcon },
    { platform: 'Instagram', url: '#', icon: instagramIcon }
  ],
  mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29641.80091098827!2d72.1235442098189!3d21.7715468744637!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395f5b1f2f6421c1%3A0x43a34be947e94042!2sGoodCap%20Digital%20Services%20Private%20limited!5e0!3m2!1sen!2sin!4v1774507630529!5m2!1sen!2sin",
  copyright: `© ${new Date().getFullYear()} Aashumarine. All rights reserved.`
};
