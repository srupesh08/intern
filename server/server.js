const express = require('express');
  const cors = require('cors');
  const dotenv = require('dotenv');

  dotenv.config();

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // In-memory state
  let inventory = [];

  // API Routes
  app.get('/api/items', (req, res) => {
    res.json(inventory);
  });

  app.post('/api/items', (req, res) => {
    const { name, category, quantity, unit, expiryDate } = req.body;
    const newItem = { id: Date.now().toString(), name, category, quantity, unit, expiryDate };
    inventory.push(newItem);
    res.status(201).json(newItem);
  });

  app.put('/api/items/stock-out', (req, res) => {
    const { id, quantityToRemove } = req.body;
    const item = inventory.find(i => i.id === id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.quantity -= quantityToRemove;
    if (item.quantity <= 0) {
      inventory = inventory.filter(i => i.id !== id);
    }
    res.json(item);
  });

  app.delete('/api/items/:id', (req, res) => {
    const { id } = req.params;
    const initialLength = inventory.length;
    inventory = inventory.filter(i => i.id !== id);
    if (inventory.length < initialLength) {
      res.status(200).json({ message: 'Item deleted' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });