import { PricingDetails } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  BarPriceFormType,
  BarPriceTypes,
  BarRatePlans,
  UpdateBarPriceRequest,
} from '../types/bar-price.types';
import { BarPriceRatePlan } from '../constants/barprice.const';
import { Accordion } from 'primeng/accordion';

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
      });
    });

    return { inventoryList: data };
  }
}

export function openAccordion(data: {
  accordion: Accordion;
  index: number;
  isScrollToTop?: boolean;
  wait?: number;
}) {
  data.wait = data.wait ? data.wait : 210;
  const tab = data.accordion.tabs[data.index];
  console.log(data.accordion.tabs)
  tab.selected = true;
  if (data.isScrollToTop) {
    setTimeout(() => {
      const mainLayout = document.getElementById('main-layout');
      mainLayout.scrollBy({ top: mainLayout.scrollHeight, behavior: 'smooth' });
    }, data.wait);
  }
}
