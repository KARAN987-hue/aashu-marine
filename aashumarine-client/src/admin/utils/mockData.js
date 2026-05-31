/**
 * Mock Data Generators for Testing
 * 
 * Provides realistic mock data for all admin panel resources:
 * - Products (20+ items)
 * - Testimonials (10+ items)
 * - Leads (15+ items)
 * - Quotes (15+ items)
 * - Subscribers (30+ items)
 */

// Helper function to generate random date within last N days
const randomDate = (daysAgo = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
};

// Helper function to pick random item from array
const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];

// Product mock data generators
const categories = [
  'Main Engine',
  'Auxiliary Engine',
  'Steering Gear',
  'Pumps',
  'Compressors',
  'Heat Exchangers',
  'Valves',
  'Electrical Equipment',
];

const manufacturers = [
  'MAN B&W',
  'Wärtsilä',
  'Mitsubishi',
  'Yanmar',
  'Daihatsu',
  'Caterpillar',
  'Cummins',
  'Rolls-Royce',
];

const conditions = ['New', 'Refurbished', 'Used'];

const productTypes = [
  'Diesel Engine',
  'Gas Engine',
  'Hydraulic System',
  'Centrifugal Pump',
  'Screw Compressor',
  'Plate Heat Exchanger',
  'Globe Valve',
  'Generator',
];

export const generateMockProducts = (count = 20) => {
  const products = [];
  
  for (let i = 1; i <= count; i++) {
    const category = randomItem(categories);
    const manufacturer = randomItem(manufacturers);
    const condition = randomItem(conditions);
    const productType = randomItem(productTypes);
    const isActive = Math.random() > 0.2; // 80% active
    
    products.push({
      product_id: i,
      product_name: `${manufacturer} ${productType} Model ${1000 + i}`,
      category,
      product_type: productType,
      manufacturer,
      condition,
      model: `${manufacturer.substring(0, 3).toUpperCase()}-${1000 + i}`,
      short_description: `High-performance ${productType.toLowerCase()} for marine applications`,
      main_description: `This ${productType.toLowerCase()} from ${manufacturer} offers exceptional reliability and efficiency. Designed for demanding marine environments, it features advanced technology and robust construction. Suitable for various vessel types including cargo ships, tankers, and passenger vessels.`,
      search_keyword: `${manufacturer} ${productType} ${category} marine equipment`,
      owner: randomItem(['Aashumarine', 'Partner Supplier', 'Direct Import']),
      is_active: isActive,
      image_url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(productType)}`,
      price: Math.floor(Math.random() * 90000) + 10000, // $10k - $100k
      stock_quantity: Math.floor(Math.random() * 20) + 1,
      created_at: randomDate(90),
      updated_at: randomDate(30),
    });
  }
  
  return products;
};

// Testimonial mock data generators
const testimonialNames = [
  'John Smith',
  'Maria Garcia',
  'Ahmed Hassan',
  'Li Wei',
  'Sarah Johnson',
  'Carlos Rodriguez',
  'Yuki Tanaka',
  'Emma Wilson',
  'Mohammed Ali',
  'Anna Kowalski',
  'David Chen',
  'Sofia Martinez',
];

const companies = [
  'Pacific Shipping Co.',
  'Atlantic Marine Services',
  'Global Logistics Ltd.',
  'Ocean Transport Inc.',
  'Maritime Solutions Group',
  'Coastal Freight Lines',
  'International Cargo Services',
  'Blue Wave Shipping',
  'Harbor Logistics',
  'Seaborne Transport',
];

const testimonialTexts = [
  'Excellent service and high-quality products. The team at Aashumarine went above and beyond to ensure our needs were met. Highly recommended!',
  'We have been working with Aashumarine for over 5 years and they never disappoint. Their expertise in marine equipment is unmatched.',
  'Fast delivery and competitive prices. The technical support team is very knowledgeable and always available to help.',
  'Outstanding quality and reliability. We trust Aashumarine for all our critical marine equipment needs.',
  'Professional service from start to finish. The products exceeded our expectations and arrived on time.',
  'Great experience working with this company. They understand the marine industry and provide excellent solutions.',
  'Reliable partner for marine spare parts. Their inventory is extensive and delivery is always prompt.',
  'Top-notch customer service. They helped us find the exact parts we needed for our vessel.',
  'Highly professional team with deep knowledge of marine equipment. Would definitely recommend to others.',
  'Exceptional quality products at fair prices. Aashumarine has become our go-to supplier.',
];

export const generateMockTestimonials = (count = 10) => {
  const testimonials = [];
  
  for (let i = 1; i <= count; i++) {
    const isApproved = Math.random() > 0.3; // 70% approved
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars
    
    testimonials.push({
      testimonial_id: i,
      name: randomItem(testimonialNames),
      company: randomItem(companies),
      text: randomItem(testimonialTexts),
      rating,
      is_approved: isApproved,
      created_at: randomDate(60),
    });
  }
  
  return testimonials;
};

// Contact Lead mock data generators
const leadNames = [
  'Robert Anderson',
  'Jennifer Lee',
  'Michael Brown',
  'Patricia Davis',
  'James Wilson',
  'Linda Martinez',
  'William Taylor',
  'Elizabeth Thomas',
  'David Moore',
  'Barbara Jackson',
  'Richard White',
  'Susan Harris',
  'Joseph Martin',
  'Jessica Thompson',
  'Thomas Garcia',
];

const leadMessages = [
  'I am interested in purchasing marine diesel engines for our fleet. Please send me a quote.',
  'We need spare parts for our MAN B&W engine. Can you help us source these items?',
  'Looking for a reliable supplier of marine equipment. Please contact me to discuss our requirements.',
  'Our vessel requires urgent maintenance. Do you have hydraulic steering gear systems in stock?',
  'Interested in your heat exchanger products. Please provide technical specifications and pricing.',
  'We are expanding our fleet and need multiple engines. Can we schedule a meeting?',
  'Need replacement parts for Wärtsilä engine. What is your delivery time?',
  'Looking for competitive quotes on marine pumps and compressors.',
  'Can you provide maintenance services for marine equipment?',
  'Interested in establishing a long-term partnership for marine spare parts supply.',
];

const sources = ['Website Contact Form', 'Email', 'Phone', 'Trade Show', 'Referral'];
const statuses = ['new', 'contacted', 'converted', 'closed'];

export const generateMockLeads = (count = 15) => {
  const leads = [];
  
  for (let i = 1; i <= count; i++) {
    const name = randomItem(leadNames);
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
    const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    
    leads.push({
      lead_id: i,
      name,
      email,
      phone,
      message: randomItem(leadMessages),
      source: randomItem(sources),
      status: randomItem(statuses),
      created_at: randomDate(45),
    });
  }
  
  return leads;
};

// Quote Request mock data generators
const quoteMessages = [
  'Please provide a quote for 2 units of marine diesel engines with delivery to Singapore port.',
  'We need pricing for hydraulic steering gear system including installation.',
  'Requesting quote for annual maintenance contract for our fleet of 5 vessels.',
  'Need urgent quote for replacement parts - engine overhaul kit.',
  'Please quote for heat exchanger and associated piping materials.',
  'Looking for best price on centrifugal pumps - quantity 10 units.',
  'Quote needed for complete electrical panel replacement.',
  'Interested in purchasing refurbished main engine. Please provide details and pricing.',
  'Need quote for emergency spare parts delivery to our vessel in Dubai.',
  'Requesting competitive pricing for long-term supply agreement.',
];

export const generateMockQuotes = (count = 15) => {
  const quotes = [];
  const products = generateMockProducts(20);
  
  for (let i = 1; i <= count; i++) {
    const name = randomItem(leadNames);
    const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
    const phone = `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`;
    const product = randomItem(products);
    
    quotes.push({
      quote_id: i,
      customer_name: name,
      email,
      phone,
      message: randomItem(quoteMessages),
      product_name: product.product_name,
      product_id: product.product_id,
      source: randomItem(sources),
      status: randomItem(statuses),
      created_at: randomDate(45),
    });
  }
  
  return quotes;
};

// Newsletter Subscriber mock data generators
const emailDomains = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'company.com',
  'maritime.com',
  'shipping.com',
  'marine.com',
];

const firstNames = [
  'Alex', 'Sam', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Avery',
  'Quinn', 'Reese', 'Skyler', 'Dakota', 'Peyton', 'Cameron', 'Drew',
  'Blake', 'Sage', 'River', 'Phoenix', 'Rowan', 'Finley', 'Hayden',
  'Emerson', 'Parker', 'Charlie', 'Kai', 'Rory', 'Ash', 'Jules', 'Max',
];

export const generateMockSubscribers = (count = 30) => {
  const subscribers = [];
  const usedEmails = new Set();
  
  for (let i = 1; i <= count; i++) {
    let email;
    let attempts = 0;
    
    // Generate unique email
    do {
      const firstName = randomItem(firstNames);
      const lastName = randomItem(leadNames).split(' ')[1];
      const domain = randomItem(emailDomains);
      const suffix = attempts > 0 ? attempts : '';
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${suffix}@${domain}`;
      attempts++;
    } while (usedEmails.has(email) && attempts < 100);
    
    usedEmails.add(email);
    const isActive = Math.random() > 0.15; // 85% active
    
    subscribers.push({
      subscriber_id: i,
      email,
      is_active: isActive,
      subscribed_at: randomDate(180),
    });
  }
  
  return subscribers;
};

