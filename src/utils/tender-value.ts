export const parseIndianFormat = (value: string): number => {
  const cleanValue = value.replace(/[₹\s]/g, "");

  if (cleanValue.includes(",")) {
    const parts = cleanValue.split(",").reverse();

    let result = 0;
    let multiplier = 1;

    parts.forEach((part, index) => {
      if (index === 0) {
        result += parseInt(part) * multiplier;
        multiplier *= 1000;
      } else {
        result += parseInt(part) * multiplier;
        multiplier *= 100;
      }
    });

    return result;
  }

  return parseFloat(cleanValue);
};

export const formatIndianRupeePrice = (amount: any): string => {
  if (
    amount === undefined ||
    amount === null ||
    amount === 0 ||
    Number.isNaN(amount)
  ) {
    return "Refer the document";
  }

  const numAmount = Number(String(amount).replace(/,/g, ""));
  if (Number.isNaN(numAmount)) {
    return "Refer the document";
  }

  const formatWithUnits = (value: number): string => {
    if (value >= 1e7) {
      const crore = value / 1e7;
      return `${crore.toFixed(2).replace(/\.00$/, "")} Crore`;
    } else if (value >= 1e5) {
      const lakh = value / 1e5;
      return `${lakh.toFixed(2).replace(/\.00$/, "")} Lakh`;
    }
    return value.toLocaleString("en-IN");
  };

  return `₹${formatWithUnits(numAmount)}`;
};

export const getTenderValueCategory = (value: string): string => {
  const numericValue = parseIndianFormat(value);
  if (numericValue < 1000000) return "1"; // Less than 10L
  if (numericValue >= 1000000 && numericValue < 10000000) return "2";
  if (numericValue >= 10000000 && numericValue < 1000000000) return "3";
  return "4";
};

export const formatTenderValue = (value: string): string => {
  const categories: { [key: string]: string } = {
    "1": "Less than ₹10L",
    "2": "₹10L - ₹1Cr",
    "3": "₹1Cr - ₹100Cr",
    "4": "More than ₹100Cr",
  };

  const category = getTenderValueCategory(value);
  return categories[category] || value;
};
