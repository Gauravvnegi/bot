import { DiscountType } from '../constants';

type DiscountCalcValues = {
  price: number;
  discountedPrice: number;
  discountValue: number;
};

export const discountCalculation = (
  data: Partial<DiscountCalcValues>,
  discountType?: DiscountType
): (DiscountCalcValues & { isPatch: boolean }) | null => {
  if (!discountType) return null;

  const { price, discountValue, discountedPrice } = data;
  const isNum = discountType === DiscountType.FLAT;

  if (price && discountValue) {
    return {
      price,
      discountedPrice: isNum
        ? price - discountValue
        : price - (price * discountValue) / 100,
      discountValue,
      isPatch: !(isNum && discountValue > price),
    };
  }

  if (price && discountedPrice) {
    return {
      price,
      discountedPrice,
      discountValue: isNum
        ? price - discountedPrice
        : 100 * ((price - discountedPrice) / price),
      isPatch: true,
    };
  }

  return null;
};

export function getRandomLightHexColor() {
  // Generate random values for RGB components
  var r = Math.floor(Math.random() * 128) + 128; // Red component biased towards higher values
  var g = Math.floor(Math.random() * 128) + 128; // Green component biased towards higher values
  var b = Math.floor(Math.random() * 128) + 128; // Blue component biased towards higher values

  // Convert RGB components to hex and concatenate
  var hexColor =
    '#' + ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1);

  return hexColor;
}

export function generateArrayItemColor(
  index: number,
  count: number,
  type: 'dark' | 'light' = 'light'
) {
  const saturation = type === 'light' ? 50 : 70; // Saturation value (0-100)

  // Determine lightness based on the type parameter
  const lightness = type === 'light' ? 80 : 30; // Adjust as needed

  const hue = (360 / count) * index; // Vary the hue based on the index
  const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

  return color;
}

export function getListOfRandomLightColor(numberOfColors: number) {
  return Array.from({ length: numberOfColors }, getRandomLightHexColor);
}

export type DaysType =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export const weeks: {
  label: string;
  value: DaysType;
}[] = [
  { label: 'Sun', value: 'SUNDAY' },
  { label: 'Mon', value: 'MONDAY' },
  { label: 'Tue', value: 'TUESDAY' },
  { label: 'Wed', value: 'WEDNESDAY' },
  { label: 'Thu', value: 'THURSDAY' },
  { label: 'Fri', value: 'FRIDAY' },
  { label: 'Sat', value: 'SATURDAY' },
];

export function epochWithoutTime(epoch: number) {
  // Create a new Date object using the epoch timestamp
  const date = new Date(epoch); // multiply by 1000 for milliseconds

  // Extract the date components
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // months are zero-indexed, so add 1
  const day = date.getDate();

  // Construct the date string in the format YYYY-MM-DD
  const formattedDate =
    year +
    '-' +
    (month < 10 ? '0' : '') +
    month +
    '-' +
    (day < 10 ? '0' : '') +
    day;

  const newDate = new Date(formattedDate);

  return newDate.getTime();
}

export function getDayOfWeekFromEpoch(epoch: number) {
  const date = new Date(epoch);
  const dayIndex = date.getUTCDay();

  return { day: weeks[dayIndex].value, dayIndex };
}
