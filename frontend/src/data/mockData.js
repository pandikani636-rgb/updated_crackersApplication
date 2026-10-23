export const INITIAL_CRACKERS = [
  { id: 'CRK-001', name: 'Lakshmi Crack', category: 'Sound Crackers', reorderLevel: 20, pricePerBundle: 4500, packetsPerBundle: 100, sku: 'SKU-LC-100', mrp: 5500, wholesalePrice: 4200, boxSize: '10x10', unitsPerBox: 10 },
  { id: 'CRK-002', name: 'Sanguchakra', category: 'Chakkars', reorderLevel: 15, pricePerBundle: 3200, packetsPerBundle: 50, sku: 'SKU-SC-050', mrp: 4000, wholesalePrice: 3000, boxSize: '5x10', unitsPerBox: 5 },
  { id: 'CRK-003', name: 'Flower Pots', category: 'Fountains', reorderLevel: 25, pricePerBundle: 5800, packetsPerBundle: 40, sku: 'SKU-FP-040', mrp: 7000, wholesalePrice: 5400, boxSize: '4x10', unitsPerBox: 4 },
  { id: 'CRK-004', name: 'Ground Chakkar', category: 'Chakkars', reorderLevel: 18, pricePerBundle: 2900, packetsPerBundle: 60, sku: 'SKU-GC-060', mrp: 3500, wholesalePrice: 2700, boxSize: '6x10', unitsPerBox: 6 },
  { id: 'CRK-005', name: 'Sparklers 15cm', category: 'Sparklers', reorderLevel: 30, pricePerBundle: 1800, packetsPerBundle: 120, sku: 'SKU-SP-120', mrp: 2200, wholesalePrice: 1650, boxSize: '12x10', unitsPerBox: 12 },
  { id: 'CRK-006', name: 'Rockets Sky Bomb', category: 'Rockets', reorderLevel: 12, pricePerBundle: 6400, packetsPerBundle: 30, sku: 'SKU-RK-030', mrp: 7800, wholesalePrice: 6000, boxSize: '3x10', unitsPerBox: 3 },
  { id: 'CRK-007', name: 'Atom Bomb Deluxe', category: 'Sound Crackers', reorderLevel: 10, pricePerBundle: 7200, packetsPerBundle: 25, sku: 'SKU-AB-025', mrp: 8500, wholesalePrice: 6800, boxSize: '5x5', unitsPerBox: 5 },
  { id: 'CRK-008', name: 'Twinkling Star', category: 'Sparklers', reorderLevel: 25, pricePerBundle: 2100, packetsPerBundle: 100, sku: 'SKU-TS-100', mrp: 2600, wholesalePrice: 1950, boxSize: '10x10', unitsPerBox: 10 },
  { id: 'CRK-009', name: 'Color Smoke Grenade', category: 'Novelty', reorderLevel: 15, pricePerBundle: 4800, packetsPerBundle: 40, sku: 'SKU-CS-040', mrp: 5800, wholesalePrice: 4400, boxSize: '4x10', unitsPerBox: 4 },
  { id: 'CRK-010', name: 'Fancy Shots 24 Multi', category: 'Aerial Shots', reorderLevel: 8, pricePerBundle: 9500, packetsPerBundle: 10, sku: 'SKU-FS-010', mrp: 11500, wholesalePrice: 9000, boxSize: '2x5', unitsPerBox: 2 }
];

export const INITIAL_CUSTOMERS = [
  { id: 'CUST-001', name: 'Royal Celebrations Event Co', type: 'Wholesale', contactPerson: 'Vikram Sethi', phone: '+91 98401 99887', email: 'orders@royalcel.com', gst: '33AAAAR1111A1Z1', creditLimit: 250000, outstanding: 46000, paymentTerms: 'Net 30', status: 'Active' },
  { id: 'CUST-002', name: 'Venkatesh Traders', type: 'Distributor', contactPerson: 'M. Venkatesh', phone: '+91 98402 88776', email: 'venkytraders@gmail.com', gst: '33BBBVT2222B2Z2', creditLimit: 500000, outstanding: 0, paymentTerms: 'Immediate', status: 'Active' },
  { id: 'CUST-003', name: 'Grand Fireworks Retail', type: 'Retailer', contactPerson: 'K. Rajan', phone: '+91 98403 77665', email: 'rajan@grandfire.in', gst: '33CCCGFR3333C3Z3', creditLimit: 150000, outstanding: 18500, paymentTerms: 'Net 15', status: 'Active' },
  { id: 'CUST-004', name: 'Star Marriage Hall & Events', type: 'Direct', contactPerson: 'Selvam Murugan', phone: '+91 98404 66554', email: 'booking@starevents.com', gst: '33DDDSM4444D4Z4', creditLimit: 100000, outstanding: 16000, paymentTerms: '50% Advance', status: 'Active' },
  { id: 'CUST-005', name: 'City Wholesale Bazaar', type: 'Dealer', contactPerson: 'P. Arumugam', phone: '+91 98405 55443', email: 'citybazaar@salem.com', gst: '33EEECW5555E5Z5', creditLimit: 300000, outstanding: 0, paymentTerms: 'Net 30', status: 'Active' }
];

