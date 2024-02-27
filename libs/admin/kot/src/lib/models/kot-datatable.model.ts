import { EntityState } from '@hospitality-bot/admin/shared';
import {
  Item,
  KotResponse,
  KotTimeFilterResponse,
  OrderConfigResponse,
  OrderListResponse,
  OrderResponse,
} from '../types/kot-card.type';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { StringRepresentable } from 'lodash';

export class KotList {
  entityTypeCounts: EntityState<string>;
  total: number;
  records: Kot[];

  deserialize(value: OrderListResponse) {
    this.total = value?.total;
    this.entityTypeCounts = value?.entityTypeCounts;

    this.records = value?.records?.reduce((acc, order) => {
      const orderKots = order.kots.map((kot) =>
        new Kot().deserialize(order, kot)
      );
      return [...acc, ...orderKots];
    }, []);

    return this;
  }
}

export class Kot {
  id: string;
  orderId: string;
  orderNo: string;
  kotNo: string;
  kotType: string;
  timer: string;
  menuItem: any[];
  kotInstructions: string;
  createdTime: number;
  status: string; //'PREPARING' | 'PREPARED';
  color: string;

  deserialize(order: OrderResponse, kot: KotResponse) {
    this.id = kot?.id;
    this.orderId = order?.id;
    this.kotNo = kot?.number;
    this.orderNo = order?.number;
    this.kotType = convertToNormalCase(order?.type);
    this.kotInstructions = kot?.instructions;
    this.status = kot?.status;
    this.timer =
      kot?.status === 'PREPARED'
        ? convertMillisecondsToMinSec(kot?.preparedTime)
        : getTime(kot?.created);

    this.createdTime = kot?.created;
    this.color = this.getColor(this.timer);
    this.menuItem = kot?.items.map((item) => new MenuItem().deserialize(item));
    return this;
  }

  // change time
  getTime() {
    this.timer = getTime(this.createdTime);
    this.color = this.getColor(this.timer);
  }

  getColor(timer) {
    const time = parseInt(timer?.split(':')[0]);
    switch (true) {
      case time >= 5 && time < 10:
        return '#FEB30B';
      case time >= 10 && time < 15:
        return '#FF9F40';
      case time >= 15:
        return '#F43636';

      default:
        return 'green';
    }
  }
}

export class MenuItem {
  name: string;
  instructions: string;
  isExpandedInstruction: boolean;
  quantity: number;
  mealPreference: string;

  deserialize(value: Item) {
    this.name = value?.description.trim();
    this.instructions = value?.remarks;
    this.isExpandedInstruction = false;
    this.quantity = value?.unit;
    this.mealPreference = value?.menuItem?.mealPreference;
    return this;
  }
}

export function getTime(createdTime: number) {
  const currentTime = Date.now(); // Get current time in milliseconds
  const timeDifferenceInMs = currentTime - createdTime; // Calculate time difference in milliseconds
  const timeDifferenceInSec = Math.floor(timeDifferenceInMs / 1000); // Convert milliseconds to seconds

  // Calculate minutes and seconds
  const minutes = Math.floor(timeDifferenceInSec / 60);
  const seconds = timeDifferenceInSec % 60;

  // Format minutes and seconds with leading zeros
  const formattedMinutes = (minutes < 10 ? '0' : '') + minutes;
  const formattedSeconds = (seconds < 10 ? '0' : '') + seconds;

  // Construct the output string
  const output = `${formattedMinutes}:${formattedSeconds} mins`;

  // Return the formatted output
  return output;
}

function convertMillisecondsToMinSec(milliseconds) {
  // Convert milliseconds to seconds
  let totalSeconds = Math.floor(milliseconds / 1000);

  // Calculate minutes and remaining seconds
  let minutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  // Format the output
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds} mins`;
}

export class OrderConfigData {
  type: {};
  kotTimeFilter: KotFilter[];
  kotFilterConfigurations: Record<string, (value: number) => boolean>;

  deserialize(value: OrderConfigResponse) {
    this.type = value?.type;

    this.kotTimeFilter = value?.timeFilters.map((item) =>
      new KotFilter().deserialize(item)
    );

    this.kotTimeFilter.unshift({
      label: 'All',
      value: 'ALL',
      total: 0,
      isSelected: true,
      type: 'default',
    } as KotFilter);

    this.kotFilterConfigurations = value?.timeFilters.reduce((acc, key) => {
      acc[key.minValue] = (value: number): boolean => {
        return (
          value >= key.minValue &&
          (key.maxValue
            ? value < key?.maxValue
            : value < Number.MAX_SAFE_INTEGER)
        );
      };

      return acc;
    }, {});

    return this;
  }
}

export class KotFilter {
  label: string;
  value: number | string;
  total?: number;
  isSelected: boolean;
  type: string;
  minValue?: number;
  maxValue?: number;
  color?: string;

  deserialize(value: KotTimeFilterResponse) {
    this.label = value?.label;
    this.value = value?.minValue;
    this.total = value?.maxValue;
    this.isSelected = false;
    this.type = value?.unit;
    this.minValue = value?.minValue;
    this.maxValue = value?.maxValue;
    this.color = value?.colorCode;
    return this;
  }
}
