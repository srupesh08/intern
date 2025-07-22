import { useState, useEffect } from 'react';
  import Navbar from './components/Navbar.jsx';
  import ItemCard from './components/ItemCard.jsx';
  import StockInForm from './components/StockInForm.jsx';
  import StockOutModal from './components/StockOutModal.jsx';
  import { getExpiryInfo } from './utils/firebase';

  const API_URL = import.meta.env.VITE_API_URL;

  function App() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [inventory, setInventory] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockOutItem, setStockOutItem] = useState(null);
    const [sortOrder, setSortOrder] = useState('none'); // 'none', 'quantity-high-to-low', 'quantity-low-to-high', 'expiry-earliest', 'expiry-latest'

    useEffect(() => {
      fetchItems();
    }, []);

    const fetchItems = async () => {
      try {
        const response = await fetch(`${API_URL}/items`);
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const handleAddItem = async (itemData) => {
      try {
        const response = await fetch(`${API_URL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(itemData),
        });
        const newItem = await response.json();
        setInventory([...inventory, newItem]);
        setActiveTab('Overview');
      } catch (error) {
        console.error('Error adding item:', error);
      }
    };

    const handleStockOut = async (item, quantityToRemove) => {
      try {
        const response = await fetch(`${API_URL}/items/stock-out`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: item.id, quantityToRemove }),
        });
        const updatedItem = await response.json();
        setInventory(inventory.map(i => i.id === item.id ? updatedItem : i));
        setStockOutItem(null);
      } catch (error) {
        console.error('Error updating stock:', error);
      }
    };

    const handleDeleteItem = async (itemId) => {
      try {
        await fetch(`${API_URL}/items/${itemId}`, { method: 'DELETE' });
        setInventory(inventory.filter(i => i.id !== itemId));
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };

    const convertToGrams = (quantity, unit) => {
      const conversions = { g: 1, kg: 1000, L: 1000, ml: 1, pcs: 1 }; // Assume 1 unit for pcs
      return quantity * (conversions[unit.toLowerCase()] || 1);
    };

    const sortedItems = [...inventory].sort((a, b) => {
      const today = new Date('2025-07-22T20:44:00Z');
      const expiryA = a.expiryDate ? new Date(a.expiryDate) : today;
      const expiryB = b.expiryDate ? new Date(b.expiryDate) : today;
      const quantityA = convertToGrams(a.quantity, a.unit);
      const quantityB = convertToGrams(b.quantity, b.unit);

      if (sortOrder === 'quantity-high-to-low') return quantityB - quantityA;
      if (sortOrder === 'quantity-low-to-high') return quantityA - quantityB;
      if (sortOrder === 'expiry-earliest') return expiryA - expiryB;
      if (sortOrder === 'expiry-latest') return expiryB - expiryA;
      return 0;
    }).filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="bg-gray-100 min-h-screen font-sans">
        <div className="container mx-auto max-w-lg p-4">
          <div className="bg-white rounded-2xl shadow-lg p-5">
            <Navbar />
            <nav className="my-5 border-b border-gray-200">
              <div className="flex -mb-px">
                <button
                  onClick={() => setActiveTab('Overview')}
                  className={`py-3 px-4 font-medium text-center border-b-2 ${activeTab === 'Overview' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('Stock In')}
                  className={`py-3 px-4 font-medium text-center border-b-2 ${activeTab === 'Stock In' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'}`}
                >
                  Stock In
                </button>
              </div>
            </nav>

            {activeTab === 'Overview' && (
              <div>
                <div className="flex gap-2 mb-4">
                  <div className="relative flex-grow">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z" />
                      </svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search items..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100"
                  >
                    <option value="none">Sort</option>
                    <option value="quantity-high-to-low">Quantity: High to Low</option>
                    <option value="quantity-low-to-high">Quantity: Low to High</option>
                    <option value="expiry-earliest">Expiry: Earliest</option>
                    <option value="expiry-latest">Expiry: Latest</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                      <ItemCard key={item.id} item={item} onStockOut={setStockOutItem} onDelete={handleDeleteItem} />
                    ))
                  ) : (
                    <p className="text-gray-500 col-span-full text-center py-8">No inventory items found.</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Stock In' && <StockInForm onAddItem={handleAddItem} />}
          </div>
        </div>
        {stockOutItem && <StockOutModal item={stockOutItem} onConfirm={handleStockOut} onCancel={() => setStockOutItem(null)} />}
      </div>
    );
  }

  export default App;