export const INITIAL_RAW_MATERIALS = [
  { code: 'RM-POT-101', name: 'Potassium Nitrate (KNO3)', category: 'Oxidizers', currentStock: 2450, minStock: 500, maxStock: 5000, unit: 'kg', costPerUnit: 140, location: 'Godown A-1', hazardClass: 'Class 5.1' },
  { code: 'RM-SUL-102', name: 'Sulfur Powder (S)', category: 'Fuels', currentStock: 1200, minStock: 300, maxStock: 3000, unit: 'kg', costPerUnit: 85, location: 'Godown A-2', hazardClass: 'Class 4.1' },
  { code: 'RM-CHA-103', name: 'Charcoal Powder (C)', category: 'Fuels', currentStock: 1800, minStock: 400, maxStock: 4000, unit: 'kg', costPerUnit: 60, location: 'Godown A-3', hazardClass: 'Class 4.2' },
  { code: 'RM-ALU-104', name: 'Aluminum Dark Flake', category: 'Sparklers / Effect', currentStock: 650, minStock: 200, maxStock: 1500, unit: 'kg', costPerUnit: 320, location: 'Vault B-1', hazardClass: 'Class 4.3 (Controlled)' },
  { code: 'RM-BAR-105', name: 'Barium Nitrate (Green)', category: 'Color Agents', currentStock: 800, minStock: 250, maxStock: 2000, unit: 'kg', costPerUnit: 210, location: 'Vault B-2', hazardClass: 'Class 6.1' },
  { code: 'RM-STR-106', name: 'Strontium Carbonate (Red)', category: 'Color Agents', currentStock: 550, minStock: 150, maxStock: 1200, unit: 'kg', costPerUnit: 280, location: 'Vault B-3', hazardClass: 'Class 6.1' },
  { code: 'RM-FUS-107', name: 'Visco Safety Fuse Wire', category: 'Ignition Systems', currentStock: 45000, minStock: 10000, maxStock: 100000, unit: 'meters', costPerUnit: 4.5, location: 'Store C-1', hazardClass: 'Class 1.4S' }
];

export const INITIAL_PRODUCTION_ORDERS = [
  { id: 'PO-2026-801', product: 'Lakshmi Crack', plannedQty: 100, producedQty: 85, rejectedQty: 3, unit: 'Unit 1 - Sivakasi', shift: 'Day Shift A', supervisor: 'Ramesh Kumar', startDate: '2026-08-25', status: 'In Production', batchNo: 'BATCH-2026-LC09' },
  { id: 'PO-2026-802', product: 'Sanguchakra', plannedQty: 60, producedQty: 60, rejectedQty: 1, unit: 'Unit 2 - Virudhunagar', shift: 'Day Shift B', supervisor: 'Suresh Verma', startDate: '2026-08-24', status: 'Quality Check', batchNo: 'BATCH-2026-SC14' },
  { id: 'PO-2026-803', product: 'Flower Pots', plannedQty: 80, producedQty: 80, rejectedQty: 0, unit: 'Unit 1 - Sivakasi', shift: 'Night Shift', supervisor: 'Karthik Raja', startDate: '2026-08-23', status: 'Released', batchNo: 'BATCH-2026-FP05' },
  { id: 'PO-2026-804', product: 'Rockets Sky Bomb', plannedQty: 40, producedQty: 0, rejectedQty: 0, unit: 'Unit 3 - Madurai', shift: 'Day Shift A', supervisor: 'Vijay Anand', startDate: '2026-08-27', status: 'Approved', batchNo: 'BATCH-2026-RK02' },
  { id: 'PO-2026-805', product: 'Sparklers 15cm', plannedQty: 150, producedQty: 120, rejectedQty: 4, unit: 'Unit 1 - Sivakasi', shift: 'Day Shift B', supervisor: 'Anitha Devi', startDate: '2026-08-26', status: 'In Production', batchNo: 'BATCH-2026-SP88' }
];

