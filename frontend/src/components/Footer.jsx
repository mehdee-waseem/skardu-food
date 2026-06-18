import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <h3>Skardu Food</h3>
          <p>Bringing the flavours of Baltistan to your table - desi dishes and dry fruits, made and packed with care.</p>
        </div>

        <div>
          <h4>Find us</h4>
          <p>Skardu Bazaar, Gilgit-Baltistan</p>
          <p>+92 3412236629</p>
          
        </div>

        <div>
          <h4>Hours</h4>
          <p>Everyday: 9:00 AM - 9:00 PM</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Skardu Food</span>
        <Link to="/admin/login">Admin</Link>
      </div>
    </footer>
  );
}
