const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const Cracker = require('./models/Cracker');
const Supplier = require('./models/Supplier');
const Worker = require('./models/Worker');
const Import = require('./models/Import');
const Export = require('./models/Export');
const Stock = require('./models/Stock');
const Attendance = require('./models/Attendance');
const Payroll = require('./models/Payroll');
const Notification = require('./models/Notification');
const Activity = require('./models/Activity');
const Customer = require('./models/Customer');
const RawMaterial = require('./models/RawMaterial');
const ProductionOrder = require('./models/ProductionOrder');
const Bom = require('./models/Bom');
const PurchaseRequest = require('./models/PurchaseRequest');
const QcRecord = require('./models/QcRecord');
const PackingOrder = require('./models/PackingOrder');
const DispatchOrder = require('./models/DispatchOrder');
const SafetyRecord = require('./models/SafetyRecord');
const Document = require('./models/Document');
const Approval = require('./models/Approval');
const AuditLog = require('./models/AuditLog');
const User = require('./models/User');
const ShopItem = require('./models/ShopItem');
const DailyRegister = require('./models/DailyRegister');

// Mock Data
const mockData = require('./mockData.cjs');

dotenv.config();

const mapWithCustomId = (arr) => arr.map(item => {
  const { id, code, empId, refNo, orderId, ...rest } = item;
  let stringId = id || code || empId || refNo || orderId || null;
  // keep original properties as well so frontend doesn't break when looking for them specifically
  return { ...item, stringId };
});

const seedData = async () => {
  try {
    await connectDB();

    // Clear DB
    await Promise.all([
      Cracker.deleteMany(), Supplier.deleteMany(), Worker.deleteMany(), Import.deleteMany(),
      Export.deleteMany(), Stock.deleteMany(), Attendance.deleteMany(), Payroll.deleteMany(),
      Notification.deleteMany(), Activity.deleteMany(), Customer.deleteMany(), RawMaterial.deleteMany(),
      ProductionOrder.deleteMany(), Bom.deleteMany(), PurchaseRequest.deleteMany(), QcRecord.deleteMany(),
      PackingOrder.deleteMany(), DispatchOrder.deleteMany(), SafetyRecord.deleteMany(), Document.deleteMany(),
      Approval.deleteMany(), AuditLog.deleteMany(), User.deleteMany(), ShopItem.deleteMany(), DailyRegister.deleteMany()
    ]);

    // Insert Default User
    await User.create({
      name: 'Admin Owner',
      email: 'admin@crackershop.com',
      password: 'Admin@123',
      role: 'Super Admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    // Insert Data
    await Cracker.insertMany(mapWithCustomId(mockData.INITIAL_CRACKERS));
    await Supplier.insertMany(mapWithCustomId(mockData.INITIAL_SUPPLIERS));
    await Worker.insertMany(mapWithCustomId(mockData.INITIAL_WORKERS));
    await Import.insertMany(mapWithCustomId(mockData.INITIAL_IMPORTS));
    await Export.insertMany(mapWithCustomId(mockData.INITIAL_EXPORTS));
    await Stock.insertMany(mapWithCustomId(mockData.INITIAL_STOCK));
    await Attendance.insertMany(mapWithCustomId(mockData.INITIAL_ATTENDANCE));
    await Payroll.insertMany(mapWithCustomId(mockData.INITIAL_PAYROLL));
    await Notification.insertMany(mapWithCustomId(mockData.INITIAL_NOTIFICATIONS));
    await Activity.insertMany(mapWithCustomId(mockData.INITIAL_ACTIVITIES));
    await Customer.insertMany(mapWithCustomId(mockData.INITIAL_CUSTOMERS));
    await RawMaterial.insertMany(mapWithCustomId(mockData.INITIAL_RAW_MATERIALS));
    await ProductionOrder.insertMany(mapWithCustomId(mockData.INITIAL_PRODUCTION_ORDERS));
    await Bom.insertMany(mapWithCustomId(mockData.INITIAL_BOM));
    await PurchaseRequest.insertMany(mapWithCustomId(mockData.INITIAL_PURCHASE_REQUESTS));
    await QcRecord.insertMany(mapWithCustomId(mockData.INITIAL_QC_RECORDS));
    await PackingOrder.insertMany(mapWithCustomId(mockData.INITIAL_PACKING_ORDERS));
    await DispatchOrder.insertMany(mapWithCustomId(mockData.INITIAL_DISPATCH_ORDERS));
    await SafetyRecord.insertMany(mapWithCustomId(mockData.INITIAL_SAFETY_RECORDS));
    await Document.insertMany(mapWithCustomId(mockData.INITIAL_DOCUMENTS));
    await Approval.insertMany(mapWithCustomId(mockData.INITIAL_APPROVALS));
    await AuditLog.insertMany(mapWithCustomId(mockData.INITIAL_AUDIT_LOGS));
    if (mockData.INITIAL_SHOP_ITEMS) await ShopItem.insertMany(mapWithCustomId(mockData.INITIAL_SHOP_ITEMS));
    if (mockData.INITIAL_DAILY_REGISTERS) await DailyRegister.insertMany(mapWithCustomId(mockData.INITIAL_DAILY_REGISTERS));

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};


seedData();