export const INITIAL_BOM = [
  { id: 'BOM-101', productCode: 'SKU-LC-100', productName: 'Lakshmi Crack', components: [{ rmCode: 'RM-POT-101', rmName: 'Potassium Nitrate', qty: 2.5, unit: 'kg' }, { rmCode: 'RM-SUL-102', rmName: 'Sulfur Powder', qty: 0.8, unit: 'kg' }, { rmCode: 'RM-CHA-103', rmName: 'Charcoal Powder', qty: 1.2, unit: 'kg' }, { rmCode: 'RM-FUS-107', rmName: 'Visco Safety Fuse Wire', qty: 50, unit: 'meters' }], stdUnit: '1 Bundle (100 pkts)', shortage: 'None' },
  { id: 'BOM-102', productCode: 'SKU-SC-050', productName: 'Sanguchakra', components: [{ rmCode: 'RM-POT-101', rmName: 'Potassium Nitrate', qty: 1.8, unit: 'kg' }, { rmCode: 'RM-BAR-105', rmName: 'Barium Nitrate', qty: 0.9, unit: 'kg' }, { rmCode: 'RM-ALU-104', rmName: 'Aluminum Dark Flake', qty: 0.5, unit: 'kg' }], stdUnit: '1 Bundle (50 pkts)', shortage: 'None' },
  { id: 'BOM-103', productCode: 'SKU-SP-120', productName: 'Sparklers 15cm', components: [{ rmCode: 'RM-ALU-104', rmName: 'Aluminum Dark Flake', qty: 1.5, unit: 'kg' }, { rmCode: 'RM-BAR-105', rmName: 'Barium Nitrate', qty: 2.0, unit: 'kg' }, { rmCode: 'RM-STR-106', rmName: 'Strontium Carbonate', qty: 0.4, unit: 'kg' }], stdUnit: '1 Bundle (120 pkts)', shortage: 'Low Aluminum Flake' }
];

export const INITIAL_PURCHASE_REQUESTS = [
  { id: 'PR-2026-301', item: 'Potassium Nitrate (KNO3)', qty: '1,000 kg', requestedBy: 'Store Supervisor', department: 'Raw Material Store', requiredDate: '2026-08-30', estimatedCost: 140000, status: 'Pending Approval' },
  { id: 'PR-2026-302', item: 'Kraft Cardboard Packaging Boxes', qty: '5,000 Boxes', requestedBy: 'Packaging Supervisor', department: 'Packing Unit', requiredDate: '2026-08-28', estimatedCost: 75000, status: 'Approved' },
  { id: 'PR-2026-303', item: 'Visco Safety Fuse Wire', qty: '20,000 Meters', requestedBy: 'Production Mgr', department: 'Manufacturing', requiredDate: '2026-09-02', estimatedCost: 90000, status: 'Completed' }
];

export const INITIAL_QC_RECORDS = [
  { id: 'QC-2026-901', batchNo: 'BATCH-2026-SC14', product: 'Sanguchakra', sampleSize: 50, passedQty: 49, rejectedQty: 1, defectType: 'Slow Ignition Fuse', inspector: 'Priya Dharshini (QC Lead)', decision: 'Pass with Warning', date: '2026-08-26' },
  { id: 'QC-2026-902', batchNo: 'BATCH-2026-LC09', product: 'Lakshmi Crack', sampleSize: 100, passedQty: 97, rejectedQty: 3, defectType: 'Damp Shell Coating', inspector: 'Priya Dharshini (QC Lead)', decision: 'Rework Required', date: '2026-08-25' },
  { id: 'QC-2026-903', batchNo: 'BATCH-2026-FP05', product: 'Flower Pots', sampleSize: 40, passedQty: 40, rejectedQty: 0, defectType: 'None', inspector: 'Priya Dharshini (QC Lead)', decision: 'Passed & Released', date: '2026-08-24' }
];

export const INITIAL_PACKING_ORDERS = [
  { id: 'PKG-2026-501', batchNo: 'BATCH-2026-LC09', product: 'Lakshmi Crack', packedBoxes: 85, targetBoxes: 100, boxSize: '10x10', status: 'Packing In Progress', supervisor: 'Anitha Devi' },
  { id: 'PKG-2026-502', batchNo: 'BATCH-2026-FP05', product: 'Flower Pots', packedBoxes: 80, targetBoxes: 80, boxSize: '4x10', status: 'Completed & Labeled', supervisor: 'Anitha Devi' }
];

