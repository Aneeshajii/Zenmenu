import React from 'react';

const MenuCard = ({ item }) => {
  return (
    <div className="glass menu-card" style={{ borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="image-container" style={{ position: 'relative', height: '160px', width: '100%', backgroundColor: '#18181c' }}>
        {item.image ? (
          <img 
            src={`https://zenmenu.onrender.com${item.image}`} 
            alt={item.name} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: item.name && item.name.toLowerCase().includes('black currant') ? 'contain' : 'cover',
              transform: item.name && item.name.toLowerCase().includes('black currant') ? 'scale(0.85)' : 'none'
            }} 
          />
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#555' }}>No Image</span>
          </div>
        )}
      </div>
      <div className="card-body" style={{ padding: '0.8rem', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
        <div>
          <h3 className="card-title" style={{ margin: '0 0 0.4rem 0', fontSize: '1rem', fontWeight: '500', color: 'var(--text-light)' }}>{item.name}</h3>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="price-text" style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--primary)' }}>₹{item.price}</span>
        </div>
      </div>
    </div>
  );
};

export default MenuCard;
