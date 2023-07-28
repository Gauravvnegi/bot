import { Injectable } from '@angular/core';
import { RoomTypeFormData } from '../constant/form';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  getRoomTypeModData(
    roomTypeData: RoomTypeFormData,
    isPricingDynamic: boolean
  ) {
    const {
      complimentaryAmenities,
      paidAmenities,
      staticRatePlans,
      dynamicRatePlans,
      ratePlans,
      ...rest
    } = roomTypeData;

    const {
      ratePlanId,
      discountType,
      discountValue,
      ...restRatePlan
    } = staticRatePlans;

    let staticRatePlanModData = {
      ...restRatePlan,
      ratePlanId: ratePlanId || null,
    };

    let dynamicRatePlanModData = {
      ratePlanId: dynamicRatePlans?.ratePlanId || null,
      ...dynamicRatePlans,
    };

    const defaultRatePlan = isPricingDynamic
      ? dynamicRatePlanModData
      : staticRatePlanModData;

    const addedRatePlans = ratePlans.map((item) => ({
      label: item.label,
      variablePrice: item.extraPrice,
      isBase: false,
      description: item.description,
      ...(!isPricingDynamic
        ? {
            discount: {
              type: discountType,
              value: discountValue,
            },
          }
        : {}),
    }));

    const data = {
      ...rest,
      defaultRatePlan,
      addedRatePlans,
      roomAmenityIds: [...complimentaryAmenities, ...paidAmenities],
    };

    const defaultPlan = {
      label: defaultRatePlan.label,
      isBase: true,
      ...(!isPricingDynamic
        ? {
            discount: {
              type: discountType,
              value: discountValue,
            },
          }
        : {}),
    };

    const roomTypeFormData = new RoomTypeData();

    roomTypeFormData.area = data.area ?? 0;
    roomTypeFormData.description = data.description ?? '';
    roomTypeFormData.imageUrls = data.imageUrls;
    roomTypeFormData.name = data.name;
    roomTypeFormData.occupancyDetails = {
      maxAdult: data.maxAdult,
      maxOccupancy: data.maxOccupancy,
      maxChildren: data?.maxChildren ?? 0,
    };
    if (isPricingDynamic)
      roomTypeFormData.pricingDetails = {
        max: dynamicRatePlanModData?.maxPrice,
        min: dynamicRatePlanModData?.minPrice,
        currency: dynamicRatePlanModData.maxPriceCurrency,
        base: dynamicRatePlanModData.basePrice,
        paxAdult: dynamicRatePlanModData.paxAdultPrice,
        paxChild: dynamicRatePlanModData.paxChildPrice,
      };
    else
      roomTypeFormData.pricingDetails = {
        currency: staticRatePlanModData?.basePriceCurrency,
        base: staticRatePlanModData?.basePrice,
        paxAdult: staticRatePlanModData?.paxAdultPrice,
        paxChild: staticRatePlanModData?.paxChildPrice,
      };
    roomTypeFormData.ratePlans = [defaultPlan, ...addedRatePlans];
    roomTypeFormData.roomAmenityIds = data.roomAmenityIds;
    roomTypeFormData.status = data.status;

    debugger;
    return roomTypeFormData;
  }
}

export class RoomTypeData {
  status: boolean;
  name: string;
  imageUrls: string[];
  description: string;
  occupancyDetails: {
    maxOccupancy: number;
    maxChildren: number;
    maxAdult: number;
  };
  pricingDetails: {
    max?: number;
    min?: number;
    currency: string;
    base: number;
    paxAdult: number;
    paxChild: number;
  };
  hsnCode: string;
  area: number;
  ratePlans: RatePlanFormData[];
  roomAmenityIds: string[];
}

export type RatePlanFormData = {
  label: string;
  variablePrice?: number;
  description?: string;
  isBase?: boolean;
  discount?: {
    type: string;
    value: number;
  };
};