export const INITIAL_DISPATCH_ORDERS = [
  { id: 'DSP-2026-701', orderId: 'ORD-9981', customer: 'Royal Celebrations Event Co', transporter: 'VRL Logistics India', vehicleNo: 'TN-67-AB-4321', driverName: 'Murugesan P.', destination: 'Chennai Hub', dispatchDate: '2026-08-26', status: 'In Transit', podStatus: 'Pending POD' },
  { id: 'DSP-2026-702', orderId: 'ORD-9982', customer: 'Venkatesh Traders', transporter: 'Sivakasi Fast Freight', vehicleNo: 'TN-84-C-9900', driverName: 'Kannan K.', destination: 'Madurai Bazaar', dispatchDate: '2026-08-26', status: 'Delivered', podStatus: 'Signed POD Uploaded' }
];

export const INITIAL_SAFETY_RECORDS = [
  { id: 'SAF-101', title: 'Monthly Fire Extinguisher & Hydrant Audit', category: 'Equipment Check', inspectionDate: '2026-08-15', nextDueDate: '2026-09-15', inspector: 'Manoj Kumar (Safety Officer)', status: 'Compliant' },
  { id: 'SAF-102', title: 'Explosives Factory Storage License (Form LE-1)', category: 'Statutory License', inspectionDate: '2025-10-01', nextDueDate: '2026-10-01', inspector: 'PESO Inspectorate', status: 'Renewal Notice (35 days)' },
  { id: 'SAF-103', title: 'Static Electricity Grounding & Earthing Resistance', category: 'Electrical Safety', inspectionDate: '2026-08-01', nextDueDate: '2026-09-01', inspector: 'Manoj Kumar (Safety Officer)', status: 'Compliant' },
  { id: 'SAF-104', title: 'Worker Anti-Static Safety Boots & Flame Apron Drill', category: 'Training', inspectionDate: '2026-08-20', nextDueDate: '2026-09-20', inspector: 'Factory Manager', status: 'Completed' }
];

export const INITIAL_DOCUMENTS = [
  { id: 'DOC-001', title: 'PESO Explosives Factory License (Form LE-1).pdf', category: 'Statutory License', uploadedBy: 'Admin Owner', expiryDate: '2026-10-01', status: 'Active' },
  { id: 'DOC-002', title: 'GST Registration Certificate (Sivakasi Unit).pdf', category: 'Taxation', uploadedBy: 'Meena Sundaram', expiryDate: '2030-01-01', status: 'Active' },
  { id: 'DOC-003', title: 'Sivakasi Fireworks Ltd Supplier Contract 2026.pdf', category: 'Agreement', uploadedBy: 'Admin Owner', expiryDate: '2027-03-31', status: 'Active' },
  { id: 'DOC-004', title: 'Fire Safety NOC Certificate Grade-A.pdf', category: 'Safety', uploadedBy: 'Manoj Kumar', expiryDate: '2027-05-15', status: 'Active' }
];

export const INITIAL_APPROVALS = [
  { id: 'APP-101', module: 'Purchase Request', refNo: 'PR-2026-301', requestedBy: 'Ramesh Kumar', item: 'Potassium Nitrate 1,000kg (₹1,40,000)', requestedDate: '2026-08-26', status: 'Pending Approval' },
  { id: 'APP-102', module: 'Production Plan', refNo: 'PO-2026-804', requestedBy: 'Vijay Anand', item: 'Rockets Sky Bomb 40 Bundles', requestedDate: '2026-08-26', status: 'Approved' },
  { id: 'APP-103', module: 'Stock Adjustment', refNo: 'STK-004', requestedBy: 'Suresh Verma', item: 'Ground Chakkar +5 Bundles', requestedDate: '2026-08-25', status: 'Approved' }
];

export const INITIAL_AUDIT_LOGS = [
  { id: 'LOG-9001', timestamp: '2026-08-26 12:15:04', user: 'Admin Owner', role: 'Super Admin', action: 'CREATE_EXPORT', module: 'Sales', details: 'Created Order ORD-9981 for Royal Celebrations (₹27,000)' },
  { id: 'LOG-9002', timestamp: '2026-08-26 10:45:22', user: 'Ramesh Kumar', role: 'Store Manager', action: 'CREATE_IMPORT', module: 'Inventory', details: 'Added Import Invoice INV-SIV-8901 (20 Bundles Lakshmi Crack)' },
  { id: 'LOG-9003', timestamp: '2026-08-26 09:30:10', user: 'Meena Sundaram', role: 'Accounts', action: 'PAYROLL_DISBURSE', module: 'Payroll', details: 'Disbursed salary for 5 employees (₹1,16,354)' },
  { id: 'LOG-9004', timestamp: '2026-08-25 16:20:00', user: 'Priya Dharshini', role: 'QC Staff', action: 'QC_INSPECTION', module: 'Quality', details: 'Completed QC inspection BATCH-2026-SC14 (Pass with Warning)' }
];

