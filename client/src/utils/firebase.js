export const getExpiryInfo = (expiryDate) => {
    if (!expiryDate) return { text: 'No expiry date', status: 'safe' };
    const today = new Date('2025-07-22T19:56:00Z'); // Fixed to current time
    const expiry = new Date(expiryDate);

    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', status: 'expired' };
    if (diffDays === 0) return { text: 'Expires today', status: 'urgent' };
    if (diffDays <= 3) return { text: `Expires in ${diffDays} days`, status: 'urgent' };
    if (diffDays <= 7) return { text: `Expires in ${diffDays} days`, status: 'soon' };
    return { text: `Expires in ${diffDays} days`, status: 'safe' };
  };