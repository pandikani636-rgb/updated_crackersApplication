
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Route files
const userRoutes = require('./routes/userRoutes');
const crackerRoutes = require('./routes/crackerRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const workerRoutes = require('./routes/workerRoutes');
const importRoutes = require('./routes/importRoutes');
const exportRoutes = require('./routes/exportRoutes');
const stockRoutes = require('./routes/stockRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const payrollRoutes = require('./routes/payrollRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const activityRoutes = require('./routes/activityRoutes');
const customerRoutes = require('./routes/customerRoutes');
const rawMaterialRoutes = require('./routes/rawMaterialRoutes');
const productionOrderRoutes = require('./routes/productionOrderRoutes');
const bomRoutes = require('./routes/bomRoutes');
const purchaseRequestRoutes = require('./routes/purchaseRequestRoutes');
const qcRecordRoutes = require('./routes/qcRecordRoutes');
const packingOrderRoutes = require('./routes/packingOrderRoutes');
const dispatchOrderRoutes = require('./routes/dispatchOrderRoutes');
const safetyRecordRoutes = require('./routes/safetyRecordRoutes');
const documentRoutes = require('./routes/documentRoutes');
const approvalRoutes = require('./routes/approvalRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const workerAllocationRoutes = require('./routes/workerAllocationRoutes');

const shopItemRoutes = require('./routes/shopItemRoutes');
const dailyRegisterRoutes = require('./routes/dailyRegisterRoutes');

const agentRoutes = require('./routes/agentRoutes');
const agentAccountRoutes = require('./routes/agentAccountRoutes');

const otherExpenseRoutes = require('./routes/otherExpenseRoutes');
const saleRoutes = require('./routes/saleRoutes');
const stockMovementRoutes = require('./routes/stockMovementRoutes');

// Mount routers
app.use('/api/stock-movements', stockMovementRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/agent-accounts', agentAccountRoutes);
app.use('/api/users', userRoutes);
app.use('/api/crackers', crackerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/imports', importRoutes);
app.use('/api/exports', exportRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/attendances', attendanceRoutes);
app.use('/api/payrolls', payrollRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/activitys', activityRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/rawMaterials', rawMaterialRoutes);
app.use('/api/productionOrders', productionOrderRoutes);
app.use('/api/boms', bomRoutes);
app.use('/api/purchaseRequests', purchaseRequestRoutes);
app.use('/api/qcRecords', qcRecordRoutes);
app.use('/api/packingOrders', packingOrderRoutes);
app.use('/api/dispatchOrders', dispatchOrderRoutes);
app.use('/api/safetyRecords', safetyRecordRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/approvals', approvalRoutes);
app.use('/api/auditLogs', auditLogRoutes);
app.use('/api/workerAllocations', workerAllocationRoutes);
app.use('/api/shop-items', shopItemRoutes);
app.use('/api/daily-registers', dailyRegisterRoutes);
app.use('/api/other-expenses', otherExpenseRoutes);
app.use('/api/sales', saleRoutes);


// Auth Login Mock Route
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const User = require('./models/User');
  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