export const INITIAL_SUPPLIERS = [
  { id: 'SUP-101', name: 'Sivakasi Fireworks Ltd', contact: '+91 98421 88201', email: 'sales@sivakasifireworks.com', address: '124 Main Bazaar, Sivakasi, Tamil Nadu', gst: '33AAAAA0000A1Z5', terms: 'Net 30', status: 'Active', totalImports: 14, totalAmount: 845000, pendingAmount: 45000, rating: '5.0 ★' },
  { id: 'SUP-102', name: 'Standard Fireworks Agency', contact: '+91 98765 43210', email: 'orders@standardfireworks.in', address: '45 Industrial Estate, Virudhunagar, TN', gst: '33BBBBB1111B2Z4', terms: 'Immediate', status: 'Active', totalImports: 9, totalAmount: 512000, pendingAmount: 0, rating: '4.8 ★' },
  { id: 'SUP-103', name: 'Apex Pyrotechnics India', contact: '+91 94432 10987', email: 'info@apexpyro.com', address: '88 Bypass Road, Madurai, TN', gst: '33CCCCC2222C3Z3', terms: '50% Advance', status: 'Active', totalImports: 6, totalAmount: 328000, pendingAmount: 22000, rating: '4.6 ★' },
  { id: 'SUP-104', name: 'National Crackers Mart', contact: '+91 91234 56789', email: 'supply@nationalcrackers.com', address: '12 Market Complex, Salem, TN', gst: '33DDDDD3333D4Z2', terms: 'Net 15', status: 'Inactive', totalImports: 3, totalAmount: 140000, pendingAmount: 0, rating: '4.2 ★' }
];

export const INITIAL_WORKERS = [
  { id: 'EMP-001', name: 'Ramesh Kumar', phone: '+91 98111 22334', joinDate: '2023-01-15', role: 'Store Supervisor', department: 'Raw Material & Store', shift: 'Day Shift A', supervisor: 'Factory Manager', salary: 28000, status: 'Active', address: '14 Cross St, City' },
  { id: 'EMP-002', name: 'Suresh Verma', phone: '+91 98222 33445', joinDate: '2023-03-20', role: 'Inventory Handler', department: 'Warehouse', shift: 'Day Shift A', supervisor: 'Ramesh Kumar', salary: 22000, status: 'Active', address: '88 West Ring Rd, City' },
  { id: 'EMP-003', name: 'Anitha Devi', phone: '+91 98333 44556', joinDate: '2023-06-10', role: 'Packaging Specialist', department: 'Packing Unit', shift: 'Day Shift B', supervisor: 'Factory Manager', salary: 19500, status: 'Active', address: '5 East Colony, City' },
  { id: 'EMP-004', name: 'Karthik Raja', phone: '+91 98444 55667', joinDate: '2023-08-01', role: 'Dispatch Loader', department: 'Dispatch & Logistics', shift: 'Day Shift A', supervisor: 'Ramesh Kumar', salary: 18000, status: 'Active', address: '12 Temple St, City' },
  { id: 'EMP-005', name: 'Meena Sundaram', phone: '+91 98555 66778', joinDate: '2023-09-12', role: 'Accounts Assistant', department: 'Finance & Accounts', shift: 'General Shift', supervisor: 'Super Admin', salary: 25000, status: 'Active', address: '45 Lake View Rd, City' },
  { id: 'EMP-006', name: 'Vijay Anand', phone: '+91 98666 77889', joinDate: '2023-11-05', role: 'Forklift Operator', department: 'Warehouse', shift: 'Night Shift', supervisor: 'Ramesh Kumar', salary: 21000, status: 'Active', address: '9 Main St, City' },
  { id: 'EMP-007', name: 'Priya Dharshini', phone: '+91 98777 88990', joinDate: '2024-01-10', role: 'Quality Checker Lead', department: 'Quality Control (QC)', shift: 'Day Shift A', supervisor: 'Factory Manager', salary: 26000, status: 'On Leave', address: '30 North Ave, City' },
  { id: 'EMP-008', name: 'Manoj Kumar', phone: '+91 98888 99001', joinDate: '2024-02-14', role: 'Security & Safety Officer', department: 'Safety & Compliance', shift: '24x7 Rotational', supervisor: 'Super Admin', salary: 24000, status: 'Active', address: '77 South St, City' }
];

