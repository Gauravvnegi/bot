import { ModuleNames, ProductNames } from '../constants';
import { labels, routesConfig } from '../constants/config';

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
 * Convert module/product name to route (underScore to dash)
 * Also checks if module name is attached with route
 * @param name Module or product name
 * @returns route
 */
export const convertNameToRoute = (name: ModuleNames | ProductNames) => {
  const route = routesConfig[name];
  if (route) return route;

  return name.toLowerCase().split('_').join('-');
};
