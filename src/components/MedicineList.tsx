import React, { useState, useEffect } from 'react';
import { Medicine, AddMedicineDto } from '../types';
import { medicineApi } from '../services/api';
import './MedicineList.css';

const MedicineList: React.FC = () => {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [filteredMedicines, setFilteredMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [newMedicine, setNewMedicine] = useState<AddMedicineDto>({
    fullName: '',
    notes: '',
    brand: '',
    category: '',
    price: 0,
    quantity: 0,
    expiryDate: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredMedicines(medicines);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = medicines.filter(medicine =>
        medicine.fullName.toLowerCase().includes(query) ||
        medicine.brand?.toLowerCase().includes(query) ||
        medicine.category.toLowerCase().includes(query) ||
        medicine.notes.toLowerCase().includes(query)
      );
      setFilteredMedicines(filtered);
    }
  }, [searchQuery, medicines]);

  const fetchMedicines = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await medicineApi.getAllMedicines();
      setMedicines(data);
      setFilteredMedicines(data);
    } catch (err) {
      setError('Failed to load medicines. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleAddMedicine = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const addedMedicine = await medicineApi.addMedicine(newMedicine);
      setMedicines([addedMedicine, ...medicines]);
      setNewMedicine({
        fullName: '',
        notes: '',
        brand: '',
        category: '',
        price: 0,
        quantity: 0,
        expiryDate: '',
      });
      setShowAddForm(false);
    } catch (err) {
      setError('Failed to add medicine. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewMedicine({
      ...newMedicine,
      [name]: name === 'price' || name === 'quantity' ? Number(value) : value,
    });
  };

  const getCardClassName = (medicine: Medicine): string => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
      return 'medicine-card expiring-soon';
    }
    
    if (daysUntilExpiry < 0) {
      return 'medicine-card expired';
    }
    
    if (medicine.quantity < 10) {
      return 'medicine-card low-stock';
    }
    
    return 'medicine-card';
  };

  const getWarningMessage = (medicine: Medicine): string | null => {
    const today = new Date();
    const expiryDate = new Date(medicine.expiryDate);
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return '⚠️ EXPIRED';
    }
    
    if (daysUntilExpiry <= 30 && daysUntilExpiry >= 0) {
      return `⚠️ Expires in ${daysUntilExpiry} day(s)`;
    }
    
    if (medicine.quantity < 10) {
      return '⚠️ Low Stock';
    }
    
    return null;
  };

  return (
    <div className="medicine-list-container">
      <h1>Client ABC pharmacy</h1>

      <div className="search-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search medicines by name, brand, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="btn btn-clear"
          >
            Clear
          </button>
        </form>
        {searchQuery && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
            Found {filteredMedicines.length} result(s)
          </p>
        )}
      </div>

      <div className="action-section">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-primary"
        >
          {showAddForm ? 'Cancel' : 'Add New Medicine'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form-section">
          <h2>Add New Medicine</h2>
          <form onSubmit={handleAddMedicine} className="medicine-form">
            <div className="form-group">
              <label htmlFor="fullName">Name *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={newMedicine.fullName}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Notes *</label>
              <textarea
                id="description"
                name="notes"
                value={newMedicine.notes}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <input
                type="text"
                id="brand"
                name="brand"
                value={newMedicine.brand || ''}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <input
                type="text"
                id="category"
                name="category"
                value={newMedicine.category}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={newMedicine.price}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="quantity">Quantity *</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={newMedicine.quantity}
                onChange={handleInputChange}
                required
                min="0"
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date *</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={newMedicine.expiryDate}
                onChange={handleInputChange}
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Medicine'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      <div className="legend">
        <div className="legend-item">
          <span className="legend-color expiring-color"></span>
          <span>Expiring in 30 days or less</span>
        </div>
        <div className="legend-item">
          <span className="legend-color low-stock-color"></span>
          <span>Low stock (less than 10 units)</span>
        </div>
      </div>

      <div className="medicine-grid">
        {!loading && filteredMedicines.length === 0 && (
          <p className="no-results">
            {searchQuery ? `No medicines found matching "${searchQuery}"` : 'No medicines found.'}
          </p>
        )}

        {filteredMedicines.map((medicine) => (
          <div key={medicine.id} className={getCardClassName(medicine)}>
            {getWarningMessage(medicine) && (
              <div className="warning-badge">{getWarningMessage(medicine)}</div>
            )}
            <h3>{medicine.fullName}</h3>
            <p className="notes">{medicine.notes}</p>
            <div className="medicine-details">
              <p><strong>Brand:</strong> {medicine.brand}</p>
              <p><strong>Category:</strong> {medicine.category}</p>
              <p><strong>Price:</strong> ${medicine.price.toFixed(2)}</p>
              <p><strong>Quantity:</strong> {medicine.quantity} units</p>
              {medicine.expiryDate && (
                <p><strong>Expiry:</strong> {new Date(medicine.expiryDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MedicineList;