export const INITIAL_IMPORTS = [
  { id: 'IMP-2026-001', date: '2026-08-25', invoiceNo: 'INV-SIV-8901', supplier: 'Sivakasi Fireworks Ltd', cracker: 'Lakshmi Crack', bundles: 20, packetsPerBundle: 100, totalPackets: 2000, costPerBundle: 4500, totalAmount: 90000, paymentStatus: 'Paid', remarks: 'Pre-Diwali stock arrival' },
  { id: 'IMP-2026-002', date: '2026-08-25', invoiceNo: 'INV-STD-4412', supplier: 'Standard Fireworks Agency', cracker: 'Sanguchakra', bundles: 15, packetsPerBundle: 50, totalPackets: 750, costPerBundle: 3200, totalAmount: 48000, paymentStatus: 'Paid', remarks: 'Fresh batch batch #88' },
  { id: 'IMP-2026-003', date: '2026-08-24', invoiceNo: 'INV-APX-309', supplier: 'Apex Pyrotechnics India', cracker: 'Flower Pots', bundles: 25, packetsPerBundle: 40, totalPackets: 1000, costPerBundle: 5800, totalAmount: 145000, paymentStatus: 'Partial', remarks: '₹22,000 pending' },
  { id: 'IMP-2026-004', date: '2026-08-23', invoiceNo: 'INV-SIV-8845', supplier: 'Sivakasi Fireworks Ltd', cracker: 'Rockets Sky Bomb', bundles: 10, packetsPerBundle: 30, totalPackets: 300, costPerBundle: 6400, totalAmount: 64000, paymentStatus: 'Pending', remarks: 'Payment due by Aug 30' },
  { id: 'IMP-2026-005', date: '2026-08-22', invoiceNo: 'INV-STD-4390', supplier: 'Standard Fireworks Agency', cracker: 'Sparklers 15cm', bundles: 30, packetsPerBundle: 120, totalPackets: 3600, costPerBundle: 1800, totalAmount: 54000, paymentStatus: 'Paid', remarks: 'Fast-moving item' },
  { id: 'IMP-2026-006', date: '2026-08-20', invoiceNo: 'INV-NAT-112', supplier: 'National Crackers Mart', cracker: 'Atom Bomb Deluxe', bundles: 8, packetsPerBundle: 25, totalPackets: 200, costPerBundle: 7200, totalAmount: 57600, paymentStatus: 'Paid', remarks: 'Inspected for safety tags' }
];

export const INITIAL_EXPORTS = [
  { id: 'EXP-2026-101', date: '2026-08-26', orderId: 'ORD-9981', customer: 'Royal Celebrations Event Co', cracker: 'Lakshmi Crack', bundles: 5, packets: 500, sellingPrice: 5400, totalAmount: 27000, paymentStatus: 'Paid', remarks: 'Event bulk order' },
  { id: 'EXP-2026-102', date: '2026-08-26', orderId: 'ORD-9982', customer: 'Venkatesh Traders', cracker: 'Sanguchakra', bundles: 8, packets: 400, sellingPrice: 3800, totalAmount: 30400, paymentStatus: 'Paid', remarks: 'Retailer shipment' },
  { id: 'EXP-2026-103', date: '2026-08-25', orderId: 'ORD-9979', customer: 'Grand Fireworks Retail', cracker: 'Flower Pots', bundles: 12, packets: 480, sellingPrice: 6900, totalAmount: 82800, paymentStatus: 'Paid', remarks: 'Direct delivery' },
  { id: 'EXP-2026-104', date: '2026-08-25', orderId: 'ORD-9980', customer: 'Star Marriage Hall', cracker: 'Fancy Shots 24 Multi', bundles: 4, packets: 40, sellingPrice: 11500, totalAmount: 46000, paymentStatus: 'Partial', remarks: 'Advance ₹30,000 received' },
  { id: 'EXP-2026-105', date: '2026-08-24', orderId: 'ORD-9975', customer: 'City Wholesale Bazaar', cracker: 'Sparklers 15cm', bundles: 15, packets: 1800, sellingPrice: 2200, totalAmount: 33000, paymentStatus: 'Paid', remarks: 'Counter sale' },
  { id: 'EXP-2026-106', date: '2026-08-23', orderId: 'ORD-9971', customer: 'Metro Party Planners', cracker: 'Color Smoke Grenade', bundles: 6, packets: 240, sellingPrice: 5800, totalAmount: 34800, paymentStatus: 'Paid', remarks: 'Corporate launch event' }
];

