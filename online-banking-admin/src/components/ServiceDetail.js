import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './style.css';

const serviceData = {
  personal: {
    title: 'Personal Banking',
    icon: '💰',
    iconClass: 'service-icon-personal',
    description: 'Our personal banking services are designed to make your financial life easier and more secure.',
    features: [
      'Online account management with 24/7 access',
      'Mobile banking app for on-the-go financial management',
      'Secure digital transactions with multi-factor authentication',
      'Personalized savings plans with competitive interest rates',
      'Automated bill payments and recurring transfers',
      'Real-time transaction alerts and notifications'
    ],
    benefits: 'With Vardhan Bank personal banking, you get the convenience of modern digital banking combined with the security and reliability you expect from a trusted financial institution. Our intuitive online platform makes it easy to manage your money, track your spending, and plan for your financial future.',
    plans: [
      { name: 'Basic Savings', fee: '₹0/month', features: ['No minimum balance', 'Free digital transactions', 'Basic interest rates'] },
      { name: 'Premium Savings', fee: '₹250/month', features: ['Priority customer service', 'Higher interest rates', 'Free international ATM withdrawals'] },
      { name: 'Wealth Management', fee: '₹1000/month', features: ['Dedicated relationship manager', 'Premium investment options', 'Exclusive banking hours'] }
    ],
    testimonials: [
      { name: 'Rahul Sharma', position: 'Software Engineer', quote: 'The mobile banking app has transformed how I manage my finances. I can track expenses, transfer funds, and pay bills all from my phone!' },
      { name: 'Priya Patel', position: 'Small Business Owner', quote: 'I\'ve been with Vardhan Bank for over 5 years, and their personal banking services have always been reliable and user-friendly.' }
    ],
    faqs: [
      { question: 'How do I open a personal account?', answer: 'You can open an account online through our website, through our mobile app, or by visiting any of our branches with valid ID proof and address verification.' },
      { question: 'What are the interest rates for savings accounts?', answer: 'Our savings account interest rates range from 3.5% to 6.5% depending on the account type and balance maintained.' },
      { question: 'Is mobile banking secure?', answer: 'Yes, our mobile banking platform uses industry-leading encryption and multi-factor authentication to ensure your financial information remains secure.' }
    ]
  },
  business: {
    title: 'Business Banking',
    icon: '💼',
    iconClass: 'service-icon-business',
    description: 'Our business banking solutions are tailored to help your company thrive in today\'s competitive market.',
    features: [
      'Dedicated business accounts with specialized features',
      'Merchant services and payment processing solutions',
      'Business credit cards with rewards programs',
      'Cash management tools for improved liquidity',
      'Payroll services integration',
      'International banking and foreign exchange services'
    ],
    benefits: 'Vardhan Bank understands the unique challenges businesses face. Our comprehensive business banking services provide the financial tools and support you need to manage cash flow, streamline operations, and fuel growth. From startups to established enterprises, we offer scalable solutions that evolve with your business.',
    plans: [
      { name: 'Startup Business', fee: '₹500/month', features: ['Low transaction fees', 'Basic merchant services', 'Online banking portal'] },
      { name: 'Growing Business', fee: '₹1500/month', features: ['Advanced cash flow management', 'Discounted international transfers', 'Dedicated account manager'] },
      { name: 'Enterprise Solutions', fee: 'Custom pricing', features: ['Tailored financial solutions', 'Priority banking services', 'Advanced API integration'] }
    ],
    testimonials: [
      { name: 'Vikram Mehta', position: 'CEO, TechSolutions India', quote: 'Vardhan Bank\'s business banking services have been instrumental in our company\'s growth. Their cash management tools have optimized our operations significantly.' },
      { name: 'Ananya Desai', position: 'Founder, Organic Foods Co.', quote: 'The dedicated relationship manager understands our business needs and provides customized solutions that have helped us expand to new markets.' }
    ],
    faqs: [
      { question: 'What documents are required to open a business account?', answer: 'Required documents include business registration certificate, PAN card, address proof, identity proof of directors/partners, and business activity proof.' },
      { question: 'Do you offer specialized accounts for startups?', answer: 'Yes, we have tailored startup packages with reduced minimum balance requirements and special fee structures to support new businesses.' },
      { question: 'Can I integrate my accounting software with your banking platform?', answer: 'Yes, our business banking platform offers API integration with popular accounting software like Tally, QuickBooks, and Zoho Books.' }
    ]
  },
  loans: {
    title: 'Loans & Mortgages',
    icon: '🏦',
    iconClass: 'service-icon-loans',
    description: 'Our loan and mortgage options offer competitive rates and flexible terms to meet your financial needs.',
    features: [
      'Home loans with competitive interest rates',
      'Personal loans for various needs',
      'Business loans for expansion and operations',
      'Auto loans with quick approval process',
      'Education loans for higher studies',
      'Flexible repayment options tailored to your situation'
    ],
    benefits: 'Whether you\'re buying a home, financing education, or growing your business, Vardhan Bank offers loan solutions with transparent terms and personalized guidance. Our loan specialists work with you to understand your goals and find the right financing option with rates and terms that fit your budget.',
    plans: [
      { name: 'Home Loan', fee: 'Processing fee: 0.5%', features: ['Interest rates from 7.5%', 'Loan tenure up to 30 years', 'Up to 85% financing'] },
      { name: 'Personal Loan', fee: 'Processing fee: 1%', features: ['Interest rates from 10.5%', 'Quick disbursement', 'Minimal documentation'] },
      { name: 'Business Loan', fee: 'Processing fee: 1.5%', features: ['Customized repayment options', 'Working capital financing', 'Asset-based lending'] }
    ],
    testimonials: [
      { name: 'Suresh Kumar', position: 'Government Employee', quote: 'The home loan process was smooth and transparent. The representative explained all terms clearly and helped me choose the best option for my budget.' },
      { name: 'Meera Joshi', position: 'Doctor', quote: 'I got an education loan for my daughter\'s overseas studies. The interest rates were competitive and the approval was quick.' }
    ],
    faqs: [
      { question: 'How long does the loan approval process take?', answer: 'Most loan applications are processed within 3-5 business days, with disbursement following shortly after approval.' },
      { question: 'Can I make prepayments on my loan?', answer: 'Yes, you can make prepayments on your loan. Home loans have no prepayment penalties after 6 months, while personal loans may have a nominal fee.' },
      { question: 'What is the maximum loan amount I can get?', answer: 'Loan amounts vary based on the type of loan, your income, credit score, and repayment capacity. Home loans can go up to ₹5 crore, personal loans up to ₹50 lakh, and business loans up to ₹10 crore.' }
    ]
  },
  investment: {
    title: 'Investment Services',
    icon: '📊',
    iconClass: 'service-icon-investment',
    description: 'Our investment services help you build and manage your portfolio for long-term financial growth.',
    features: [
      'Diversified investment options across asset classes',
      'Retirement planning and pension schemes',
      'Mutual funds with various risk profiles',
      'Fixed deposits with attractive returns',
      'Portfolio management services',
      'Regular investment performance reviews'
    ],
    benefits: 'Investing with Vardhan Bank means having access to expert financial advisors who understand the market and can help you make informed decisions. Whether you\'re planning for retirement, saving for a major purchase, or building wealth for the future, our investment services provide the tools and guidance you need to achieve your financial goals.',
    plans: [
      { name: 'Fixed Deposits', fee: 'No fees', features: ['Interest rates up to 7.5%', 'Flexible tenures', 'Loan facility against FD'] },
      { name: 'Mutual Funds', fee: 'As per fund house', features: ['Curated selection of top-performing funds', 'SIP options available', 'Expert fund recommendations'] },
      { name: 'Portfolio Management', fee: '1.5% of assets', features: ['Personalized investment strategy', 'Regular portfolio rebalancing', 'Dedicated wealth manager'] }
    ],
    testimonials: [
      { name: 'Rajiv Malhotra', position: 'Retired Professor', quote: 'The retirement planning services at Vardhan Bank helped me create a stable income stream post-retirement. Their advisors understand the market well.' },
      { name: 'Sunita Agarwal', position: 'Business Owner', quote: 'I\'ve been investing through Vardhan Bank for over a decade. Their diversified portfolio approach has consistently delivered good returns even during market volatility.' }
    ],
    faqs: [
      { question: 'How do I start investing with Vardhan Bank?', answer: 'You can schedule a consultation with our investment advisors either online or at any branch. After understanding your financial goals and risk appetite, they\'ll recommend suitable investment options.' },
      { question: 'What is the minimum amount required to start investing?', answer: 'You can start with as little as ₹1,000 for mutual fund SIPs, ₹10,000 for fixed deposits, and ₹25 lakh for portfolio management services.' },
      { question: 'How often will my portfolio be reviewed?', answer: 'We conduct quarterly portfolio reviews for all investment clients, with more frequent reviews available for premium clients or during significant market events.' }
    ]
  }
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const service = serviceData[serviceId];
  const [openFaqs, setOpenFaqs] = useState([]);
  
  const toggleFaq = (index) => {
    if (openFaqs.includes(index)) {
      setOpenFaqs(openFaqs.filter(item => item !== index));
    } else {
      setOpenFaqs([...openFaqs, index]);
    }
  };
  
  const handleContactSubmit = (e) => {
    e.preventDefault();
    // In a real application, this would send the form data to a server
    alert('Thank you for your inquiry! Our team will contact you shortly.');
    e.target.reset();
  };

  if (!service) {
    return (
      <div className="service-detail-container">
        <div className="section-container">
          <h2>Service Not Found</h2>
          <p>The requested service information is not available.</p>
          <Link to="/" className="btn btn-primary">Return to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="service-detail-container">
      <header className="service-detail-header">
        <div className="header-content">
          <h1>Vardhan Bank</h1>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/login" className="nav-link">Login</Link>
          </div>
        </div>
      </header>

      <div className="section-container">
        <div className="service-detail-content">
          <div className="service-detail-header-content">
            <div className={`service-icon ${service.iconClass}`}>{service.icon}</div>
            <h2>{service.title}</h2>
          </div>
          
          <p className="service-detail-description">{service.description}</p>
          
          <div className="service-detail-features">
            <h3>Key Features</h3>
            <ul>
              {service.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
          </div>
          
          <div className="service-detail-benefits">
            <h3>Benefits</h3>
            <p>{service.benefits}</p>
          </div>
          
          <div className="service-detail-plans">
            <h3>Available Plans</h3>
            <div className="plans-container">
              {service.plans.map((plan, index) => (
                <div key={index} className="plan-card">
                  <h4>{plan.name}</h4>
                  <p className="plan-fee">{plan.fee}</p>
                  <ul>
                    {plan.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>
                  <Link to="/login" className="btn btn-primary btn-sm">Select Plan</Link>
                </div>
              ))}
            </div>
          </div>

          <div className="service-detail-testimonials">
            <h3>What Our Customers Say</h3>
            <div className="testimonials-container">
              {service.testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-card">
                  <div className="testimonial-content">
                    <p>"{testimonial.quote}"</p>
                  </div>
                  <div className="testimonial-author">
                    <div className="testimonial-avatar">{testimonial.name.charAt(0)}</div>
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.position}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="service-detail-faq">
            <h3>Frequently Asked Questions</h3>
            <div className="faq-container">
              {service.faqs.map((faq, index) => (
                <div key={index} className="faq-item">
                  <div className="faq-question" onClick={() => toggleFaq(index)}>
                    <h4>{faq.question}</h4>
                    <span className={`faq-toggle ${openFaqs.includes(index) ? 'open' : ''}`}>+</span>
                  </div>
                  <div className={`faq-answer ${openFaqs.includes(index) ? 'open' : ''}`}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="service-detail-contact">
            <h3>Need More Information?</h3>
            <div className="contact-form-wrapper">
              <form className="service-contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Your Name</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" required />
                </div>
                <div className="form-group">
                  <label htmlFor="message">Your Message</label>
                  <textarea id="message" name="message" rows="4" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
              <div className="contact-info-card">
                <h4>Contact Us Directly</h4>
                <div className="contact-method">
                  <span className="contact-icon">📞</span>
                  <p>1800-123-4567 (Toll Free)</p>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">✉️</span>
                  <p>support@vardhanbank.com</p>
                </div>
                <div className="contact-method">
                  <span className="contact-icon">🕒</span>
                  <p>Monday to Saturday: 9 AM - 6 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="service-detail-cta">
            <Link to="/login" className="btn btn-primary">Get Started</Link>
            <Link to="/" className="btn btn-outline">Back to Home</Link>
          </div>
        </div>
      </div>

      <footer className="home-footer">
        <div className="footer-content">
          <p>&copy; 2023 Vardhan Bank. All rights reserved.</p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ServiceDetail;