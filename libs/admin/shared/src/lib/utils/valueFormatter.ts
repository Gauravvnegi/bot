import { labels } from '../constants/config';

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

/**
 * Handle conversion of the key to label format
 * @param str key value
 * @returns label value
 */
export function convertToTitleCase(str: string) {
  const value = labels[str];

  return value
    ? value
    : str
        .toLowerCase()
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}
/**
 * @function camelToKebab
 * @description converts camel case to kebab cas
 * @param str
 * @returns kebab formatted string
 */
export function camelToKebab(str) {
  return str.replace(/[A-Z]/g, (match) => `-${match.toLowerCase()}`);
}

/**
 * @function kebabToCamel
 * @description converts kebab case to camel case
 * @param str
 * @returns camel formatted string
 */
export function kebabToCamel(str) {
  return str.replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
}

/**
 * @function toCurrency
 * @description converts number to currency format
 * @param number number to be converted
 * @returns currency formatted string
 */
export function toCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
) {
  return amount?.toLocaleString(locale, {
    style: 'currency',
    currency: currency,
  });
}

export function currencyToNumber(currency: string) {
  return Number(currency.replace(/[^0-9.-]+/g, ''));
}
