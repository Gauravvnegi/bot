import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  BarPriceFormType,
  BarPriceTypes,
  UpdateBarPriceRequest,
} from '../types/bar-price.types';
import { BarPriceRatePlan } from '../constants/barprice.const';

export class BarPriceFactory {
  static buildRequest(inputForm: BarPriceFormType): UpdateBarPriceRequest {
    let data: BarPriceTypes[] = [] as BarPriceTypes[];
    inputForm.barPrices = inputForm.barPrices.filter((item) =>
      inputForm.roomType.includes(item.id)
    );

    inputForm.roomType.forEach((roomTypeId) => {
      const currentBarPrice = inputForm.barPrices.find(
        (item) => item.id === roomTypeId
      );
      const priceDetails = {
        base: +currentBarPrice.price,
        paxAdult: +currentBarPrice.adult,
        paxChildAboveFive: +currentBarPrice.chileFiveToTwelve,
        paxChildBelowFive: +currentBarPrice.childBelowFive,
        paxDoubleOccupancy: +currentBarPrice.ratePlans.find(
          (item) => item.label == BarPriceRatePlan.double
        )?.value,
        paxTripleOccupancy: currentBarPrice.ratePlans.find(
          (item) => item.label == BarPriceRatePlan.triple
        )?.value,
      } as PricingDetails;

      data.push({
        id: roomTypeId,
        isBaseRoomType: currentBarPrice.isBase,
        pricingDetails: priceDetails,
        ratePlans: [
          ...currentBarPrice.ratePlans
            .filter(
              (item) =>
                !(
                  item.label == BarPriceRatePlan.double ||
                  item.label == BarPriceRatePlan.triple
                )
            )
            .map((item) => ({
              id: item.id,
              variablePrice: +item.value,
            })),
          {
            id: currentBarPrice.baseId,
            variablePrice: +currentBarPrice.variablePrice,
            isBase: true,
          },
        ],
      } as BarPriceTypes);
    });
    return { inventoryList: data };
  }
}
