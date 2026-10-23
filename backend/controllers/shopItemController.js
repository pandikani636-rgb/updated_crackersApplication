const ShopItem = require('../models/ShopItem');

// @desc    Get all shop items
// @route   GET /api/shop-items
const getShopItems = async (req, res) => {
  try {
    const items = await ShopItem.find({}).sort({ name: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a shop item
// @route   POST /api/shop-items
const createShopItem = async (req, res) => {
  try {
    const { name, cost, category, description, date } = req.body;
    const existing = await ShopItem.findOne({ name: new RegExp(`^${name}$`, 'i') });
    if (existing) {
      // Update existing cost if found
      existing.cost = Number(cost);
      if (category) existing.category = category;
      if (description) existing.description = description;
      if (date) existing.date = date;
      const updated = await existing.save();
      return res.json(updated);
    }
    const item = new ShopItem({
      name,
      cost: Number(cost),
      category: category || 'General',
      description: description || '',
      date: date || new Date().toISOString().split('T')[0]
    });
    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a shop item
// @route   PUT /api/shop-items/:id
const updateShopItem = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (item) {
      Object.assign(item, req.body);
      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a shop item
// @route   DELETE /api/shop-items/:id
const deleteShopItem = async (req, res) => {
  try {
    const item = await ShopItem.findById(req.params.id);
    if (item) {
      await ShopItem.deleteOne({ _id: req.params.id });
      res.json({ message: 'Item removed' });
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getShopItems,
  createShopItem,
  updateShopItem,
  deleteShopItem
};
