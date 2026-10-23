const mongoose = require('mongoose');

const StockMovementSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.Mixed,
    required: false
  },
  productName: {
    type: String,
    required: true
  },
  sku: {
    type: String,
    default: ''
  },
  quantity: {
    type: Number,
    required: true // Negative for deduction/sale, positive for import/return/adjustment
  },
  type: {
    type: String,
    enum: ['SALE', 'IMPORT', 'RETURN', 'CANCELLATION', 'ADJUSTMENT'],
    required: true
  },
  invoiceNumber: {
    type: String,
    default: ''
  },
  previousStock: {
    type: Number,
    required: true
  },
  newStock: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'Bundles'
  },
  user: {
    type: String,
    default: 'System Admin'
  },
  date: {
    type: String,
    default: () => new Date().toISOString().split('T')[0]
  },
  notes: {
    type: String,
    default: ''
  }
}, { timestamps: true });

StockMovementSchema.index({ productName: 1, date: -1 });
StockMovementSchema.index({ invoiceNumber: 1 });
StockMovementSchema.index({ type: 1 });

const StockMovement = mongoose.model('StockMovement', StockMovementSchema);

module.exports = StockMovement;
