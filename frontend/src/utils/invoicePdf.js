import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { numberToWords } from './numberToWords';

/**
 * Format currency to Indian Rupees string
 */
const formatINR = (val) => {
  return 'INR ' + (Number(val) || 0).toLocaleString('en-IN', {
    maximumFractionDigits: 0
  });
};

/**
 * Generate and download a professional, high-fidelity PDF invoice
 * @param {Object} data - Invoice / transaction data object
 * @param {string} type - Invoice type ('SALES_INVOICE', 'PURCHASE_INVOICE', 'EXPENSE_VOUCHER', etc.)
 */
export const downloadInvoicePDF = (data, type = 'SALES_INVOICE') => {
  if (!data) return;

  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // ─── METADATA EXTRACTION ───
    const getDocMeta = () => {
      switch (type) {
        case 'PURCHASE_INVOICE':
          return {
            title: 'PURCHASE INVOICE',
            subtitle: 'Goods Inward Receipt Note',
            partyLabel: 'Supplier / Vendor Details',
            partyName: data.supplier || data.supplierName || 'Sivakasi Fireworks Ltd',
            partyPhone: data.contact || '+91 98421 88201',
            partyAddress: data.address || 'Industrial Estate, Sivakasi, Tamil Nadu',
            partyGst: data.gst || '33AAAAA0000A1Z5',
            refNo: data.invoiceNo || data.id || `PUR-${Date.now().toString().slice(-6)}`,
            paymentStatus: data.paymentStatus || 'PAID'
          };
        case 'EXPENSE_VOUCHER':
          return {
            title: 'PAYMENT VOUCHER',
            subtitle: 'Operational Expense Debit Voucher',
            partyLabel: 'Paid To / Beneficiary',
            partyName: data.paidTo || data.reason || 'Operational Expense Payee',
            partyPhone: data.contact || '-',
            partyAddress: data.location || 'Sivakasi Plant Unit',
            partyGst: '-',
            refNo: data.id || data._id || `VCHR-${Date.now().toString().slice(-6)}`,
            paymentStatus: 'DISBURSED'
          };
        case 'PAYROLL_PAYSLIP':
          return {
            title: 'SALARY PAYSLIP',
            subtitle: 'Monthly Wage & Compensation Slip',
            partyLabel: 'Employee Information',
            partyName: data.name || 'Worker',
            partyPhone: `ID: ${data.empId || 'EMP-001'}`,
            partyAddress: data.department ? `Dept: ${data.department}` : 'Manufacturing Division',
            partyGst: data.role ? `Role: ${data.role}` : 'Staff',
            refNo: `PAY-${data.empId || '001'}-${(data.month || 'AUG2026').replace(/\s+/g, '')}`,
            paymentStatus: data.status || 'PAID'
          };
        case 'AGENT_RECEIPT':
          return {
            title: 'OFFICIAL MONEY RECEIPT',
            subtitle: 'Agent Collection & Account Clearance',
            partyLabel: 'Agent Details',
            partyName: data.agentName || 'Agent',
            partyPhone: data.agentPhone || '-',
            partyAddress: 'Agency Counter, Sivakasi',
            partyGst: '-',
            refNo: data.id || `RCPT-${Date.now().toString().slice(-6)}`,
            paymentStatus: 'RECEIVED'
          };
        case 'AGENT_INVOICE':
          return {
            title: 'CONSIGNMENT INVOICE',
            subtitle: 'Agent Fireworks Stock Issue Note',
            partyLabel: 'Agent Consignee',
            partyName: data.agentName || 'Agent',
            partyPhone: data.agentPhone || '-',
            partyAddress: 'Agency Depot',
            partyGst: '-',
            refNo: data.id || `ISSUE-${Date.now().toString().slice(-6)}`,
            paymentStatus: 'CONSIGNED'
          };
        case 'PURCHASE_ORDER':
          return {
            title: 'PURCHASE ORDER',
            subtitle: 'Raw Material Requisition & Supply Order',
            partyLabel: 'Requisitioner / Department',
            partyName: data.requestedBy || 'Procurement Manager',
            partyPhone: `Dept: ${data.department || 'Store'}`,
            partyAddress: 'Sivakasi Chemical Store',
            partyGst: '-',
            refNo: data.id || `PO-${Date.now().toString().slice(-6)}`,
            paymentStatus: data.status || 'ORDERED'
          };
        default:
          return {
            title: 'TAX INVOICE',
            subtitle: 'Original for Recipient (Rule 46 - CGST Rules)',
            partyLabel: 'Billed To (Customer Details)',
            partyName: data.customerName || data.customer || 'Walk-in Customer',
            partyPhone: data.customerPhone || data.phone || '-',
            partyAddress: data.customerAddress || data.address || 'Sivakasi, Tamil Nadu',
            partyGst: data.customerGst || data.gst || '-',
            refNo: data.invoiceNumber || data.id || `INV-${Date.now().toString().slice(-6)}`,
            paymentStatus: data.status === 'Cancelled' ? 'CANCELLED' : (data.paymentStatus || 'PAID')
          };
      }
    };

    const meta = getDocMeta();

    // ─── ITEMS PARSING ───
    const parseItems = () => {
      if (Array.isArray(data.items) && data.items.length > 0) {
        return data.items.map((i) => ({
          item: i.item || i.name || i.cracker || 'Crackers Item',
          sku: i.sku || i.code || '-',
          quantity: Number(i.quantity) || 1,
          unitPrice: Number(i.unitPrice || i.amountPerItem || i.price || 0),
          discount: Number(i.discount || 0),
          totalAmount: Number(i.totalAmount || (Number(i.quantity || 1) * Number(i.unitPrice || i.amountPerItem || 0)))
        }));
      }
      if (type === 'EXPENSE_VOUCHER') {
        return [{
          item: data.category ? `${data.category}: ${data.reason || 'Operational Expense'}` : (data.reason || 'Expense Voucher'),
          sku: 'EXP-VCHR',
          quantity: 1,
          unitPrice: Number(data.amount) || 0,
          discount: 0,
          totalAmount: Number(data.amount) || 0
        }];
      }
      if (type === 'PAYROLL_PAYSLIP') {
        return [{
          item: `Salary for ${data.month || 'Current Month'} (${data.attendance || 26} Working Days)`,
          sku: `EMP-${data.empId || '001'}`,
          quantity: 1,
          unitPrice: Number(data.netSalary || data.baseSalary || 0),
          discount: 0,
          totalAmount: Number(data.netSalary || data.baseSalary || 0)
        }];
      }
      if (type === 'AGENT_RECEIPT') {
        return [{
          item: `Payment Settlement via ${data.paymentMethod || 'Cash'} (Prev Balance: ${formatINR(data.previousBalance || 0)})`,
          sku: 'AGT-RCPT',
          quantity: 1,
          unitPrice: Number(data.receivedAmount || data.amount || 0),
          discount: 0,
          totalAmount: Number(data.receivedAmount || data.amount || 0)
        }];
      }
      if (type === 'AGENT_INVOICE') {
        return [{
          item: 'Crackers Products Issued on Consignment',
          sku: 'AGT-STOCK',
          quantity: 1,
          unitPrice: Number(data.givenProductAmount || 0),
          discount: 0,
          totalAmount: Number(data.givenProductAmount || 0)
        }];
      }
      return [{
        item: 'Fireworks Goods',
        sku: 'SKU-001',
        quantity: 1,
        unitPrice: Number(data.grandTotal || data.amount || 0),
        discount: 0,
        totalAmount: Number(data.grandTotal || data.amount || 0)
      }];
    };

    const items = parseItems();

    const subtotal = data.subtotal !== undefined
      ? Number(data.subtotal)
      : items.reduce((sum, i) => sum + i.totalAmount, 0);

    const totalDiscount = Number(data.totalDiscount || 0);
    const taxableAmount = data.taxableAmount !== undefined
      ? Number(data.taxableAmount)
      : Math.max(0, subtotal - totalDiscount);

    const hasGst = data.hasGst === true || (Number(data.gstAmount || 0) > 0);
    const gstPercentage = Number(data.gstPercentage || (hasGst ? 18 : 0));
    const gstAmount = hasGst
      ? (data.gstAmount !== undefined ? Number(data.gstAmount) : Math.round(taxableAmount * (gstPercentage / 100)))
      : 0;

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
                      : (taxableAmount + gstAmount)))));

    const wordsText = numberToWords(grandTotal);
    const invoiceDate = data.date || new Date().toISOString().split('T')[0];

    // ─── COLOR PALETTE ───
    const primaryNavy = [15, 23, 42];     // #0f172a
    const accentOrange = [234, 88, 12];   // #ea580c
    const textDark = [30, 41, 59];        // #1e293b
    const textMuted = [100, 116, 139];    // #64748b
    const bgLight = [248, 250, 252];      // #f8fafc
    const emeraldGreen = [5, 150, 105];   // #059669
    const borderGray = [226, 232, 240];   // #e2e8f0

    // ─── 1. TOP HEADER BAND ───
    doc.setFillColor(...primaryNavy);
    doc.rect(0, 0, 210, 36, 'F');

    // Accent line below top header
    doc.setFillColor(...accentOrange);
    doc.rect(0, 36, 210, 1.5, 'F');

    // Company Brand Name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('SIVAKASI CRACKERS HUB', 14, 12);

    // Company Sub-details
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225); // slate-300
    doc.text('Licensed Fireworks & Pyrotechnics Manufacturer | PESO Lic: E/SC/TN/20/1234', 14, 18);
    doc.text('124 Factory Main Road, Sivakasi, Tamil Nadu - 626123 | GSTIN: 33AAAAA0000A1Z5', 14, 23);
    doc.text('Contact: +91 98421 88201 | Email: accounts@crackerhub.com', 14, 28);

    // Document Title & Reference (Right side of header)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(251, 146, 60); // Orange-400
    doc.text(meta.title, 196, 13, { align: 'right' });

    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`Invoice #: ${meta.refNo}`, 196, 20, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(203, 213, 225);
    doc.text(`Date: ${invoiceDate}`, 196, 26, { align: 'right' });
    doc.text(`Status: ${meta.paymentStatus}`, 196, 31, { align: 'right' });

    // ─── 2. PARTY & TRANSACTION DETAILS (BOXES) ───
    // Left Box: Billed To / Party
    doc.setFillColor(...bgLight);
    doc.roundedRect(14, 42, 98, 30, 2, 2, 'F');
    doc.setDrawColor(...borderGray);
    doc.roundedRect(14, 42, 98, 30, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...accentOrange);
    doc.text(meta.partyLabel.toUpperCase(), 18, 47);

    doc.setFontSize(10);
    doc.setTextColor(...textDark);
    doc.text(String(meta.partyName).slice(0, 38), 18, 52);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textMuted);
    let lineY = 57;
    if (meta.partyPhone && meta.partyPhone !== '-') {
      doc.text(`Phone: ${meta.partyPhone}`, 18, lineY);
      lineY += 4.5;
    }
    if (meta.partyAddress && meta.partyAddress !== '-') {
      doc.text(String(meta.partyAddress).slice(0, 48), 18, lineY);
      lineY += 4.5;
    }
    if (meta.partyGst && meta.partyGst !== '-') {
      doc.setFont('helvetica', 'bold');
      doc.text(`GSTIN: ${meta.partyGst}`, 18, lineY);
    }

    // Right Box: Transaction / Payment Info
    doc.setFillColor(...bgLight);
    doc.roundedRect(116, 42, 80, 30, 2, 2, 'F');
    doc.setDrawColor(...borderGray);
    doc.roundedRect(116, 42, 80, 30, 2, 2, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...accentOrange);
    doc.text('TRANSACTION DETAILS', 120, 47);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...textDark);
    doc.text(`Payment Mode: ${data.paymentMethod || data.paymentMode || 'Cash'}`, 120, 53);
    doc.text(`Settlement: Immediate`, 120, 58);

    if (data.paidAmount !== undefined) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...emeraldGreen);
      doc.text(`Amount Paid: ${formatINR(data.paidAmount)}`, 120, 63);
    }
    if (data.balanceAmount !== undefined && Number(data.balanceAmount) > 0) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(225, 29, 72); // rose
      doc.text(`Pending Balance: ${formatINR(data.balanceAmount)}`, 120, 68);
    }

    // ─── 3. ITEM TABLE (AUTOTABLE) ───
    const showDiscountCol = totalDiscount > 0;
    const tableHeaders = showDiscountCol
      ? ['#', 'Item Description', 'SKU / Code', 'Qty', 'Unit Rate', 'Discount', 'Total']
      : ['#', 'Item Description', 'SKU / Code', 'Qty', 'Unit Rate', 'Total'];

    const tableRows = items.map((i, idx) => {
      const row = [
        idx + 1,
        i.item,
        i.sku || '-',
        i.quantity,
        formatINR(i.unitPrice),
        formatINR(i.totalAmount)
      ];
      if (showDiscountCol) {
        row.splice(5, 0, i.discount ? `- ${formatINR(i.discount)}` : '0');
      }
      return row;
    });

    autoTable(doc, {
      startY: 76,
      head: [tableHeaders],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: primaryNavy,
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 2.5
      },
      bodyStyles: {
        fontSize: 8,
        textColor: textDark,
        cellPadding: 2.2
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 10 },
        1: { cellWidth: showDiscountCol ? 65 : 78 },
        2: { halign: 'center', cellWidth: 26 },
        3: { halign: 'center', cellWidth: 16 },
        4: { halign: 'right', cellWidth: showDiscountCol ? 24 : 26 },
        5: { halign: 'right', cellWidth: showDiscountCol ? 22 : 26 },
        6: { halign: 'right', cellWidth: 26 }
      },
      margin: { left: 14, right: 14 }
    });

    const finalY = doc.lastAutoTable.finalY + 6;

    // ─── 4. SUMMARY & AMOUNT IN WORDS ───
    // Check if new page is needed for summary
    let currentY = finalY;
    if (currentY > 230) {
      doc.addPage();
      currentY = 20;
    }

    // Left Column: Amount In Words & Statutory Notice
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...textMuted);
    doc.text('AMOUNT IN WORDS:', 14, currentY);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...textDark);
    const splitWords = doc.splitTextToSize(wordsText, 105);
    doc.text(splitWords, 14, currentY + 5);

    const wordsHeight = splitWords.length * 4.5;
    const noticeY = currentY + 7 + wordsHeight;

    // Explosive safety notice box
    doc.setFillColor(...bgLight);
    doc.roundedRect(14, noticeY, 108, 22, 1.5, 1.5, 'F');
    doc.setDrawColor(...borderGray);
    doc.roundedRect(14, noticeY, 108, 22, 1.5, 1.5, 'S');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...primaryNavy);
    doc.text('STATUTORY NOTICE (PESO Explosives Rules):', 17, noticeY + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(...textMuted);
    doc.text('1. Store fireworks in a cool, dry area away from heat, flame, or direct sunlight.', 17, noticeY + 10);
    doc.text('2. Goods once sold cannot be returned under safety regulations.', 17, noticeY + 14);
    doc.text('3. Always ignite fireworks outdoors under responsible adult supervision.', 17, noticeY + 18);

    // Right Column: Financial Calculation Box
    const boxX = 126;
    const boxWidth = 70;
    let sumY = currentY - 2;

    doc.setFillColor(...bgLight);
    doc.roundedRect(boxX, sumY, boxWidth, hasGst ? 48 : 34, 2, 2, 'F');
    doc.setDrawColor(...borderGray);
    doc.roundedRect(boxX, sumY, boxWidth, hasGst ? 48 : 34, 2, 2, 'S');

    sumY += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text('Subtotal:', boxX + 4, sumY);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text(formatINR(subtotal), boxX + boxWidth - 4, sumY, { align: 'right' });

    if (totalDiscount > 0) {
      sumY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(225, 29, 72); // rose
      doc.text('Discount:', boxX + 4, sumY);
      doc.setFont('helvetica', 'bold');
      doc.text(`- ${formatINR(totalDiscount)}`, boxX + boxWidth - 4, sumY, { align: 'right' });
    }

    if (hasGst) {
      sumY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      doc.text('Taxable Value:', boxX + 4, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
      doc.text(formatINR(taxableAmount), boxX + boxWidth - 4, sumY, { align: 'right' });

      sumY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      doc.text(`CGST (${gstPercentage / 2}%):`, boxX + 4, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
      doc.text(`+ ${formatINR(gstAmount / 2)}`, boxX + boxWidth - 4, sumY, { align: 'right' });

      sumY += 5;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textMuted);
      doc.text(`SGST (${gstPercentage / 2}%):`, boxX + 4, sumY);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...textDark);
      doc.text(`+ ${formatINR(gstAmount / 2)}`, boxX + boxWidth - 4, sumY, { align: 'right' });
    }

    sumY += 6;
    // Grand Total Bar
    doc.setFillColor(...primaryNavy);
    doc.roundedRect(boxX + 2, sumY - 3, boxWidth - 4, 10, 1.5, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text('Grand Total:', boxX + 5, sumY + 3.5);

    doc.setFontSize(10.5);
    doc.setTextColor(52, 211, 153); // emerald-400
    doc.text(formatINR(grandTotal), boxX + boxWidth - 5, sumY + 3.5, { align: 'right' });

    // ─── 5. SIGNATURE BLOCKS ───
    const signY = Math.max(noticeY + 28, sumY + 18);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('Customer / Payee Signature', 14, signY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text('Date: ________________________', 14, signY + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('For SIVAKASI CRACKERS HUB', 196, signY, { align: 'right' });

    // Verified Seal Box
    doc.setDrawColor(...emeraldGreen);
    doc.setLineDash([1, 1], 0);
    doc.rect(160, signY + 3, 36, 7);
    doc.setLineDash([], 0); // reset line dash
    doc.setFontSize(6.5);
    doc.setTextColor(...emeraldGreen);
    doc.text('VERIFIED & AUTHENTICATED', 178, signY + 7.5, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('Authorized Signatory', 196, signY + 15, { align: 'right' });

    // ─── 6. FOOTER ───
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text('This is a computer generated invoice authenticated by CrackerHub ERP. Generated on ' + new Date().toLocaleString('en-IN'), 105, 290, { align: 'center' });

    // Save PDF
    const filename = `${meta.refNo || 'Invoice'}.pdf`;
    doc.save(filename);
    return true;
  } catch (err) {
    console.error('PDF Generation Error:', err);
    throw err;
  }
};

/**
 * Trigger high-fidelity print for the invoice without any screen UI interference
 * @param {string} elementId - ID of invoice DOM container ('printable-invoice')
 */
export const printInvoiceElement = (elementId = 'printable-invoice') => {
  const element = document.getElementById(elementId);
  if (!element) {
    window.print();
    return;
  }

  // Create an invisible iframe for isolated printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;

  // Clone active stylesheets
  let styles = '';
  document.querySelectorAll('style, link[rel="stylesheet"]').forEach((node) => {
    styles += node.outerHTML;
  });

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Invoice Print - Sivakasi Crackers Hub</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${styles}
        <style>
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            background-color: #ffffff !important;
            color: #0f172a !important;
            margin: 0 !important;
            padding: 0 !important;
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
          }
          #printable-invoice {
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 8px !important;
            box-shadow: none !important;
            border: none !important;
            background: #ffffff !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
            page-break-inside: auto !important;
          }
          tr {
            page-break-inside: avoid !important;
            page-break-after: auto !important;
          }
          thead {
            display: table-header-group !important;
          }
        </style>
      </head>
      <body>
        <div id="printable-invoice">
          ${element.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  iframe.contentWindow.focus();
  setTimeout(() => {
    iframe.contentWindow.print();
    setTimeout(() => {
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }, 1500);
  }, 350);
};

