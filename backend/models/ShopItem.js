const mongoose = require('mongoose');

const ShopItemSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  cost: { type: Number, required: true },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { strict: false, timestamps: true });

const ShopItem = mongoose.model('ShopItem', ShopItemSchema);

module.exports = ShopItem;
