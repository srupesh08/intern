import { getExpiryInfo } from '../utils/firebase';

  function ItemCard({ item, onStockOut, onDelete, onWaste }) {
    const expiryInfo = getExpiryInfo(item.expiryDate);
    const expiryDate = item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A';
    const today = new Date('2025-07-22T20:44:00Z');
    const isExpired = expiryInfo.status === 'expired';

    return (
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow duration-300">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Category: {item.category}</p>
              {isExpired && <p className="text-sm text-red-600 font-semibold mt-1">Use First</p>}
            </div>
            <p className="font-semibold text-lg text-gray-700">{item.quantity} <span className="text-sm text-gray-500">{item.unit}</span></p>
          </div>
        </div>
        <div className="flex justify-between items-end mt-2">
          <div className={`flex items-center text-sm font-medium ${
            { 'urgent': 'text-red-600', 'soon': 'text-yellow-600', 'expired': 'text-red-600', 'safe': 'text-gray-500' }[expiryInfo.status]
          }`}>
            <span className="w-2 h-2 rounded-full mr-2 bg-current"></span>
            {expiryInfo.text} <span className="ml-2 text-xs text-gray-400">({expiryDate})</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => onStockOut(item)} className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors font-bold">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" />
              </svg>
            </button>
            {expiryInfo.status === 'expired' && (
              <button onClick={() => onDelete(item.id)} className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v11a2 2 0 002 2h8a2 2 0 002-2V6h1a1 1 0 100-2h-2V3a1 1 0 00-1-1H6zm1 1h6v1H7V3zm7 3v11H6V6h8zM8 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm4 0a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1z" />
                </svg>
              </button>
            )}
            <button onClick={() => onWaste(item.id)} className="p-2 rounded-full bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 5a1 1 0 011-1h8a1 1 0 011 1v2a1 1 0 01-1 1H6a1 1 0 01-1-1V5zm0 6a1 1 0 011-1h8a1 1 0 011 1v6a1 1 0 01-1 1H6a1 1 0 01-1-1v-6z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  export default ItemCard;