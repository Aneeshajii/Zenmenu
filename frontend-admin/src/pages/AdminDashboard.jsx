import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', category: 'Starters', isAvailable: 1, image: null });
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }
    fetchMenu();
  }, [navigate, token]);

  const fetchMenu = async () => {
    try {
      const res = await fetch('/api/menu/admin', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.status === 401) {
        localStorage.removeItem('adminToken');
        navigate('/admin');
        return;
      }
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.id) data.append('isAvailable', formData.isAvailable);
    if (formData.image) data.append('image', formData.image);

    const url = formData.id ? `/api/menu/${formData.id}` : '/api/menu';
    const method = formData.id ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (res.ok) {
        setShowForm(false);
        fetchMenu();
        resetForm();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this item?')) {
      try {
        await fetch(`/api/menu/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        fetchMenu();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const editItem = (item) => {
    setFormData({
      id: item.id,
      name: item.name,
      price: item.price,
      category: item.category,
      isAvailable: item.isAvailable,
      image: null
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ id: null, name: '', price: '', category: 'Starters', isAvailable: 1, image: null });
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div className="container" style={{ padding: '2rem 1rem' }}>
      <header className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 className="gold-text" style={{ margin: 0 }}>Admin Dashboard</h2>
        <button onClick={logout} className="glass interactive" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.6rem 1rem', borderRadius: '6px', color: '#fff', border: 'none', cursor: 'pointer' }}>
          <LogOut size={16} /> Logout
        </button>
      </header>

      {!showForm ? (
        <>
          <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
            <Plus size={16} /> Add New Item
          </button>
          <div className="glass responsive-table-container" style={{ borderRadius: '8px' }}>
            <table className="responsive-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #333' }}>
                  <th style={{ padding: '1rem' }}>Image</th>
                  <th style={{ padding: '1rem' }}>Name</th>
                  <th style={{ padding: '1rem' }}>Category</th>
                  <th style={{ padding: '1rem' }}>Price</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                  <th style={{ padding: '1rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                    <td data-label="Image" className="img-cell" style={{ padding: '1rem' }}>
                      {item.image ? <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} /> : 'No image'}
                    </td>
                    <td data-label="Name" style={{ padding: '1rem' }}>{item.name}</td>
                    <td data-label="Category" style={{ padding: '1rem' }}>{item.category}</td>
                    <td data-label="Price" style={{ padding: '1rem' }}>${item.price.toFixed(2)}</td>
                    <td data-label="Status" style={{ padding: '1rem', color: item.isAvailable ? '#4ade80' : '#f87171' }}>{item.isAvailable ? 'Available' : 'Sold Out'}</td>
                    <td data-label="Actions" className="action-btns" style={{ padding: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => editItem(item)} className="interactive" style={{ background: '#3b82f6', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><Edit size={16} /></button>
                      <button onClick={() => handleDelete(item.id)} className="interactive" style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem', borderRadius: '6px', cursor: 'pointer', display: 'flex' }}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="glass" style={{ padding: '2rem', borderRadius: '8px', maxWidth: '600px', margin: '0 auto' }}>
          <h3 className="gold-text" style={{ marginBottom: '1.5rem' }}>{formData.id ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Price</label>
                <input type="number" step="0.01" name="price" value={formData.price} onChange={handleInputChange} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }} />
              </div>
            </div>
            
            <div className="form-row" style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }}>
                  <option value="Starters">Starters</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Pizza">Pizza</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Desserts">Desserts</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Image</label>
              <input type="file" onChange={handleFileChange} accept="image/*" style={{ color: '#fff' }} />
            </div>

            {formData.id && (
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Availability</label>
                <select name="isAvailable" value={formData.isAvailable} onChange={handleInputChange} style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #333', background: '#111', color: '#fff' }}>
                  <option value={1}>Available</option>
                  <option value={0}>Sold Out</option>
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="button" onClick={() => setShowForm(false)} style={{ flex: 1, padding: '1rem', background: 'transparent', border: '1px solid #555', color: '#fff', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
              <button type="submit" className="btn-primary" style={{ flex: 1, padding: '1rem' }}>Save Item</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
