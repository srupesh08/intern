import { useState } from 'react';

  function StockOutModal({ item, onConfirm, onCancel }) {
    const [quantity, setQuantity] = useState(1);

    const handleConfirm = () => {
      if (quantity > item.quantity || quantity <= 0) {
        console.error('Invalid quantity to remove.');
        return;
      }
      onConfirm(item, quantity);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-xl">
          <h2 className="text-lg font-bold mb-2">Stock Out: {item.name}</h2>
          <p className="text-sm text-gray-600 mb-4">Available: {item.quantity} {item.unit}</p>
          <div>
            <label htmlFor="stockOutQuantity" className="block text-sm font-medium text-gray-700">Quantity to Remove</label>
            <input
              type="number"
              id="stockOutQuantity"
              value={quantity}
              onChange={(e) => setQuantity(parseFloat(e.target.value) || 1)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={onCancel} className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
            <button onClick={handleConfirm} className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">Confirm</button>
          </div>
        </div>
      </div>
    );
  }

  export default StockOutModal;