import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../utils/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('crackerhub_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('crackerhub_user');
  });

  const [userRole, setUserRole] = useState(() => {
    return localStorage.getItem('crackerhub_user_role') || 'Super Admin';
  });

  const [currentTab, setCurrentTab] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam) return tabParam;
      if (window.location.pathname === '/billing') return 'Billing';
    } catch (e) {}
    return localStorage.getItem('crackerhub_current_tab') || 'Dashboard';
  });

  const [theme, setTheme] = useState('dark');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');

  // Persist session & current tab changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('crackerhub_user', JSON.stringify(user));
      setIsAuthenticated(true);
    } else {
      localStorage.removeItem('crackerhub_user');
      setIsAuthenticated(false);
    }
  }, [user]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('crackerhub_user_role', userRole);
    }
  }, [userRole]);

  useEffect(() => {
    if (currentTab) {
      localStorage.setItem('crackerhub_current_tab', currentTab);
    }
  }, [currentTab]);

  // Core & Extended Data states
  const [crackers, setCrackers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [imports, setImports] = useState([]);
  const [exportsList, setExportsList] = useState([]);
  const [stock, setStock] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payroll, setPayroll] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);

  // PDF Extended Modules Data
  const [customers, setCustomers] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [productionOrders, setProductionOrders] = useState([]);
  const [bom, setBom] = useState([]);
  const [purchaseRequests, setPurchaseRequests] = useState([]);
  const [qcRecords, setQcRecords] = useState([]);
  const [packingOrders, setPackingOrders] = useState([]);
  const [dispatchOrders, setDispatchOrders] = useState([]);
  const [safetyRecords, setSafetyRecords] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [approvals, setApprovals] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [shopItems, setShopItems] = useState([]);
  const [dailyRegisters, setDailyRegisters] = useState([]);
  const [otherExpenses, setOtherExpenses] = useState([]);
  const [sales, setSales] = useState([]);

  // Toast System
  const [toast, setToast] = useState(null);

  const fetchInitialData = async () => {
    setIsLoading(true);
    try {
      const [
        crackersRes, suppliersRes, workersRes, importsRes, exportsRes, stockRes, attendanceRes, payrollRes,
        notificationsRes, activitiesRes, customersRes, rawMaterialsRes, productionOrdersRes,
        bomRes, purchaseRequestsRes, qcRecordsRes, packingOrdersRes, dispatchOrdersRes,
        safetyRecordsRes, documentsRes, approvalsRes, auditLogsRes, shopItemsRes, dailyRegistersRes,
        otherExpensesRes, salesRes
      ] = await Promise.all([
        axios.get(`${API_URL}/crackers`), axios.get(`${API_URL}/suppliers`), axios.get(`${API_URL}/workers`),
        axios.get(`${API_URL}/imports`), axios.get(`${API_URL}/exports`), axios.get(`${API_URL}/stocks`),
        axios.get(`${API_URL}/attendances`), axios.get(`${API_URL}/payrolls`), axios.get(`${API_URL}/notifications`),
        axios.get(`${API_URL}/activitys`), axios.get(`${API_URL}/customers`), axios.get(`${API_URL}/rawMaterials`),
        axios.get(`${API_URL}/productionOrders`), axios.get(`${API_URL}/boms`), axios.get(`${API_URL}/purchaseRequests`),
        axios.get(`${API_URL}/qcRecords`), axios.get(`${API_URL}/packingOrders`), axios.get(`${API_URL}/dispatchOrders`),
        axios.get(`${API_URL}/safetyRecords`), axios.get(`${API_URL}/documents`), axios.get(`${API_URL}/approvals`),
        axios.get(`${API_URL}/auditLogs`), axios.get(`${API_URL}/shop-items`), axios.get(`${API_URL}/daily-registers`),
        axios.get(`${API_URL}/other-expenses`), axios.get(`${API_URL}/sales`)
      ]);

      setCrackers(crackersRes.data);
      setSuppliers(suppliersRes.data);
      setWorkers(workersRes.data);
      setImports(importsRes.data);
      setExportsList(exportsRes.data);
      setStock(stockRes.data);
      setAttendance(attendanceRes.data);
      setPayroll(payrollRes.data);
      setNotifications(notificationsRes.data);
      setActivities(activitiesRes.data);
      
      setCustomers(customersRes.data);
      setRawMaterials(rawMaterialsRes.data);
      setProductionOrders(productionOrdersRes.data);
      setBom(bomRes.data);
      setPurchaseRequests(purchaseRequestsRes.data);
      setQcRecords(qcRecordsRes.data);
      setPackingOrders(packingOrdersRes.data);
      setDispatchOrders(dispatchOrdersRes.data);
      setSafetyRecords(safetyRecordsRes.data);
      setDocuments(documentsRes.data);
      setApprovals(approvalsRes.data);
      setAuditLogs(auditLogsRes.data);
      setShopItems(shopItemsRes.data);
      setDailyRegisters(dailyRegistersRes.data);
      setOtherExpenses(otherExpensesRes.data);
      setSales(salesRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
      showToast('Failed to load data from server', 'error');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInitialData();
    }
  }, [isAuthenticated]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(`Switched to ${nextTheme.toUpperCase()} theme mode.`, 'info');
  };

  const showToast = (message, type = 'success') => {
    const toastId = Date.now();
    setToast({ message, type, id: toastId });
    setTimeout(() => {
      setToast((prev) => (prev?.id === toastId ? null : prev));
    }, 5000);
  };

  const [confirmModal, setConfirmModal] = useState(null);

  const requestConfirm = ({ title, message, onConfirm, confirmText = 'Confirm', type = 'danger' }) => {
    setConfirmModal({ title, message, onConfirm, confirmText, type });
  };

  const closeConfirm = () => setConfirmModal(null);

  const addAuditLog = async (action, moduleName, details) => {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newLog = {
      id: `LOG-${Math.floor(9000 + Math.random() * 999)}`,
      timestamp,
      user: user?.name || 'System',
      role: userRole,
      action,
      module: moduleName,
      details
    };
    
    try {
      const res = await axios.post(`${API_URL}/auditLogs`, newLog);
      setAuditLogs((prev) => [res.data, ...prev]);
    } catch (error) {
      console.error('Failed to save audit log', error);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(res.data);
      setUserRole(res.data.role);
      setIsAuthenticated(true);
      localStorage.setItem('crackerhub_user', JSON.stringify(res.data));
      localStorage.setItem('crackerhub_user_role', res.data.role);
      showToast(`Welcome back, ${res.data.name}!`, 'success');
      return true;
    } catch (error) {
      if (error.response?.status === 401) {
        showToast('Invalid email or password.', 'error');
      } else {
        console.error('Failed to sign in:', error);
        showToast('Unable to connect to the server. Check that the backend is running.', 'error');
      }
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('crackerhub_user');
    localStorage.removeItem('crackerhub_user_role');
    localStorage.removeItem('crackerhub_current_tab');
    showToast('Logged out successfully.', 'info');
  };


  const addCustomer = async (data) => {
    const created = {
      ...data,
      id: `CUST-00${customers.length + 1}`,
      outstanding: 0,
      status: 'Active'
    };
    try {
      const res = await axios.post(`${API_URL}/customers`, created);
      setCustomers([res.data, ...customers]);
      addAuditLog('CREATE_CUSTOMER', 'CRM Core', `Added customer ${created.name} (${created.type})`);
      showToast(`Customer registered: ${created.name}`, 'success');
    } catch (error) {
      showToast('Failed to add customer', 'error');
    }
  };

  const addRawMaterial = async (data) => {
    const created = {
      ...data,
      code: `RM-EXP-${Math.floor(100 + Math.random() * 899)}`,
      currentStock: Number(data.currentStock)
    };
    try {
      const res = await axios.post(`${API_URL}/rawMaterials`, created);
      setRawMaterials([...rawMaterials, res.data]);
      addAuditLog('CREATE_RAW_MATERIAL', 'Raw Material', `Added RM ${created.name} (${created.code})`);
      showToast(`Raw Material registered: ${created.name}`, 'success');
    } catch (error) {
      showToast('Failed to add raw material', 'error');
    }
  };

  const addProductionOrder = async (data) => {
    const created = {
      ...data,
      id: `PO-2026-${productionOrders.length + 806}`,
      producedQty: 0,
      rejectedQty: 0,
      batchNo: `BATCH-2026-${data.product.substring(0, 2).toUpperCase()}${Math.floor(10 + Math.random() * 89)}`,
      status: 'Approved'
    };
    try {
      const res = await axios.post(`${API_URL}/productionOrders`, created);
      setProductionOrders([res.data, ...productionOrders]);
      addAuditLog('CREATE_PRODUCTION_ORDER', 'Production', `Created production order ${created.id} for ${created.product}`);
      showToast(`Production order created: ${created.id}`, 'success');
    } catch (error) {
      showToast('Failed to add production order', 'error');
    }
  };

  const addQCRecord = async (data) => {
    const created = {
      ...data,
      id: `QC-2026-${qcRecords.length + 904}`,
      date: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await axios.post(`${API_URL}/qcRecords`, created);
      setQcRecords([res.data, ...qcRecords]);
      addAuditLog('CREATE_QC_RECORD', 'Quality Control', `Inspected batch ${created.batchNo} - ${created.decision}`);
      showToast(`QC Record filed for Batch ${created.batchNo}`, 'success');
    } catch (error) {
      showToast('Failed to add QC record', 'error');
    }
  };

  const addDispatchOrder = async (data) => {
    const created = {
      ...data,
      id: `DSP-2026-${dispatchOrders.length + 703}`,
      status: 'In Transit',
      podStatus: 'Pending POD'
    };
    try {
      const res = await axios.post(`${API_URL}/dispatchOrders`, created);
      setDispatchOrders([res.data, ...dispatchOrders]);
      addAuditLog('CREATE_DISPATCH', 'Dispatch & Delivery', `Dispatched order ${created.orderId} via ${created.transporter}`);
      showToast(`Dispatch Order generated: ${created.id}`, 'success');
    } catch (error) {
      showToast('Failed to add dispatch order', 'error');
    }
  };

  const addSafetyRecord = async (data) => {
    const created = {
      ...data,
      id: `SAF-${safetyRecords.length + 105}`,
      status: 'Compliant'
    };
    try {
      const res = await axios.post(`${API_URL}/safetyRecords`, created);
      setSafetyRecords([res.data, ...safetyRecords]);
      addAuditLog('CREATE_SAFETY_AUDIT', 'Safety & Compliance', `Recorded safety check: ${created.title}`);
      showToast(`Safety record created: ${created.title}`, 'success');
    } catch (error) {
      showToast('Failed to add safety record', 'error');
    }
  };

  const approvePendingTask = async (id) => {
    try {
      const task = approvals.find(a => a.id === id);
      if(task && task._id) {
        const res = await axios.put(`${API_URL}/approvals/${task._id}`, { status: 'Approved' });
        setApprovals(prev => prev.map(a => a.id === id ? res.data : a));
      } else {
        setApprovals(prev => prev.map(a => a.id === id ? { ...a, status: 'Approved' } : a));
      }
      addAuditLog('APPROVE_TASK', 'Approvals', `Approved task reference ${id}`);
      showToast(`Task ${id} Approved successfully!`, 'success');
    } catch(error) {
      showToast(`Failed to approve task ${id}`, 'error');
    }
  };

  // Shop Item CRUD Handlers
  const addShopItem = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/shop-items`, data);
      setShopItems((prev) => [res.data, ...prev.filter(i => (i._id || i.id) !== (res.data._id || res.data.id))]);
      addAuditLog('CREATE_SHOP_ITEM', 'Shop Item Master', `Added shop item ${data.name} (Cost: ₹${data.cost})`);
      showToast(`Shop item saved: ${data.name}`, 'success');
    } catch (error) {
      const newItem = { ...data, id: `SHP-${Date.now()}` };
      setShopItems((prev) => [newItem, ...prev]);
      showToast(`Shop item saved: ${data.name}`, 'success');
    }
  };

  const updateShopItem = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/shop-items/${id}`, data);
      setShopItems((prev) => prev.map(i => (i._id === id || i.id === id) ? res.data : i));
      showToast(`Shop item updated: ${data.name}`, 'success');
    } catch (error) {
      setShopItems((prev) => prev.map(i => (i._id === id || i.id === id) ? { ...i, ...data } : i));
      showToast(`Shop item updated: ${data.name}`, 'success');
    }
  };

  const deleteShopItem = async (id) => {
    try {
      await axios.delete(`${API_URL}/shop-items/${id}`);
      setShopItems((prev) => prev.filter(i => (i._id !== id && i.id !== id)));
      showToast('Shop item removed', 'info');
    } catch (error) {
      setShopItems((prev) => prev.filter(i => (i._id !== id && i.id !== id)));
      showToast('Shop item removed', 'info');
    }
  };

  const addImport = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/imports`, data);
      setImports((prev) => [res.data, ...prev]);
      addAuditLog('CREATE_IMPORT', 'Imports', `Imported invoice ${data.invoiceNo} for ${data.cracker || data.itemName}`);
    } catch (error) {
      const newItem = { ...data, id: `IMP-${Date.now()}` };
      setImports((prev) => [newItem, ...prev]);
    }
  };

  const deleteImport = async (id) => {
    try {
      await axios.delete(`${API_URL}/imports/${id}`);
      setImports((prev) => prev.filter(i => (i._id !== id && i.id !== id)));
      showToast('Import record removed', 'info');
    } catch (error) {
      setImports((prev) => prev.filter(i => (i._id !== id && i.id !== id)));
      showToast('Import record removed', 'info');
    }
  };

  const updateImport = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/imports/${id}`, data);
      setImports((prev) => prev.map(i => (i._id === id || i.id === id) ? res.data : i));
      showToast('Import record updated successfully', 'success');
    } catch (error) {
      setImports((prev) => prev.map(i => (i._id === id || i.id === id) ? { ...i, ...data } : i));
      showToast('Import record updated successfully', 'success');
    }
  };

  const addDailyRegister = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/daily-registers`, data);
      setDailyRegisters((prev) => [res.data, ...prev.filter(r => !(r.date === data.date && r.itemName === data.itemName))]);
      addAuditLog('CREATE_DAILY_REGISTER', 'Export & Daily Register', `Saved daily register for ${data.itemName} on ${data.date}`);
    } catch (error) {
      const newReg = { ...data, id: `REG-${Date.now()}` };
      setDailyRegisters((prev) => [newReg, ...prev.filter(r => !(r.date === data.date && r.itemName === data.itemName))]);
    }
  };

  const updateDailyRegister = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/daily-registers/${id}`, data);
      setDailyRegisters((prev) => prev.map(r => (r._id === id || r.id === id) ? res.data : r));
      showToast('Daily register entry updated', 'success');
    } catch (error) {
      setDailyRegisters((prev) => prev.map(r => (r._id === id || r.id === id) ? { ...r, ...data } : r));
      showToast('Daily register entry updated', 'success');
    }
  };

  const deleteDailyRegister = async (id) => {
    try {
      await axios.delete(`${API_URL}/daily-registers/${id}`);
      setDailyRegisters((prev) => prev.filter(r => (r._id !== id && r.id !== id)));
      showToast('Daily register entry removed', 'info');
    } catch (error) {
      setDailyRegisters((prev) => prev.filter(r => (r._id !== id && r.id !== id)));
      showToast('Daily register entry removed', 'info');
    }
  };

  // Other Expenses CRUD
  const addOtherExpense = async (data) => {
    try {
      const res = await axios.post(`${API_URL}/other-expenses`, data);
      setOtherExpenses((prev) => [res.data, ...prev]);
      addAuditLog('CREATE_OTHER_EXPENSE', 'Other Expenses', `Added expense: ${data.reason} (₹${data.amount})`);
      showToast(`Expense added: ${data.reason}`, 'success');
    } catch (error) {
      const newItem = { ...data, id: `EXP-${Date.now()}` };
      setOtherExpenses((prev) => [newItem, ...prev]);
      showToast(`Expense added: ${data.reason}`, 'success');
    }
  };

  const updateOtherExpense = async (id, data) => {
    try {
      const res = await axios.put(`${API_URL}/other-expenses/${id}`, data);
      setOtherExpenses((prev) => prev.map(e => (e._id === id || e.id === id) ? res.data : e));
      showToast(`Expense updated: ${data.reason}`, 'success');
    } catch (error) {
      setOtherExpenses((prev) => prev.map(e => (e._id === id || e.id === id) ? { ...e, ...data } : e));
      showToast(`Expense updated: ${data.reason}`, 'success');
    }
  };

  const deleteOtherExpense = async (id) => {
    try {
      await axios.delete(`${API_URL}/other-expenses/${id}`);
      setOtherExpenses((prev) => prev.filter(e => (e._id !== id && e.id !== id)));
      showToast('Expense removed', 'info');
    } catch (error) {
      setOtherExpenses((prev) => prev.filter(e => (e._id !== id && e.id !== id)));
      showToast('Expense removed', 'info');
    }
  };

  const addSale = async (saleData) => {
    try {
      const res = await axios.post(`${API_URL}/sales`, saleData);
      setSales((prev) => [res.data, ...prev]);
      addAuditLog('CREATE_SALE', 'Sales', `Created invoice #${res.data.invoiceNumber} for ${res.data.customerName}`);
      showToast(`Sale recorded #${res.data.invoiceNumber}`, 'success');
      return res.data;
    } catch (error) {
      const invNum = saleData.invoiceNumber || `INV-${Date.now()}`;
      const newItem = { ...saleData, id: `SALE-${Date.now()}`, _id: `SALE-${Date.now()}`, invoiceNumber: invNum };
      setSales((prev) => [newItem, ...prev]);
      showToast(`Sale recorded #${invNum}`, 'success');
      return newItem;
    }
  };

  const updateSale = async (id, saleData) => {
    try {
      const res = await axios.put(`${API_URL}/sales/${id}`, saleData);
      setSales((prev) => prev.map(s => (s._id === id || s.id === id) ? res.data : s));
      showToast(`Sale updated #${saleData.invoiceNumber || ''}`, 'success');
    } catch (error) {
      setSales((prev) => prev.map(s => (s._id === id || s.id === id) ? { ...s, ...saleData } : s));
      showToast(`Sale updated`, 'success');
    }
  };

  const deleteSale = async (id) => {
    try {
      await axios.delete(`${API_URL}/sales/${id}`);
      setSales((prev) => prev.filter(s => (s._id !== id && s.id !== id)));
      showToast('Sale record deleted', 'info');
    } catch (error) {
      setSales((prev) => prev.filter(s => (s._id !== id && s.id !== id)));
      showToast('Sale record deleted', 'info');
    }
  };

  const paySalary = async (empId, bonus = 1000, deduction = 0) => {
    try {
      const workerPayroll = payroll.find(p => p.empId === empId);
      const basic = workerPayroll ? workerPayroll.basicSalary : 25000;
      const net = basic + Number(bonus) - Number(deduction);
      const todayDate = new Date().toISOString().split('T')[0];

      if (workerPayroll && workerPayroll._id) {
        const res = await axios.put(`${API_URL}/payrolls/${workerPayroll._id}`, {
          bonus: Number(bonus),
          deduction: Number(deduction),
          netSalary: net,
          status: 'Paid',
          date: todayDate
        });
        setPayroll(prev => prev.map(p => p.empId === empId ? res.data : p));
      } else {
        setPayroll(prev => prev.map(p => p.empId === empId ? {
          ...p,
          bonus: Number(bonus),
          deduction: Number(deduction),
          netSalary: net,
          status: 'Paid',
          date: todayDate
        } : p));
      }

      addAuditLog('PAYROLL_DISBURSE', 'Payroll', `Disbursed salary for ${workerPayroll?.name || empId} (₹${net})`);
      showToast(`Salary disbursed for ${workerPayroll?.name || empId}: ₹${net.toLocaleString('en-IN')}`, 'success');
      return true;
    } catch (error) {
      console.error('paySalary error:', error);
      showToast(`Failed to disburse salary for ${empId}`, 'error');
      return false;
    }
  };

  const addSupplier = async (data) => {
    const created = {
      ...data,
      id: `SUP-${Math.floor(100 + Math.random() * 899)}`,
      status: 'Active',
      totalImports: 0,
      totalAmount: 0,
      pendingAmount: 0
    };
    try {
      const res = await axios.post(`${API_URL}/suppliers`, created);
      setSuppliers([res.data, ...suppliers]);
      addAuditLog('CREATE_SUPPLIER', 'Suppliers', `Added supplier ${created.name}`);
      showToast(`Supplier registered: ${created.name}`, 'success');
    } catch (error) {
      setSuppliers([created, ...suppliers]);
      showToast(`Supplier registered: ${created.name}`, 'success');
    }
  };

  const addWorker = async (data) => {
    const created = {
      ...data,
      id: `EMP-${String(workers.length + 1).padStart(3, '0')}`,
      status: 'Active'
    };
    try {
      const res = await axios.post(`${API_URL}/workers`, created);
      setWorkers([res.data, ...workers]);
      addAuditLog('CREATE_WORKER', 'HR & Workers', `Enrolled worker ${created.name}`);
      showToast(`Worker added: ${created.name}`, 'success');
    } catch (error) {
      setWorkers([created, ...workers]);
      showToast(`Worker added: ${created.name}`, 'success');
    }
  };

  const editWorker = async (idOrData, maybeData) => {
    const id = (idOrData && typeof idOrData === 'object') ? (idOrData._id || idOrData.id) : idOrData;
    const data = (idOrData && typeof idOrData === 'object') ? idOrData : (maybeData || {});
    try {
      if (id && id.length === 24) {
        const res = await axios.put(`${API_URL}/workers/${id}`, data);
        setWorkers(prev => prev.map(w => (w._id === id || w.id === id) ? res.data : w));
      } else {
        setWorkers(prev => prev.map(w => (w._id === id || w.id === id) ? { ...w, ...data } : w));
      }
      showToast(`Worker updated: ${data.name || ''}`, 'success');
    } catch (error) {
      setWorkers(prev => prev.map(w => (w._id === id || w.id === id) ? { ...w, ...data } : w));
      showToast(`Worker updated`, 'success');
    }
  };

  const addPurchaseRequest = async (data) => {
    const created = {
      ...data,
      id: `PR-2026-${Math.floor(300 + Math.random() * 699)}`,
      status: 'Pending Approval'
    };
    try {
      const res = await axios.post(`${API_URL}/purchaseRequests`, created);
      setPurchaseRequests([res.data, ...purchaseRequests]);
      addAuditLog('CREATE_PURCHASE_REQUEST', 'Purchases', `Created PR for ${created.item}`);
      showToast(`Purchase Request created: ${created.id}`, 'success');
      return res.data;
    } catch (error) {
      setPurchaseRequests([created, ...purchaseRequests]);
      showToast(`Purchase Request created: ${created.id}`, 'success');
      return created;
    }
  };

  const addDocument = async (data) => {
    const created = {
      ...data,
      id: `DOC-${String(documents.length + 1).padStart(3, '0')}`,
      uploadedBy: user?.name || 'Admin',
      status: 'Active'
    };
    try {
      const res = await axios.post(`${API_URL}/documents`, created);
      setDocuments([res.data, ...documents]);
      addAuditLog('UPLOAD_DOCUMENT', 'Document Vault', `Uploaded document ${created.title}`);
      showToast(`Document uploaded: ${created.title}`, 'success');
      return res.data;
    } catch (error) {
      setDocuments([created, ...documents]);
      showToast(`Document uploaded: ${created.title}`, 'success');
      return created;
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val || 0);
  };

  // Math Totals
  const totalImportAmount = imports.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const totalExportRevenue = exportsList.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const todayImportsCount = imports.filter(i => i.date === '2026-08-25' || i.date === '2026-08-26').reduce((acc, curr) => acc + (curr.bundles || 0), 0) || 125;
  const todayExportsCount = exportsList.filter(e => e.date === '2026-08-26').reduce((acc, curr) => acc + (curr.bundles || 0), 0) || 87;
  const lowStockCount = stock.filter(s => s.status === 'Low Stock' || s.availableBundles <= s.reorderLevel).length;
  const presentWorkersCount = attendance.filter(a => a.status === 'Present').length;
  const pendingApprovalsCount = approvals.filter(a => a.status === 'Pending Approval').length;

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      userRole,
      setUserRole,
      theme,
      toggleTheme,
      mobileMenuOpen,
      setMobileMenuOpen,
      user,
      setUser,
      currentTab,
      setCurrentTab,
      sidebarCollapsed,
      setSidebarCollapsed,
      globalSearch,
      setGlobalSearch,
      isLoading,
      // Datasets
      crackers,
      suppliers,
      workers,
      imports,
      exportsList,
      stock,
      attendance,
      payroll,
      notifications,
      activities,
      customers,
      rawMaterials,
      productionOrders,
      bom,
      purchaseRequests,
      qcRecords,
      packingOrders,
      dispatchOrders,
      safetyRecords,
      documents,
      approvals,
      auditLogs,
      shopItems,
      setShopItems,
      dailyRegisters,
      setDailyRegisters,
      otherExpenses,
      setOtherExpenses,
      sales,
      setSales,
      // Toast & Modals
      toast,
      setToast,
      showToast,
      confirmModal,

      requestConfirm,
      closeConfirm,
      // Totals
      totalImportAmount,
      totalExportRevenue,
      todayImportsCount,
      todayExportsCount,
      lowStockCount,
      presentWorkersCount,
      pendingApprovalsCount,
      // Methods
      handleLogin,
      handleLogout,
      addCustomer,
      addRawMaterial,
      addProductionOrder,
      addQCRecord,
      addDispatchOrder,
      addSafetyRecord,
      approvePendingTask,
      addShopItem,
      updateShopItem,
      deleteShopItem,
      addImport,
      updateImport,
      deleteImport,
      addDailyRegister,
      updateDailyRegister,
      deleteDailyRegister,
      addOtherExpense,
      updateOtherExpense,
      deleteOtherExpense,
      addSale,
      updateSale,
      deleteSale,
      paySalary,
      addSupplier,
      addWorker,
      editWorker,
      addPurchaseRequest,
      addDocument,
      fetchInitialData,
      formatCurrency
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
