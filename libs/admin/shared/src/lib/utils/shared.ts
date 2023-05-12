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
  const isNum = discountType === DiscountType.NUMBER;

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
