import {
  AddedRatePlans,
  DynamicPricingRatePlan,
  RatePlan,
  ReservationRatePlan,
  StaticPricingRatePlan,
} from '../constant/form';
import {
  RoomStatus,
  RoomTypeResponse,
  StatusDetails,
} from '../types/service-response';
import {
  MultipleRoomData,
  MultipleRoomForm,
  SingleRoomData,
  SingleRoomForm,
} from '../types/use-form';

export class SingleRoomList {
  list: SingleRoom[];
  deserialize(input: SingleRoomForm) {
    this.list = new Array<SingleRoom>();
    const { rooms, ...rest } = input;
    rooms.forEach((item) => {
      this.list.push(
        new SingleRoom().deserialize({
          ...item,
          ...rest,
        })
      );
    });

    return this;
  }
}

export class SingleRoom {
  id: string;
  roomNumber: string;
  floorNumber: string;
  currency: string;
  price: number;
  roomTypeId: string;
  featureIds: string[];
  removeFeatures?: string[];
  // status: RoomStatus;
  // remark?: string;
  // currentStatusTo?: number;
  // currentStatusFrom?: number;
  statusDetailsList?: StatusDetails[];
  deserialize(input: SingleRoomData) {
    this.id = input.id ?? '';
    this.roomNumber = input.roomNo ?? '';
    this.floorNumber = input.floorNo ?? '';
    // this.status = input.status;
    this.currency = input.currency ?? '';
    this.price = input.price ?? null;
    this.roomTypeId = input.roomTypeId ?? '';
    this.featureIds = input.featureIds ?? [];
    this.removeFeatures = input?.removeFeatures?.length
      ? input?.removeFeatures
      : null; //as per BE requirement
    // this.remark = input.remark ?? '';
    // this.currentStatusTo = input?.currentStatusTo;
    // this.currentStatusFrom = input?.currentStatusFrom;
    if (input.statusDetails)
      this.statusDetailsList = input.statusDetails.map((item) => ({
        toDate: item.toDate,
        fromDate: item.fromDate,
        isCurrentStatus: item.isCurrentStatus,
        status: item.status,
        remark: item.remark,
      }));
    return this;
  }
}

export class MultipleRoomList {
  list: MultipleRoom[];
  deserialize(input: MultipleRoomForm) {
    this.list = new Array<MultipleRoom>();
    const { rooms, ...rest } = input;
    rooms.forEach((item) => {
      this.list.push(
        new MultipleRoom().deserialize({
          ...item,
          ...rest,
        })
      );
    });
    return this;
  }
}

export class MultipleRoom {
  from: string;
  to: string;
  floorNumber: number;
  roomStatus: RoomStatus;
  currency: string;
  price: number;
  roomTypeId: string;
  featureIds: string[];

  deserialize(input: MultipleRoomData) {
    this.from = input.from ?? '';
    this.to = input.to ?? '';
    this.floorNumber = input.floorNo ?? null;
    this.roomStatus = input.status;
    this.currency = input.currency ?? '';
    this.price = input.price;
    this.roomTypeId = input.roomTypeId ?? '';
    this.featureIds = input?.featureIds ?? [];
    return this;
  }
}

export class RoomTypeForm {
  status: boolean;
  name: string;
  imageUrls: string[];
  description: string;
  complimentaryAmenities: string[];
  paidAmenities: string[];
  staticRatePlans: StaticPricingRatePlan;
  dynamicRatePlans: DynamicPricingRatePlan;
  ratePlans: AddedRatePlans[];
  maxOccupancy: number;
  maxChildren: number;
  maxAdult: number;
  area: number;
  id?: string;
  allRatePlans?: ReservationRatePlan[];

  deserialize(input: RoomTypeResponse) {
    this.id = input?.id;
    this.status = input.status;
    this.name = input.name;
    this.imageUrls = input.imageUrls;
    this.description = input.description;
    this.complimentaryAmenities =
      input.complimentaryAmenities?.map((item) => item.id) ?? [];
    this.paidAmenities = input.paidAmenities?.map((item) => item.id) ?? [];
    this.maxOccupancy = input.occupancyDetails.maxOccupancy;
    this.maxChildren = input.occupancyDetails.maxChildren;
    this.maxAdult = input.occupancyDetails.maxAdult;
    this.area = input.area;

    const defaultRatePlan = input?.ratePlans.filter((item) => item.isBase);
    if (defaultRatePlan.length) {
      this.staticRatePlans = {
        paxPriceCurrency: input.pricingDetails.currency,
        paxAdultPrice: input.pricingDetails?.paxAdult,
        paxChildPrice: input.pricingDetails?.paxChildAboveFive,
        paxChildBelowFive: input.pricingDetails?.paxChildBelowFive,
        discountType: defaultRatePlan[0]?.discount?.type ?? 'PERCENTAGE',
        discountValue: defaultRatePlan[0]?.discount?.value ?? 0,
        bestPriceCurrency: input?.pricingDetails?.currency,
        bestAvailablePrice: input?.pricingDetails?.bestAvailablePrice ?? 0,
        price: defaultRatePlan[0]?.variablePrice ?? 0,
        label: defaultRatePlan[0]?.label,
        basePrice: input?.pricingDetails?.base,
        basePriceCurrency: input?.pricingDetails?.currency,
        ratePlanId: defaultRatePlan[0]?.id,
        status: defaultRatePlan[0]?.status,
        doubleOccupancyCurrency: input.pricingDetails.currency,
        doubleOccupancyPrice: input.pricingDetails.paxDoubleOccupancy,
        tripleOccupancyCurrency: input.pricingDetails.currency,
        tripleOccupancyPrice: input.pricingDetails.paxTripleOccupancy,
      };
      this.dynamicRatePlans = {
        paxPriceCurrency: input.pricingDetails.currency,
        paxAdultPrice: input.pricingDetails.paxAdult,
        paxChildPrice: input.pricingDetails?.paxChildAboveFive,
        paxChildBelowFive: input.pricingDetails?.paxChildBelowFive,
        label: defaultRatePlan[0]?.label,
        basePrice: input.pricingDetails.base,
        basePriceCurrency: input.pricingDetails.currency,
        price: defaultRatePlan[0]?.variablePrice ?? 0,
        maxPriceCurrency: input.pricingDetails.currency,
        maxPrice: input.pricingDetails.max,
        minPriceCurrency: input.pricingDetails.currency,
        minPrice: input.pricingDetails.min,
        ratePlanId: defaultRatePlan[0]?.id,
        status: defaultRatePlan[0]?.status,
        doubleOccupancyCurrency: input.pricingDetails.currency,
        doubleOccupancyPrice: input.pricingDetails.paxDoubleOccupancy,
        tripleOccupancyCurrency: input.pricingDetails.currency,
        tripleOccupancyPrice: input.pricingDetails.paxTripleOccupancy,
      };
    }

    this.ratePlans = input.ratePlans
      .filter((item) => !item.isBase)
      .map((item) => ({
        label: item.label,
        ratePlanId: item.id,
        isBase: item.isBase,
        extraPrice: item.variablePrice,
        currency: input.pricingDetails.currency,
        description: item?.description,
        status: item.status,
        sellingPrice: item?.sellingPrice,
        total: item?.total ?? 0,
      }));

    // For Reservation
    this.allRatePlans = input.ratePlans.map((item) => ({
      label: item.label,
      value: item.id,
      isBase: item.isBase,
      sellingPrice: item?.sellingPrice,
    }));

    return this;
  }
}
