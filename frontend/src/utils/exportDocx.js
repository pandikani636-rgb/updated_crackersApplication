/**
 * Generates and downloads native Microsoft Word (.docx) document
 * Using formatted Office XML with standard Word MIME packaging.
 */

export const exportInvoiceToDocx = (invoice) => {
  const fileName = `${invoice.invoiceNumber || 'Invoice'}.docx`;

  const itemsHtml = (invoice.items || []).map((item, idx) => `
    <tr>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">${idx + 1}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; font-weight:bold;">${item.item || item.name}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">${item.sku || '-'}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:center;">${item.quantity}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:right;">₹${(item.unitPrice || item.amountPerItem || 0).toLocaleString('en-IN')}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:right;">₹${(item.discount || 0).toLocaleString('en-IN')}</td>
      <td style="border:1px solid #cbd5e1; padding:8px; text-align:right; font-weight:bold;">₹${(item.totalAmount || item.lineTotal || 0).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${invoice.invoiceNumber || 'Invoice'}</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; color: #1e293b; margin: 40px; }
        h1 { color: #f97316; font-size: 24pt; margin-bottom: 2pt; }
        .subtitle { font-size: 10pt; color: #64748b; margin-top: 0; }
        .invoice-badge { background-color: #0f172a; color: #ffffff; padding: 6px 16px; font-weight: bold; font-size: 14pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 10pt; }
        th { background-color: #0f172a; color: #ffffff; padding: 8px; text-align: left; }
        .total-box { margin-top: 20px; float: right; width: 280px; border: 1px solid #e2e8f0; padding: 12px; background-color: #f8fafc; }
        .total-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 10pt; }
        .grand-total { font-size: 14pt; font-weight: bold; color: #059669; border-top: 2px solid #cbd5e1; padding-top: 6px; }
        .footer { margin-top: 60px; font-size: 9pt; color: #94a3b8; border-top: 1px solid #cbd5e1; padding-top: 15px; }
      </style>
    </head>
    <body>
      <table style="width:100%; border:none; margin-bottom:20px;">
        <tr>
          <td style="border:none; vertical-align:top;">
            <h1>SIVAKASI CRACKERS HUB</h1>
            <p class="subtitle">Licensed Fireworks & Pyrotechnics Manufacturing Unit</p>
            <p style="font-size:9pt; color:#475569; margin:2px 0;">124 Factory Main Road, Sivakasi, Tamil Nadu - 626123</p>
            <p style="font-size:9pt; color:#475569; margin:2px 0;">GSTIN: 33AAAAA0000A1Z5 | PESO Lic: E/SC/TN/20/1234</p>
            <p style="font-size:9pt; color:#475569; margin:2px 0;">Phone: +91 98421 88201 | Email: sales@crackerhub.com</p>
          </td>
          <td style="border:none; text-align:right; vertical-align:top;">
            <div style="display:inline-block; background:#0f172a; color:white; padding:6px 14px; font-weight:bold; font-size:14pt;">
              TAX INVOICE
            </div>
            <p style="font-size:11pt; font-weight:bold; color:#0f172a; margin:8px 0 2px 0;">#${invoice.invoiceNumber || 'INV-001'}</p>
            <p style="font-size:9pt; color:#64748b; margin:2px 0;">Date: <b>${invoice.date || new Date().toISOString().split('T')[0]}</b></p>
            <p style="font-size:9pt; color:#059669; font-weight:bold; margin:2px 0;">Status: ${(invoice.paymentStatus || 'PAID').toUpperCase()}</p>
          </td>
        </tr>
      </table>

      <table style="width:100%; border:1px solid #e2e8f0; background:#f8fafc; margin-bottom:20px;">
        <tr>
          <td style="padding:10px; border:none; width:50%;">
            <p style="font-size:9pt; text-transform:uppercase; color:#64748b; margin:0 0 4px 0; font-weight:bold;">Billed To / Customer Details</p>
            <p style="font-size:12pt; font-weight:bold; color:#0f172a; margin:0 0 2px 0;">${invoice.customerName || 'Walk-in Customer'}</p>
            ${invoice.customerPhone ? `<p style="font-size:9pt; color:#475569; margin:2px 0;">Phone: ${invoice.customerPhone}</p>` : ''}
            ${invoice.customerAddress ? `<p style="font-size:9pt; color:#475569; margin:2px 0;">Address: ${invoice.customerAddress}</p>` : ''}
            ${invoice.customerGst ? `<p style="font-size:9pt; color:#475569; margin:2px 0;">GSTIN: ${invoice.customerGst}</p>` : ''}
          </td>
          <td style="padding:10px; border:none; width:50%; text-align:right;">
            <p style="font-size:9pt; text-transform:uppercase; color:#64748b; margin:0 0 4px 0; font-weight:bold;">Payment Terms</p>
            <p style="font-size:10pt; color:#0f172a; margin:2px 0;">Method: <b>${invoice.paymentMethod || 'Cash'}</b></p>
            <p style="font-size:10pt; color:#0f172a; margin:2px 0;">Settlement: <b>Immediate</b></p>
          </td>
        </tr>
      </table>

      <table>
        <thead>
          <tr style="background:#0f172a; color:#ffffff;">
            <th style="padding:8px; width:40px; text-align:center;">#</th>
            <th style="padding:8px;">Item Description</th>
            <th style="padding:8px; text-align:center;">SKU Code</th>
            <th style="padding:8px; width:70px; text-align:center;">Qty</th>
            <th style="padding:8px; text-align:right;">Rate (₹)</th>
            <th style="padding:8px; text-align:right;">Discount (₹)</th>
            <th style="padding:8px; text-align:right;">Total Amount (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <table style="width:100%; border:none; margin-top:20px;">
        <tr>
          <td style="border:none; vertical-align:top; width:55%;">
            ${invoice.notes ? `<p style="font-size:9pt; color:#475569; margin:0 0 8px 0;"><b>Notes:</b> ${invoice.notes}</p>` : ''}
            <p style="font-size:9pt; color:#64748b; margin:0 0 4px 0;"><b>Amount in Words:</b></p>
            <p style="font-size:10pt; color:#0f172a; font-weight:bold; font-style:italic; margin:0;">
              ${invoice.amountInWords || 'Rupees Only'}
            </p>
            <div style="margin-top:25px; font-size:8pt; color:#64748b; border:1px solid #e2e8f0; padding:8px; background:#f8fafc;">
              <b>Terms & Conditions:</b><br/>
              1. Goods once sold cannot be taken back.<br/>
              2. Keep fireworks in a dry, cool environment away from heat sources.<br/>
              3. Strictly follow statutory safety guidelines during pyrotechnics storage.
            </div>
          </td>
          <td style="border:none; vertical-align:top; width:45%;">
            <table style="width:100%; border:1px solid #cbd5e1; background:#f8fafc;">
              <tr>
                <td style="padding:6px 12px; border:none;">Subtotal:</td>
                <td style="padding:6px 12px; border:none; text-align:right; font-weight:bold;">₹${(invoice.subtotal || 0).toLocaleString('en-IN')}</td>
              </tr>
              ${invoice.totalDiscount > 0 ? `
              <tr>
                <td style="padding:6px 12px; border:none; color:#dc2626;">Total Discount:</td>
                <td style="padding:6px 12px; border:none; text-align:right; color:#dc2626; font-weight:bold;">- ₹${invoice.totalDiscount.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              ${invoice.hasGst ? `
              <tr>
                <td style="padding:6px 12px; border:none;">CGST (${((invoice.gstPercentage || 18) / 2)}%):</td>
                <td style="padding:6px 12px; border:none; text-align:right;">₹${Math.round((invoice.gstAmount || 0) / 2).toLocaleString('en-IN')}</td>
              </tr>
              <tr>
                <td style="padding:6px 12px; border:none;">SGST (${((invoice.gstPercentage || 18) / 2)}%):</td>
                <td style="padding:6px 12px; border:none; text-align:right;">₹${Math.round((invoice.gstAmount || 0) / 2).toLocaleString('en-IN')}</td>
              </tr>` : ''}
              <tr style="border-top:2px solid #cbd5e1; background:#e2e8f0;">
                <td style="padding:8px 12px; font-size:12pt; font-weight:bold; color:#0f172a;">Grand Total:</td>
                <td style="padding:8px 12px; font-size:12pt; font-weight:bold; color:#059669; text-align:right;">₹${(invoice.grandTotal || 0).toLocaleString('en-IN')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <table style="width:100%; border:none; margin-top:50px;">
        <tr>
          <td style="border:none; width:50%; font-size:9pt; color:#64748b;">
            <p>Customer Signature</p>
            <div style="height:40px;"></div>
            <p>____________________</p>
          </td>
          <td style="border:none; width:50%; text-align:right; font-size:9pt; color:#64748b;">
            <p>Authorized Signatory</p>
            <div style="height:40px;"></div>
            <p><b>Sivakasi Crackers Hub</b></p>
          </td>
        </tr>
      </table>

      <div class="footer">
        <p style="text-align:center; margin:0;">This is a computer-generated tax invoice verified under Tamil Nadu Fireworks Statutory Rules.</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportReportToDocx = (titleOrOptions, columnsArg, dataArg, summaryArg = {}) => {
  let title = 'Report';
  let columns = [];
  let data = [];
  let summary = {};
  let customFilename = null;
  let subtitle = '';

  if (typeof titleOrOptions === 'object' && titleOrOptions !== null) {
    title = titleOrOptions.title || 'Report';
    subtitle = titleOrOptions.subtitle || '';
    columns = titleOrOptions.columns || [];
    data = titleOrOptions.data || [];
    summary = titleOrOptions.summary || {};
    customFilename = titleOrOptions.filename || null;
  } else {
    title = titleOrOptions || 'Report';
    columns = columnsArg || [];
    data = dataArg || [];
    summary = summaryArg || {};
  }

  const fileName = customFilename || `${title.replace(/\s+/g, '_')}_Report.docx`;

  const headersHtml = columns.map(c => `<th style="padding:8px; background:#0f172a; color:#fff; border:1px solid #cbd5e1;">${c.header}</th>`).join('');

  const rowsHtml = data.map((item, idx) => `
    <tr style="background:${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      ${columns.map(c => `
        <td style="padding:6px 10px; border:1px solid #cbd5e1; font-size:9pt;">
          ${item[c.key] !== undefined && item[c.key] !== null ? String(item[c.key]) : ''}
        </td>
      `).join('')}
    </tr>
  `).join('');

  const summaryHtml = Object.keys(summary).map(key => `
    <div style="margin-right:20px; display:inline-block; font-size:10pt;">
      <b>${key}:</b> ${summary[key]}
    </div>
  `).join('');

  const wordContent = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: Calibri, Arial, sans-serif; margin: 40px; color: #0f172a; }
        h1 { color: #ea580c; font-size: 20pt; margin-bottom: 2pt; }
        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
      </style>
    </head>
    <body>
      <h1>CrackerHub ERP — ${title}</h1>
      ${subtitle ? `<p style="font-size:11pt; color:#475569; margin-top:2px; font-weight:bold;">${subtitle}</p>` : ''}
      <p style="font-size:10pt; color:#64748b; margin-top:0;">Generated on: ${new Date().toLocaleString('en-IN')}</p>
      ${summaryHtml ? `<div style="background:#f1f5f9; padding:10px; margin:15px 0; border:1px solid #cbd5e1;">${summaryHtml}</div>` : ''}
      <table>
        <thead>
          <tr>${headersHtml}</tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
      <p style="margin-top:30px; font-size:9pt; color:#94a3b8; text-align:center;">
        CrackerHub ERP System Report — Confidential
      </p>
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', wordContent], {
    type: 'application/msword;charset=utf-8'
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const exportDocxReport = exportReportToDocx;
