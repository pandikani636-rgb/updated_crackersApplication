import React from 'react';
import {
  Printer,
  Download,
  FileText,
  X,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Receipt,
  FileCode
} from 'lucide-react';
import { numberToWords } from '../../utils/numberToWords';
import { exportInvoiceToDocx } from '../../utils/exportDocx';
import { downloadInvoicePDF, printInvoiceElement } from '../../utils/invoicePdf';

export const InvoiceModal = ({
  isOpen,
  onClose,
  data,
  type = 'SALES_INVOICE',
  onCancelInvoice
}) => {
  if (!isOpen || !data) return null;

  // Format currency in Indian Rupees
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(Number(val) || 0);
  };

  // Determine metadata based on type
  const getDocMeta = () => {
    switch (type) {
      case 'PURCHASE_INVOICE':
        return {
          title: 'PURCHASE INVOICE',
          subtitle: 'Goods Inward Receipt Note',
          color: 'indigo',
          partyLabel: 'Supplier / Vendor Details',
          partyName: data.supplier || data.supplierName || 'Sivakasi Fireworks Ltd',
          partyPhone: data.contact || '+91 98421 88201',
          partyAddress: data.address || 'Industrial Estate, Sivakasi, Tamil Nadu',
          partyGst: data.gst || '33AAAAA0000A1Z5',
          refLabel: 'Purchase Ref / Invoice #',
          refNo: data.invoiceNo || data.id || `PUR-${Date.now().toString().slice(-6)}`,
          paymentStatus: data.paymentStatus || 'Paid'
        };
      case 'EXPENSE_VOUCHER':
        return {
          title: 'PAYMENT VOUCHER',
          subtitle: 'Operational Expense Debit Voucher',
          color: 'amber',
          partyLabel: 'Paid To / Beneficiary',
          partyName: data.paidTo || data.reason || 'Operational Expense Payee',
          partyPhone: data.contact || '-',
          partyAddress: data.location || 'Sivakasi Plant Unit',
          partyGst: '-',
          refLabel: 'Voucher Ref #',
          refNo: data.id || data._id || `VCHR-${Date.now().toString().slice(-6)}`,
          paymentStatus: 'DISBURSED'
        };
      case 'PAYROLL_PAYSLIP':
        return {
          title: 'SALARY PAYSLIP',
          subtitle: 'Monthly Wage & Compensation Slip',
          color: 'cyan',
          partyLabel: 'Employee Information',
          partyName: data.name || 'Worker',
          partyPhone: `ID: ${data.empId || 'EMP-001'}`,
          partyAddress: data.department ? `Dept: ${data.department}` : 'Manufacturing Division',
          partyGst: data.role ? `Role: ${data.role}` : 'Staff',
          refLabel: 'Payslip Ref #',
          refNo: `PAY-${data.empId || '001'}-${(data.month || 'AUG2026').replace(/\s+/g, '')}`,
          paymentStatus: data.status || 'Paid'
        };
      case 'AGENT_RECEIPT':
        return {
          title: 'OFFICIAL MONEY RECEIPT',
          subtitle: 'Agent Collection & Account Clearance',
          color: 'teal',
          partyLabel: 'Agent Details',
          partyName: data.agentName || 'Agent',
          partyPhone: data.agentPhone || '-',
          partyAddress: 'Agency Counter, Sivakasi',
          partyGst: '-',
          refLabel: 'Receipt Number',
          refNo: data.id || `RCPT-${Date.now().toString().slice(-6)}`,
          paymentStatus: 'RECEIVED'
        };
      case 'AGENT_INVOICE':
        return {
          title: 'CONSIGNMENT INVOICE',
          subtitle: 'Agent Fireworks Stock Issue Note',
          color: 'purple',
          partyLabel: 'Agent Consignee',
          partyName: data.agentName || 'Agent',
          partyPhone: data.agentPhone || '-',
          partyAddress: 'Agency Depot',
          partyGst: '-',
          refLabel: 'Issue Bill Number',
          refNo: data.id || `ISSUE-${Date.now().toString().slice(-6)}`,
          paymentStatus: 'CONSIGNED'
        };
      case 'PURCHASE_ORDER':
        return {
          title: 'PURCHASE ORDER',
          subtitle: 'Raw Material Requisition & Supply Order',
          color: 'blue',
          partyLabel: 'Requisitioner / Department',
          partyName: data.requestedBy || 'Procurement Manager',
          partyPhone: `Dept: ${data.department || 'Store'}`,
          partyAddress: 'Sivakasi Chemical Store',
          partyGst: '-',
          refLabel: 'PO Reference #',
          refNo: data.id || `PO-${Date.now().toString().slice(-6)}`,
          paymentStatus: data.status || 'Approved'
        };
      case 'EXPORT_INVOICE':
        return {
          title: 'EXPORT COMMERCIAL INVOICE',
          subtitle: 'Outward Delivery & Stock Challan',
          color: 'emerald',
          partyLabel: 'Consignee / Customer',
          partyName: data.customer || data.customerName || 'Wholesale Client',
          partyPhone: data.phone || '-',
          partyAddress: data.destination || 'Commercial Hub',
          partyGst: '-',
          refLabel: 'Challan / Invoice #',
          refNo: data.orderId || data.id || `EXP-${Date.now().toString().slice(-6)}`,
          paymentStatus: data.paymentStatus || 'Paid'
        };
      default: // SALES_INVOICE
        return {
          title: 'TAX INVOICE',
          subtitle: 'Retail & Wholesale Fireworks Bill',
          color: 'emerald',
          partyLabel: 'Billed To (Customer Details)',
          partyName: data.customerName || 'Walk-in Customer',
          partyPhone: data.customerPhone || '-',
          partyAddress: data.customerAddress || 'Direct Store Counter Sale',
          partyGst: data.customerGst || '-',
          refLabel: 'Invoice Number',
          refNo: data.invoiceNumber || `INV-${Date.now().toString().slice(-6)}`,
          paymentStatus: data.paymentStatus || (data.status === 'Cancelled' ? 'CANCELLED' : 'PAID')
        };
    }
  };

  const meta = getDocMeta();

  // Standardize Line Items
  const items = (() => {
    if (data.items && Array.isArray(data.items) && data.items.length > 0) {
      return data.items;
    }
    if (type === 'PURCHASE_INVOICE') {
      return [{
        item: data.cracker || data.itemName || 'Fireworks Stock Bundles',
        sku: data.id || 'IMP-STOCK',
        quantity: data.bundles || data.quantity || 1,
        unitPrice: data.costPerBundle || data.unitCost || 0,
        amountPerItem: data.costPerBundle || data.unitCost || 0,
        discount: 0,
        totalAmount: data.totalAmount || ((data.bundles || 1) * (data.costPerBundle || 0))
      }];
    }
    if (type === 'EXPENSE_VOUCHER') {
      return [{
        item: data.reason || 'Operational Expense Disbursement',
        sku: 'VCHR-ITEM',
        quantity: 1,
        unitPrice: data.amount || 0,
        amountPerItem: data.amount || 0,
        discount: 0,
        totalAmount: data.amount || 0
      }];
    }
    if (type === 'PAYROLL_PAYSLIP') {
      return [
        { item: `Basic Monthly Salary (${data.month || 'Month'})`, sku: 'PAY-BASIC', quantity: 1, unitPrice: data.basicSalary || 0, discount: 0, totalAmount: data.basicSalary || 0 },
        { item: 'Performance Bonus & Allowances', sku: 'PAY-BONUS', quantity: 1, unitPrice: data.bonus || 0, discount: 0, totalAmount: data.bonus || 0 },
        { item: 'Leave / Advance Deductions', sku: 'PAY-DEDUCT', quantity: 1, unitPrice: -(data.deduction || 0), discount: 0, totalAmount: -(data.deduction || 0) }
      ];
    }
    if (type === 'AGENT_RECEIPT') {
      return [{
        item: `Payment Received from Agent (${data.paymentMode || 'Cash'})`,
        sku: 'AGT-RECV',
        quantity: 1,
        unitPrice: data.receivedAmount || 0,
        discount: 0,
        totalAmount: data.receivedAmount || 0
      }];
    }
    if (type === 'AGENT_INVOICE') {
      return [{
        item: 'Crackers Products Issued on Consignment',
        sku: 'AGT-STOCK',
        quantity: 1,
        unitPrice: data.givenProductAmount || 0,
        discount: 0,
        totalAmount: data.givenProductAmount || 0
      }];
    }
    if (type === 'PURCHASE_ORDER') {
      return [{
        item: data.item || 'Raw Material Order',
        sku: data.id || 'PR-REQ',
        quantity: data.qty || '1 Lot',
        unitPrice: data.estimatedCost || 0,
        discount: 0,
        totalAmount: data.estimatedCost || 0
      }];
    }
    if (type === 'EXPORT_INVOICE') {
      return [{
        item: data.cracker || data.itemName || 'Fireworks Export Consignment',
        sku: data.orderId || 'EXP-ITEM',
        quantity: data.bundles || data.salesQty || 1,
        unitPrice: data.sellingPrice || 0,
        discount: 0,
        totalAmount: data.totalAmount || 0
      }];
    }
    return [{
      item: 'Fireworks Goods',
      sku: 'SKU-001',
      quantity: 1,
      unitPrice: data.grandTotal || data.amount || 0,
      totalAmount: data.grandTotal || data.amount || 0
    }];
  })();

  const subtotal = data.subtotal !== undefined
    ? Number(data.subtotal)
    : items.reduce((sum, i) => sum + (Number(i.totalAmount || (i.quantity * i.unitPrice)) || 0), 0);

  const grandTotal = data.grandTotal !== undefined
    ? Number(data.grandTotal)
    : (data.netSalary !== undefined
        ? Number(data.netSalary)
        : (data.amount !== undefined
            ? Number(data.amount)
            : (data.receivedAmount !== undefined
                ? Number(data.receivedAmount)
                : (data.givenProductAmount !== undefined
                    ? Number(data.givenProductAmount)
                    : subtotal))));

  const wordsText = numberToWords(grandTotal);

  // Print Handler via isolated element print
  const handlePrint = () => {
    printInvoiceElement('printable-invoice');
  };

  // PDF Download Handler via dedicated high-fidelity PDF generator
  const handleDownloadPDF = () => {
    try {
      downloadInvoicePDF({
        ...data,
        invoiceNumber: meta.refNo,
        customerName: meta.partyName,
        customerPhone: meta.partyPhone,
        customerAddress: meta.partyAddress,
        customerGst: meta.partyGst,
        date: data.date || new Date().toISOString().split('T')[0],
        items,
        subtotal,
        grandTotal,
        hasGst: data.hasGst,
        gstPercentage: data.gstPercentage,
        gstAmount: data.gstAmount,
        totalDiscount: data.totalDiscount,
        taxableAmount: data.taxableAmount,
        paymentStatus: meta.paymentStatus,
        paymentMethod: data.paymentMethod || data.paymentMode || 'Cash',
        notes: data.notes
      }, type);
    } catch (err) {
      console.error('PDF generation error, falling back to print:', err);
      printInvoiceElement('printable-invoice');
    }
  };

  // Word (.docx) Export Handler
  const handleDownloadDocx = () => {
    exportInvoiceToDocx({
      ...data,
      invoiceNumber: meta.refNo,
      customerName: meta.partyName,
      customerPhone: meta.partyPhone,
      customerAddress: meta.partyAddress,
      customerGst: meta.partyGst,
      date: data.date || new Date().toISOString().split('T')[0],
      items,
      subtotal,
      grandTotal,
      amountInWords: wordsText
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden my-6 border border-slate-200">
        
        {/* Modal Top Control Bar (Screen only) */}
        <div className="print:hidden px-6 py-4 bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-orange-500/20 text-orange-400 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-wide text-white block">
                {meta.title} — #{meta.refNo}
              </span>
              <span className="text-[11px] text-slate-400">{meta.subtitle}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
              title="Print standard A4 invoice"
            >
              <Printer className="w-4 h-4" />
              <span>Print Invoice</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
              title="Download professional PDF file"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={handleDownloadDocx}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer"
              title="Download Word document"
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>Word (.docx)</span>
            </button>

            {onCancelInvoice && data.status !== 'Cancelled' && (
              <button
                onClick={() => onCancelInvoice(data._id || data.id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded-xl transition-all"
                title="Cancel invoice and restore stock"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Cancel Invoice</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div id="printable-invoice" className="p-8 sm:p-12 space-y-6 bg-white font-sans text-slate-800">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-orange-600 font-black text-2xl tracking-wider">
                <span>🎆 SIVAKASI CRACKERS HUB</span>
              </div>
              <p className="text-xs font-semibold text-slate-600 mt-1">
                Licensed Pyrotechnic & Fireworks Manufacturer
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                124 Factory Main Road, Sivakasi, Tamil Nadu - 626123
              </p>
              <p className="text-xs text-slate-500">
                GSTIN: <span className="font-mono font-bold text-slate-700">33AAAAA0000A1Z5</span> | PESO License: <span className="font-mono font-bold text-slate-700">E/SC/TN/20/1234</span>
              </p>
              <p className="text-xs text-slate-500">
                Contact: +91 98421 88201 | Email: accounts@crackerhub.com
              </p>
            </div>

            <div className="text-left sm:text-right w-full sm:w-auto">
              <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-base uppercase tracking-widest rounded-lg">
                {meta.title}
              </span>
              <p className="text-sm font-bold text-slate-800 font-mono mt-2">
                #{meta.refNo}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Date: <span className="font-semibold text-slate-700">{data.date || new Date().toISOString().split('T')[0]}</span>
              </p>
              <div className="mt-2">
                <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  data.status === 'Cancelled'
                    ? 'bg-rose-100 text-rose-700 border border-rose-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}>
                  {meta.paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Party Details & Payment Mode */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                {meta.partyLabel}
              </span>
              <h4 className="text-base font-extrabold text-slate-900">{meta.partyName}</h4>
              {meta.partyPhone && meta.partyPhone !== '-' && (
                <p className="text-xs text-slate-600 mt-0.5">{meta.partyPhone}</p>
              )}
              {meta.partyAddress && (
                <p className="text-xs text-slate-500 mt-0.5">{meta.partyAddress}</p>
              )}
              {meta.partyGst && meta.partyGst !== '-' && (
                <p className="text-xs text-slate-500 mt-0.5 font-mono">GSTIN: {meta.partyGst}</p>
              )}
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Transaction Terms
              </span>
              <p className="text-xs text-slate-700">
                Payment Mode: <span className="font-bold text-slate-900">{data.paymentMethod || data.paymentMode || 'Cash'}</span>
              </p>
              <p className="text-xs text-slate-700 mt-0.5">
                Settlement: <span className="font-bold text-slate-900">Immediate</span>
              </p>
              {data.paidAmount !== undefined && (
                <p className="text-xs text-emerald-700 font-bold mt-0.5">
                  Amount Paid: {formatCurrency(data.paidAmount)}
                </p>
              )}
              {data.balanceAmount !== undefined && data.balanceAmount > 0 && (
                <p className="text-xs text-rose-600 font-bold mt-0.5">
                  Pending Balance: {formatCurrency(data.balanceAmount)}
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3 font-semibold text-center w-10">#</th>
                  <th className="py-2.5 px-3 font-semibold">Item Description</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-28">Code / SKU</th>
                  <th className="py-2.5 px-3 font-semibold text-center w-20">Qty</th>
                  <th className="py-2.5 px-3 font-semibold text-right w-28">Unit Rate</th>
                  {data.totalDiscount > 0 && (
                    <th className="py-2.5 px-3 font-semibold text-right w-24">Discount</th>
                  )}
                  <th className="py-2.5 px-3 font-semibold text-right w-32">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 border-b border-slate-200">
                {items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {item.item || item.name}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-500">
                      {item.sku || '-'}
                    </td>
                    <td className="py-2.5 px-3 text-center font-mono font-bold text-slate-800">
                      {item.quantity}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                      {formatCurrency(item.unitPrice || item.amountPerItem)}
                    </td>
                    {data.totalDiscount > 0 && (
                      <td className="py-2.5 px-3 text-right font-mono text-rose-600">
                        {item.discount ? `- ${formatCurrency(item.discount)}` : '—'}
                      </td>
                    )}
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                      {formatCurrency(item.totalAmount || (item.quantity * item.unitPrice))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations & Amount in Words */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
            <div className="w-full sm:max-w-md space-y-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Amount Chargeable (in words)
                </span>
                <p className="text-xs font-bold text-slate-800 italic mt-0.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {wordsText}
                </p>
              </div>

              {data.notes && (
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-700">Remarks:</span> {data.notes}
                </div>
              )}

              <div className="text-[10px] text-slate-500 border border-slate-200 bg-slate-50 p-2.5 rounded-xl space-y-0.5">
                <span className="font-bold text-slate-700 block">Statutory Notice:</span>
                <p>1. Keep crackers in a dry location away from heat and open flames.</p>
                <p>2. Goods once delivered cannot be returned under PESO Explosives regulations.</p>
              </div>
            </div>

            {/* Total Summary Box */}
            <div className="w-full sm:w-72 space-y-1.5 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono font-bold">{formatCurrency(subtotal)}</span>
              </div>

              {data.totalDiscount > 0 && (
                <div className="flex justify-between text-rose-600 font-medium">
                  <span>Total Discount:</span>
                  <span className="font-mono font-bold">- {formatCurrency(data.totalDiscount)}</span>
                </div>
              )}

              {data.hasGst && (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST ({((data.gstPercentage || 18) / 2)}%):</span>
                    <span className="font-mono font-semibold">+ {formatCurrency((data.gstAmount || 0) / 2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST ({((data.gstPercentage || 18) / 2)}%):</span>
                    <span className="font-mono font-semibold">+ {formatCurrency((data.gstAmount || 0) / 2)}</span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t-2 border-slate-300 flex justify-between items-center text-sm font-black text-slate-900">
                <span>Total Amount:</span>
                <span className="font-mono text-emerald-700 text-base">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>

          {/* Dual Signatures & Seal */}
          <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-4 text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-700">Customer / Receiver Signature</p>
              <div className="h-10"></div>
              <p className="text-[11px] text-slate-400">Date: _______________</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-slate-700">Authorized Signatory</p>
              <div className="h-10 flex items-center justify-end">
                <span className="inline-block px-3 py-1 rounded border-2 border-dashed border-emerald-600 text-[10px] font-black text-emerald-700 uppercase tracking-widest opacity-80">
                  VERIFIED SEAL
                </span>
              </div>
              <p className="font-bold text-slate-800">Sivakasi Crackers Hub</p>
            </div>
          </div>

          <div className="pt-2 text-center text-[10px] text-slate-400">
            This is a computer generated invoice authenticated by CrackerHub ERP.
          </div>
        </div>
      </div>
    </div>
  );
};
