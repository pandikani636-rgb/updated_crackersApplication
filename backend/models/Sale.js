const mongoose = require('mongoose');

const SaleItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.Mixed, required: false },
  sku: { type: String, default: '' },
  item: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  amountPerItem: { type: Number, required: true, default: 0 },
  unitPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  gstRate: { type: Number, default: 0 },
  taxableAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true, default: 0 },
  lineTotal: { type: Number, default: 0 }
});

const SaleSchema = new mongoose.Schema({
  invoiceNumber: { type: String, required: true, unique: true, index: true },
  customerName: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  customerAddress: { type: String, default: '' },
  customerGst: { type: String, default: '' },
  date: { type: String, required: true, index: true },
  items: [SaleItemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  totalDiscount: { type: Number, default: 0 },
  taxableAmount: { type: Number, default: 0 },
  hasGst: { type: Boolean, default: false },
  gstPercentage: { type: Number, default: 0 },
  gstAmount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true, default: 0 },
  paymentMethod: { type: String, default: 'Cash' }, // Cash, UPI, Card, Net Banking
  paymentStatus: { type: String, default: 'Paid' }, // Paid, Partial, Pending
  paidAmount: { type: Number, default: 0 },
  balanceAmount: { type: Number, default: 0 },
  status: { type: String, enum: ['Finalized', 'Cancelled', 'Draft'], default: 'Finalized', index: true },
  notes: { type: String, default: '' },
  createdBy: { type: String, default: 'Admin' }
}, { strict: false, timestamps: true });

const Sale = mongoose.model('Sale', SaleSchema);

module.exports = Sale;
