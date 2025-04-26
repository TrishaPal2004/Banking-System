import React from 'react';
import { Link } from 'react-router-dom';
import './style.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-content">
          <h1>Vardhan Bank</h1>
          <div className="nav-links">
            <Link to="/login" className="nav-link">Login</Link>
            <a href="#services" className="nav-link">Services</a>
            <a href="#about" className="nav-link">About</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h2>Banking Made Simple</h2>
          <p className="hero-subtitle">Secure, reliable, and modern banking solutions for every Indian</p>
          <div className="hero-buttons">
            <Link to="/login" className="btn btn-primary">Login to Your Account</Link>
            <a href="#contact" className="btn btn-outline">Contact Us</a>
          </div>
        </div>
      </section>

      <section id="services" className="services-section">
        <div className="section-container">
          <h2>Our Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon service-icon-personal">💰</div>
              <h3>Personal Banking</h3>
              <p>Manage your accounts, transfer funds, and track your spending with our intuitive online banking platform.</p>
              <div className="service-card-footer">
                <Link to="/services/personal" className="service-link">Learn More</Link>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon service-icon-business">💼</div>
              <h3>Business Banking</h3>
              <p>Comprehensive financial solutions designed to help your business grow and succeed in today's competitive market.</p>
              <div className="service-card-footer">
                <Link to="/services/business" className="service-link">Learn More</Link>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon service-icon-loans">🏦</div>
              <h3>Loans & Mortgages</h3>
              <p>Competitive rates on loans and mortgages with flexible repayment options tailored to your financial situation.</p>
              <div className="service-card-footer">
                <Link to="/services/loans" className="service-link">Learn More</Link>
              </div>
            </div>
            <div className="service-card">
              <div className="service-icon service-icon-investment">📊</div>
              <h3>Investment Services</h3>
              <p>Expert advice and tools to help you build and manage your investment portfolio for long-term financial growth.</p>
              <div className="service-card-footer">
                <Link to="/services/investment" className="service-link">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="section-container">
          <h2>About Us</h2>
          <p className="about-text">
            Vardhan Bank is committed to providing secure, innovative, and user-friendly banking services. 
            With decades of experience in the Indian financial industry, we combine traditional banking values with cutting-edge technology 
            to deliver an exceptional banking experience for all Indians.
          </p>
          <div className="features-grid">
            <div className="feature-item">
              <h3>Secure</h3>
              <p>Bank with confidence knowing your data and money are protected by state-of-the-art security systems.</p>
            </div>
            <div className="feature-item">
              <h3>Reliable</h3>
              <p>Count on us for consistent, dependable service whenever and wherever you need it.</p>
            </div>
            <div className="feature-item">
              <h3>Innovative</h3>
              <p>Experience the latest in banking technology designed to make your financial life easier.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="section-container">
          <h2>Contact Us</h2>
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>We're here to help with any questions or concerns you may have.</p>
              <div className="contact-details">
                <p className="contact-item"><span className="contact-icon">✉️</span> <strong>Email:</strong> support@vardhanbank.co.in</p>
                <p className="contact-item"><span className="contact-icon">📞</span> <strong>Phone:</strong> +91 98765 43210</p>
                <p className="contact-item"><span className="contact-icon">📍</span> <strong>Address:</strong> 42, Vardhan Towers, Park Street, Kolkata - 700016, West Bengal, India</p>
                <p className="contact-item"><span className="contact-icon">🕒</span> <strong>Hours:</strong> Monday - Friday: 9:30 AM - 5:30 PM</p>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form">
                <div className="form-group">
                  <input type="text" placeholder="Your Name" required />
                </div>
                <div className="form-group">
                  <input type="email" placeholder="Your Email" required />
                </div>
                <div className="form-group">
                  <textarea placeholder="Your Message" rows="4" required></textarea>
                </div>
                <button type="submit" className="btn btn-primary">Send Message</button>
              </form>
            </div>
          </div>
        </div>
      </section>

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

export default Home;