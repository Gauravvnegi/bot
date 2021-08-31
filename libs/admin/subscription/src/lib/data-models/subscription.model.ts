import { CommunicationConfig } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { get, set } from 'lodash';
import * as moment from 'moment';

export class SubscriptionPlan {
  description: string;
  endDate: number;
  plan: string;
  startDate: number;
  deploymentType: string;
  supportType: string;
  upgradable: boolean;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'supportType', get(input, ['technicalSupport', 'type'])),
      set({}, 'upgradable', get(input, ['planUpgradable'])),
      set({}, 'description', get(input, ['description'])),
      set({}, 'plan', get(input, ['planType'])),
      set({}, 'endDate', get(input, ['endDate'])),
      set({}, 'startDate', get(input, ['startDate']))
    );
    this.deploymentType = input.features?.ESSENTIALS?.filter(
      (data) => data.name === 'DEPLOYMENT'
    )[0]?.description;
    this.supportType = input.features?.COMMUNICATION?.filter(
      (data) => data.name === 'TECHICAL_SUPPORT'
    )[0]?.description;
    return this;
  }

  getStartDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(
      this.startDate,
      'DD/MM/YY',
      timezone
    );
  }

  getEndDate(timezone = '+05:30') {
    return DateService.getDateFromTimeStamp(this.endDate, 'DD/MM/YY', timezone);
  }
}

export class PlanUsage {
  users;
  guests;
  ocr;
  channels;

  deserialize(input: any) {
    this.users = input.features?.MODULE?.filter(
      (data) => data.name === 'USERS'
    )[0];
    this.guests = input.features?.MODULE?.filter(
      (data) => data.name === 'GUESTS'
    )[0];
    this.ocr = input.features?.INTEGRATION?.filter(
      (data) => data.name === 'OCR'
    )[0];
    Object.assign(
      this,
      set({}, 'channels', get(input, ['features', 'CHANNELS']))
    );
    return this;
  }
}

export class PlanUsageCharts {
  userCount: GraphData[];
  guestCount: GraphData[];
  ocrCount: GraphData[];

  deserialize(input: any) {
    this.userCount = new Array<GraphData>();
    this.guestCount = new Array<GraphData>();
    this.ocrCount = new Array<GraphData>();

    input?.userCount &&
      Object.keys(input.userCount).forEach((key) => {
        this.userCount.push(
          new GraphData().deserialize({
            label: key,
            data: input.userCount[key],
          })
        );
      });

    input?.guestCount &&
      Object.keys(input.guestCount).forEach((key) => {
        this.guestCount.push(
          new GraphData().deserialize({
            label: key,
            data: input.guestCount[key],
          })
        );
      });

    input?.ocrCount &&
      Object.keys(input.ocrCount).forEach((key) => {
        this.ocrCount.push(
          new GraphData().deserialize({ label: key, data: input.ocrCount[key] })
        );
      });

    return this;
  }
}

export class PlanUsagePercentage {
  guestUsagePercentage: number;
  ocrUsagePercentage: number;
  userUsagePercentage: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'guestUsagePercentage', get(input, ['guestUsagePercentage'])),
      set({}, 'ocrUsagePercentage', get(input, ['ocrUsagePercentage'])),
      set({}, 'userUsagePercentage', get(input, ['userUsagePercentage']))
    );

    return this;
  }
}

export class GraphData {
  label: string;
  value: number;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'value', get(input, ['data']))
    );

    return this;
  }
}

export class TableData {
  data: TableCell[];

  deserialize(input: any) {
    this.data = new Array<TableCell>();
    input?.features &&
      Object.keys(input?.features).forEach((key) => {
        input.features[key].forEach((feature) => {
          if (feature.active) {
            this.data.push(new TableCell().deserialize(feature));
          }
        });
      });
    return this;
  }
}

export class TableCell {
  id: string;
  serviceType: string;
  name: string;
  limit: string;
  usage: string;

  deserialize(input: any) {
    Object.assign(
      this,
      set({}, 'id', get(input, ['id'])),
      set({}, 'serviceType', get(input, ['type'])),
      set({}, 'name', get(input, ['label'])),
      set({}, 'limit', get(input, ['cost', 'usageLimit'])),
      set({}, 'usage', get(input, ['currentUsage']))
    );
    return this;
  }
}

export class CommunicationChannels {
  channels;

  deserialize(input) {
    this.channels = new Array<any>();

    input.forEach((data) => {
      this.channels.push({
        ...{
          active: data.active,
          label: data.label,
        },
        ...CommunicationConfig[data.name],
      });
    });

    return this;
  }
}