export const INITIAL_STOCK = [
  { id: 'STK-001', cracker: 'Lakshmi Crack', category: 'Sound Crackers', totalImported: 100, totalExported: 35, availableBundles: 65, availablePackets: 6500, reorderLevel: 20, status: 'In Stock', lastUpdated: '2026-08-26' },
  { id: 'STK-002', cracker: 'Sanguchakra', category: 'Chakkars', totalImported: 80, totalExported: 70, availableBundles: 10, availablePackets: 500, reorderLevel: 15, status: 'Low Stock', lastUpdated: '2026-08-26' },
  { id: 'STK-003', cracker: 'Flower Pots', category: 'Fountains', totalImported: 120, totalExported: 45, availableBundles: 75, availablePackets: 3000, reorderLevel: 25, status: 'In Stock', lastUpdated: '2026-08-25' },
  { id: 'STK-004', cracker: 'Ground Chakkar', category: 'Chakkars', totalImported: 90, totalExported: 82, availableBundles: 8, availablePackets: 480, reorderLevel: 18, status: 'Low Stock', lastUpdated: '2026-08-25' },
  { id: 'STK-005', cracker: 'Sparklers 15cm', category: 'Sparklers', totalImported: 200, totalExported: 110, availableBundles: 90, availablePackets: 10800, reorderLevel: 30, status: 'In Stock', lastUpdated: '2026-08-24' },
  { id: 'STK-006', cracker: 'Rockets Sky Bomb', category: 'Rockets', totalImported: 40, totalExported: 36, availableBundles: 4, availablePackets: 120, reorderLevel: 12, status: 'Low Stock', lastUpdated: '2026-08-24' },
  { id: 'STK-007', cracker: 'Atom Bomb Deluxe', category: 'Sound Crackers', totalImported: 30, totalExported: 28, availableBundles: 2, availablePackets: 50, reorderLevel: 10, status: 'Low Stock', lastUpdated: '2026-08-22' },
  { id: 'STK-008', cracker: 'Twinkling Star', category: 'Sparklers', reorderLevel: 25, totalImported: 150, totalExported: 60, availableBundles: 90, availablePackets: 9000, status: 'In Stock', lastUpdated: '2026-08-21' },
  { id: 'STK-009', cracker: 'Color Smoke Grenade', category: 'Novelty', reorderLevel: 15, totalImported: 50, totalExported: 47, availableBundles: 3, availablePackets: 120, status: 'Low Stock', lastUpdated: '2026-08-20' },
  { id: 'STK-010', cracker: 'Fancy Shots 24 Multi', category: 'Aerial Shots', reorderLevel: 8, totalImported: 25, totalExported: 24, availableBundles: 1, availablePackets: 10, status: 'Low Stock', lastUpdated: '2026-08-20' }
];

export const INITIAL_ATTENDANCE = [
  { empId: 'EMP-001', name: 'Ramesh Kumar', date: '2026-08-26', checkIn: '09:00 AM', checkOut: '06:30 PM', hours: 9.5, status: 'Present' },
  { empId: 'EMP-002', name: 'Suresh Verma', date: '2026-08-26', checkIn: '09:15 AM', checkOut: '06:15 PM', hours: 9.0, status: 'Present' },
  { empId: 'EMP-003', name: 'Anitha Devi', date: '2026-08-26', checkIn: '09:05 AM', checkOut: '06:30 PM', hours: 9.4, status: 'Present' },
  { empId: 'EMP-004', name: 'Karthik Raja', date: '2026-08-26', checkIn: '09:30 AM', checkOut: '06:00 PM', hours: 8.5, status: 'Present' },
  { empId: 'EMP-005', name: 'Meena Sundaram', date: '2026-08-26', checkIn: '08:55 AM', checkOut: '05:45 PM', hours: 8.8, status: 'Present' },
  { empId: 'EMP-006', name: 'Vijay Anand', date: '2026-08-26', checkIn: '09:10 AM', checkOut: '06:20 PM', hours: 9.1, status: 'Present' },
  { empId: 'EMP-007', name: 'Priya Dharshini', date: '2026-08-26', checkIn: '--:--', checkOut: '--:--', hours: 0, status: 'Leave' },
  { empId: 'EMP-008', name: 'Manoj Kumar', date: '2026-08-26', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 9.0, status: 'Present' }
];