// Dashboard statistics mock data
export const generateMockDashboardStats = () => {
  const products = generateMockProducts(50);
  const testimonials = generateMockTestimonials(20);
  const leads = generateMockLeads(30);
  const quotes = generateMockQuotes(25);
  const subscribers = generateMockSubscribers(100);
  
  return {
    totalProducts: products.filter(p => p.is_active).length,
    pendingTestimonials: testimonials.filter(t => !t.is_approved).length,
    newLeads: leads.filter(l => l.status === 'new').length,
    newQuotes: quotes.filter(q => q.status === 'new').length,
    activeSubscribers: subscribers.filter(s => s.is_active).length,
  };
};

// Recent activity mock data
export const generateMockRecentActivity = () => {
  const leads = generateMockLeads(20);
  const quotes = generateMockQuotes(20);
  const testimonials = generateMockTestimonials(15);
  
  // Sort by created_at and take top 5
  const sortByDate = (a, b) => new Date(b.created_at) - new Date(a.created_at);
  
  return {
    recentLeads: leads.sort(sortByDate).slice(0, 5),
    recentQuotes: quotes.sort(sortByDate).slice(0, 5),
    recentTestimonials: testimonials.sort(sortByDate).slice(0, 5),
  };
};

// Export all generators
export default {
  generateMockProducts,
  generateMockTestimonials,
  generateMockLeads,
  generateMockQuotes,
  generateMockSubscribers,
  generateMockDashboardStats,
  generateMockRecentActivity,
};
