/**
 * Convert number to Indian Rupee Words
 * @param {number|string} amount 
 * @returns {string} e.g. "Rupees Forty-Five Thousand Only"
 */
export const numberToWords = (amount) => {
  const num = Math.round(Number(amount) || 0);
  if (num === 0) return 'Rupees Zero Only';

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  const convertLessThanOneThousand = (n) => {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  };

  let remainder = num;
  let result = '';

  // Crores (10,000,000)
  const crores = Math.floor(remainder / 10000000);
  if (crores > 0) {
    result += convertLessThanOneThousand(crores) + ' Crore ';
    remainder %= 10000000;
  }

  // Lakhs (100,000)
  const lakhs = Math.floor(remainder / 100000);
  if (lakhs > 0) {
    result += convertLessThanOneThousand(lakhs) + ' Lakh ';
    remainder %= 100000;
  }

  // Thousands (1,000)
  const thousands = Math.floor(remainder / 1000);
  if (thousands > 0) {
    result += convertLessThanOneThousand(thousands) + ' Thousand ';
    remainder %= 1000;
  }

  // Hundreds
  if (remainder > 0) {
    result += convertLessThanOneThousand(remainder) + ' ';
  }

  return `Rupees ${result.trim()} Only`;
};
