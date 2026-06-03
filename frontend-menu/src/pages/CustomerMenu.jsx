import React, { useState, useEffect } from 'react';
import { ShoppingBag, Phone, Info, Menu, Leaf } from 'lucide-react';
import MenuCard from '../components/MenuCard';

const CustomerMenu = () => {
  const [categories] = useState(['All', 'Starters', 'Main Course', 'Pizza', 'Beverages', 'Desserts']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMenu(activeCategory);
  }, [activeCategory]);

  const fetchMenu = async (category) => {
    try {
      const url = category === 'All' ? 'https://zenmenu.onrender.com/api/menu' : `https://zenmenu.onrender.com/api/menu/category/${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error fetching menu:', error);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <div style={{ paddingBottom: '80px' }}>
      {/* Header */}
      <header className="glass header-container">
        <div className="logo-container">
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span style={{ fontFamily: '"Playfair Display", serif', fontSize: '3.2rem', fontWeight: '700', lineHeight: '1' }}>Zen</span>
            <Leaf size={24} style={{ position: 'absolute', top: '-10px', right: '-18px', color: '#fff', transform: 'rotate(15deg)' }} fill="#fff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <span style={{ width: '30px', height: '1px', backgroundColor: '#fff' }}></span>
            <span style={{ fontFamily: '"Inter", sans-serif', fontSize: '1.2rem', letterSpacing: '8px', fontWeight: '300', textTransform: 'lowercase', marginRight: '-8px' }}>taste</span>
            <span style={{ width: '30px', height: '1px', backgroundColor: '#fff' }}></span>
          </div>
          <div style={{ fontSize: '0.85rem', fontFamily: '"Inter", sans-serif', fontStyle: 'italic', marginTop: '8px', letterSpacing: '2px', fontWeight: '300' }}>
            - Daily -
          </div>
          <div style={{ fontFamily: '"Dancing Script", cursive', fontSize: '1.5rem', marginTop: '4px', fontWeight: '400' }}>
            The lifestyle kitchen
          </div>
        </div>

        <div className="menu-title-container">
          <h2 className="gold-text ornament" style={{ textAlign: 'center', fontSize: '2rem', margin: '0', fontFamily: 'serif' }}>
            <span>Our Menu</span>
          </h2>
          <div style={{ display: 'flex', gap: '4px', marginTop: '8px', justifyContent: 'center' }}>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}></span>
            <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'var(--primary)' }}></span>
          </div>
        </div>
      </header>

      <main className="container" style={{ marginTop: '2rem' }}>

        {/* Categories Tab */}
        <div style={{ display: 'flex', overflowX: 'auto', gap: '1rem', paddingBottom: '1rem', marginBottom: '1.5rem', paddingLeft: '4px', paddingRight: '4px', scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className="category-tab"
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                background: activeCategory === cat ? 'var(--primary)' : 'transparent',
                color: activeCategory === cat ? '#000' : 'var(--text-muted)',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                fontWeight: activeCategory === cat ? '600' : '400',
                textTransform: 'uppercase',
                fontSize: '0.85rem',
                letterSpacing: '1px'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="menu-grid animate-grid" key={activeCategory}>
          {menuItems.length > 0 ? (
            menuItems.map(item => (
              <MenuCard key={item.id} item={item} onAdd={addToCart} />
            ))
          ) : (
            <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-muted)' }}>No items found in this category.</p>
          )}
        </div>
      </main>

      {/* Footer message */}
      <div style={{ textAlign: 'center', padding: '2rem 1rem 4rem', color: 'var(--text-muted)' }}>
        <Leaf size={16} className="gold-text" style={{ marginBottom: '8px' }} />
        <p style={{ margin: '0', fontSize: '0.9rem' }}>Thank you for dining with us!</p>
        <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem' }}>We hope you enjoy your meal.</p>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="glass" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '1rem', display: 'flex', justifyContent: 'center', gap: '1rem', zIndex: 10, background: 'var(--bg-dark)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
          <Phone size={16} /> Call Us
        </button>
        <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.1)', height: '24px', margin: 'auto 0' }}></div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'center', padding: '0.5rem', background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '0.9rem' }}>
          <Info size={16} /> Allergen Info
        </button>
      </div>
    </div>
  );
};

export default CustomerMenu;
