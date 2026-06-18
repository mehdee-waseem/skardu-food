import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="brand-icon">🏔️</span>
          <span>
            Skardu <em>Food</em>
          </span>
        </Link>

        <button
          className="navbar-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} end>
            Home
          </NavLink>
          <NavLink to="/menu" onClick={closeMenu}>
            Balti Dishes
          </NavLink>
          <NavLink to="/dry-foods" onClick={closeMenu}>
            Dry Foods
          </NavLink>
          <NavLink to="/cart" onClick={closeMenu} className="cart-link">
            Cart
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
