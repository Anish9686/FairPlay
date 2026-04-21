import React from 'react';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-top container">
        <div className="footer-grid">
          
          <div className="footer-col">
            <h3 className="footer-brand" style={{ color: 'hsl(var(--color-primary))', fontSize: '1.5rem', marginBottom: '1rem' }}>FairPlay</h3>
            <p className="text-muted text-sm" style={{ lineHeight: '1.6' }}>
              Elevate your game. Empower your community. Bringing the finest golf tracking experience directly to your dashboard.
            </p>
          </div>

          <div className="footer-col">
            <h4 style={{ marginBottom: '1.25rem' }}>Platform</h4>
            <ul className="footer-links">
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/dashboard">Score Logging</a></li>
              <li><a href="/admin">Admin Console</a></li>
              <li><a href="/dashboard">Charities</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ marginBottom: '1.25rem' }}>Support</h4>
            <ul className="footer-links">
              <li><a href="mailto:support@fairplay.com">Contact Us</a></li>
              <li><a href="#">FAQ</a></li>
              <li><a href="#">Draw Rules</a></li>
              <li><a href="#">Subscription Help</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 style={{ marginBottom: '1.25rem' }}>Newsletter</h4>
            <p className="text-muted text-sm mb-4">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Enter your email" className="footer-input" />
              <button className="footer-btn">Join</button>
            </div>
          </div>

        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container flex justify-between items-center footer-bottom-inner">
          <p className="text-muted text-xs mb-0">© 2026 FairPlay. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted text-xs">Privacy Policy</a>
            <a href="#" className="text-muted text-xs">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
