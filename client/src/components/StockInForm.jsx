import { useState } from 'react';

  function StockInForm({ onAddItem }) {
    const [item, setItem] = useState({ name: '', category: '', quantity: '', unit: 'kg', expiryDate: '' });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!item.name || !item.category || item.quantity <= 0) {
        console.error('Validation failed. Please fill all fields.');
        return;
      }
      onAddItem({ ...item, quantity: parseFloat(item.quantity) });
      setItem({ name: '', category: '', quantity: '', unit: 'kg', expiryDate: '' });
    };

    const handleChange = (e) => {
      setItem({ ...item, [e.target.name]: e.target.value });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
          <input type="text" name="name" value={item.name} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="e.g., Chicken Breast" required />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input type="text" name="category" value={item.category} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="e.g., Meat" required />
        </div>
        <div className="flex gap-4">
          <div className="flex-grow">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
            <input type="number" name="quantity" value={item.quantity} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" placeholder="0.0" required />
          </div>
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unit</label>
            <select name="unit" value={item.unit} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2">
              <option>kg</option>
              <option>g</option>
              <option>L</option>
              <option>ml</option>
              <option>pcs</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
          <input type="date" name="expiryDate" value={item.expiryDate} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2" />
        </div>
        <button type="submit" className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 3a1 1 0 011 1v6h6a1 1 0 110 2h-6v6a1 1 0 11-2 0v-6H3a1 1 0 110-2h6V4a1 1 0 011-1z" />
          </svg>
          Stock In Item
        </button>
      </form>
    );
  }

  export default StockInForm;