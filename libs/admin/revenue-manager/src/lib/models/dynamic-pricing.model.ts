import { FormArray, FormGroup } from '@angular/forms';
import {
  ConfigItemType,
  ConfigRuleType,
  ConfigType,
  DynamicPricingRequest,
} from '../types/dynamic-pricing.types';

export class DynamicPricingFactory {
  static buildRequest(form: FormGroup, type: ConfigType) {
    let data: DynamicPricingRequest;
    switch (type) {
      case 'OCCUPANCY':
        data = DynamicPricingFactory.occupancyRequest(form);
        break;
      case 'DATE_TIME_TRIGGER':
        // add method for date time trigger
        break;
      case 'INVENTORY_REALLOCATION':
        // add method for date time INVENTORY REALLOCATION
        break;
    }

    return data;
  }

  static occupancyRequest(form: FormGroup) {
    const {
      fromDate,
      toDate,
      name,
      configCategory,
      roomType,
      roomTypes,
      selectedDays,
      status,
    } = form.controls;

    return {
      status: status.value,
      name: name.value,
      fromDate: fromDate.value.getTime(),
      toDate: toDate.value.getTime(),
      daysIncluded: selectedDays.value.map((day: string) => day.toUpperCase()),
      configItems: (roomTypes as FormArray).controls.map((room: FormGroup) => {
        const { occupancy, roomId } = room.controls;
        const configItem: ConfigItemType = {
          type: configCategory.value,
          id: roomId.value,
          configRules: (occupancy as FormArray).controls.map(
            (rule: FormGroup) => {
              const { discount, end, rate, start } = rule.controls;
              const status = true;
              return {
                occupancyStart: +start.value,
                occupancyEnd: +end.value,
                status: status ? 'ACTIVE' : 'INACTIVE',
                discountOrMarkup: {
                  type: 'PERCENTAGE',
                  value: +discount.value,
                },
              };
            }
          ),
        };
        return configItem;
      }),
    } as DynamicPricingRequest;
  }
}
