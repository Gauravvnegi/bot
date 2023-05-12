export const ValueFormatter = (num, digits) => {
  const units = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'MM' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
  ];
  let i;
  for (i = units.length - 1; i > 0; i--) {
    if (num >= units[i].value) {
      break;
    }
  }
  return `${Number.parseFloat((num / units[i].value).toFixed(digits))} ${
    units[i].symbol
  }`;
};