export const INITIAL_PAYROLL = [
  { empId: 'EMP-001', name: 'Ramesh Kumar', month: 'August 2026', basicSalary: 28000, workingDays: 26, presentDays: 26, deduction: 0, bonus: 2000, netSalary: 30000, status: 'Paid', date: '2026-08-25' },
  { empId: 'EMP-002', name: 'Suresh Verma', month: 'August 2026', basicSalary: 22000, workingDays: 26, presentDays: 25, deduction: 846, bonus: 1000, netSalary: 22154, status: 'Paid', date: '2026-08-25' },
  { empId: 'EMP-003', name: 'Anitha Devi', month: 'August 2026', basicSalary: 19500, workingDays: 26, presentDays: 24, deduction: 1500, bonus: 800, netSalary: 18800, status: 'Pending', date: '-' },
  { empId: 'EMP-004', name: 'Karthik Raja', month: 'August 2026', basicSalary: 18000, workingDays: 26, presentDays: 26, deduction: 0, bonus: 1200, netSalary: 19200, status: 'Paid', date: '2026-08-25' },
  { empId: 'EMP-005', name: 'Meena Sundaram', month: 'August 2026', basicSalary: 25000, workingDays: 26, presentDays: 26, deduction: 0, bonus: 1500, netSalary: 26500, status: 'Paid', date: '2026-08-25' },
  { empId: 'EMP-006', name: 'Vijay Anand', month: 'August 2026', basicSalary: 21000, workingDays: 26, presentDays: 23, deduction: 2423, bonus: 1000, netSalary: 19577, status: 'Pending', date: '-' },
  { empId: 'EMP-007', name: 'Priya Dharshini', month: 'August 2026', basicSalary: 26000, workingDays: 26, presentDays: 22, deduction: 3076, bonus: 500, netSalary: 23424, status: 'Pending', date: '-' },
  { empId: 'EMP-008', name: 'Manoj Kumar', month: 'August 2026', basicSalary: 24000, workingDays: 26, presentDays: 26, deduction: 0, bonus: 1000, netSalary: 25000, status: 'Paid', date: '2026-08-25' }
];

export const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'warning', title: 'Low Raw Material Alert', message: 'Aluminum Dark Flake (RM-ALU-104) is near minimum stock (650kg left).', time: '10 mins ago', read: false, link: 'RawMaterials' },
  { id: 2, type: 'info', title: 'QC Approval Needed', message: 'Batch BATCH-2026-LC09 requires rework inspection sign-off.', time: '45 mins ago', read: false, link: 'QualityControl' },
  { id: 3, type: 'warning', title: 'Statutory License Reminder', message: 'Form LE-1 Explosives Storage License expires in 35 days.', time: '2 hours ago', read: false, link: 'Safety' },
  { id: 4, type: 'info', title: 'Purchase Request Pending', message: 'Potassium Nitrate 1,000kg PO requires Manager Approval.', time: '4 hours ago', read: false, link: 'Approvals' },
  { id: 5, type: 'success', title: 'Dispatch In Transit', message: 'Order ORD-9981 dispatched via VRL Logistics to Chennai.', time: 'Yesterday', read: true, link: 'Dispatch' }
];

export const INITIAL_ACTIVITIES = [
  { id: 101, type: 'production', title: 'Production Batch Completed', description: 'Batch BATCH-2026-LC09 completed 85 Bundles Lakshmi Crack', time: '12:45 PM', badge: 'bg-orange-500/20 text-orange-400' },
  { id: 102, type: 'qc', title: 'QC Inspection Verified', description: 'Flower Pots Batch BATCH-2026-FP05 passed 100% safety checks', time: '11:30 AM', badge: 'bg-emerald-500/20 text-emerald-400' },
  { id: 103, type: 'dispatch', title: 'Dispatch Challan Generated', description: 'Challan DSP-2026-701 assigned to Vehicle TN-67-AB-4321', time: '10:15 AM', badge: 'bg-blue-500/20 text-blue-400' },
  { id: 104, type: 'safety', title: 'Monthly Hydrant Audit Completed', description: 'All 18 fire extinguishers in Unit 1 certified compliant', time: 'Yesterday', badge: 'bg-purple-500/20 text-purple-400' }
];

export const CHART_IMPORT_EXPORT_DATA = [
  { day: 'Mon', imports: 110, exports: 75, amountImport: 120000, revenueExport: 165000 },
  { day: 'Tue', imports: 90, exports: 80, amountImport: 95000, revenueExport: 180000 },
  { day: 'Wed', imports: 140, exports: 95, amountImport: 160000, revenueExport: 230000 },
  { day: 'Thu', imports: 100, exports: 85, amountImport: 115000, revenueExport: 195000 },
  { day: 'Fri', imports: 160, exports: 110, amountImport: 190000, revenueExport: 260000 },
  { day: 'Sat', imports: 180, exports: 140, amountImport: 210000, revenueExport: 320000 },
  { day: 'Sun', imports: 125, exports: 87, amountImport: 148500, revenueExport: 216750 }
];

export const CHART_TOP_SELLING = [
  { name: 'Lakshmi Crack', sales: 450, value: 450000 },
  { name: 'Sanguchakra', sales: 380, value: 304000 },
  { name: 'Flower Pots', sales: 320, value: 440000 },
  { name: 'Rockets', sales: 290, value: 410000 },
  { name: 'Sparklers', sales: 550, value: 275000 },
  { name: 'Ground Chakkars', sales: 310, value: 248000 }
];
