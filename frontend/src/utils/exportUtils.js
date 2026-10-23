import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * Export data array to Excel (.xlsx) file
 * @param {string} fileName - File name without extension
 * @param {string} sheetName - Sheet name inside excel
 * @param {Array<{header: string, key: string}>} columns - Column definition
 * @param {Array<Object>} data - Array of row objects
 */
export const downloadExcel = (fileName, sheetName = 'Sheet1', columns = [], data = []) => {
  try {
    const formattedData = data.map((item) => {
      const row = {};
      columns.forEach((col) => {
        row[col.header] = item[col.key] !== undefined && item[col.key] !== null ? item[col.key] : '';
      });
      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
  } catch (error) {
    console.error('Excel Export Error:', error);
    // CSV Fallback
    const headers = columns.map(c => `"${c.header}"`).join(',');
    const rows = data.map(item => columns.map(c => `"${item[c.key] || ''}"`).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

/**
 * Export data array to PDF document
 * @param {string} fileName - File name without extension
 * @param {string} title - Main Title in PDF
 * @param {Array<{header: string, key: string}>} columns - Column definition
 * @param {Array<Object>} data - Array of row objects
 * @param {Object} subtitleInfo - Subtitle or summary key-values
 */
export const downloadPDF = (fileName, title = 'Report', columns = [], data = [], subtitleInfo = {}) => {
  try {
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Company Header
    doc.setFillColor(15, 23, 42); // Dark slate background header
    doc.rect(0, 0, 297, 25, 'F');

    doc.setTextColor(249, 115, 22); // Orange primary
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('CrackerHub ERP', 14, 12);

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text(title.toUpperCase(), 14, 19);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    const dateStr = new Date().toLocaleString('en-IN');
    doc.text(`Generated: ${dateStr}`, 220, 15);

    let startY = 32;

    // Subtitle summary pills if provided
    const infoKeys = Object.keys(subtitleInfo);
    if (infoKeys.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(51, 65, 85);
      
      let xPos = 14;
      infoKeys.forEach((key) => {
        const text = `${key}: ${subtitleInfo[key]}`;
        doc.text(text, xPos, startY);
        xPos += 60;
        if (xPos > 240) {
          xPos = 14;
          startY += 6;
        }
      });
      startY += 8;
    }

    // Prepare table data
    const tableHeaders = columns.map(c => c.header);
    const tableRows = data.map(item => columns.map(c => item[c.key] !== undefined && item[c.key] !== null ? String(item[c.key]) : ''));

    autoTable(doc, {
      startY: startY,
      head: [tableHeaders],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [248, 250, 252],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        fontSize: 8,
        textColor: [15, 23, 42],
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [241, 245, 249]
      },
      margin: { top: 30, left: 14, right: 14 }
    });

    doc.save(`${fileName}.pdf`);
  } catch (error) {
    console.error('PDF Export Error:', error);
    window.print();
  }
};
