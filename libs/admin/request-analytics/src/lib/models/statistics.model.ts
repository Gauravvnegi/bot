import { colors as randomColors } from '@hospitality-bot/admin/shared';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { get, set } from 'lodash';
import {
  AverageStats,
  RequestResponse,
  RequestStat,
  SentimentStatsResponse,
} from '../types/response.types';

export class InhouseSource {
  inhouseRequestSourceStats: any;
  label: string;
  totalCount: number;

  deserialize(input: any, config) {
    this.inhouseRequestSourceStats = {};
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount']))
    );

    const keys = Object.keys(input.requestSourceStats);

    keys.forEach((key, index) => {
      this.inhouseRequestSourceStats[key] = {
        value: input.requestSourceStats[key],
        color: randomColors[Math.floor(Math.random() * randomColors.length)],
      };
    });

    return this;
  }
}

export class InhouseSentiments {
  label: string;
  totalCount: number;

  deserialize(input: SentimentStatsResponse) {
    this.label = input.label;

    this.totalCount = input.totalCount;

    const keys = Object.keys(input);

    keys.forEach((key) => {
      const currItem = input[key];
      if (
        typeof currItem === 'object' &&
        'label' in currItem &&
        'totalCount' in currItem &&
        'stats' in currItem
      ) {
        this[key] = new Sentiment().deserialize(input[key]);
      }
    });

    return this;
  }
}

export class Sentiment {
  label: string;
  name: string;

  stats: any;
  totalCount: number;
  color: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'totalCount', get(input, ['totalCount'])),
      set({}, 'stats', get(input, ['stats']))
    );

    this.name = convertToTitleCase(this.label);

    return this;
  }
}

export class RequestStats {
  requestStats: { label: string; value: number; color: string }[];
  totalCount: number;

  deserialize(input: RequestResponse) {
    const requestStatKeys = Object.keys(
      input.requestStats
    ) as (keyof RequestStat)[];

    const colors = ['#ff9f40', '#36A2EB', '#FF6384', '#4BC0C0'];
    this.requestStats = requestStatKeys
      // .filter((requestKey) => requestKey !== 'CANCELLED')
      .map((requestKey, index) => {
        return {
          label:
            requestKey === 'TIMEOUT'
              ? 'Timed-out'
              : convertToTitleCase(requestKey),
          value: input.requestStats[requestKey],
          color: colors[index],
        };
      });
    this.totalCount = input.totalCount;
    return this;
  }
}

export class AverageRequestStats {
  averageStats: { label: string; value: number | string; key: string }[];
  createdTickets: number;
  resolvedTickets: number;
  deserialize(input: AverageStats) {
    const statsData = Object.keys(input.averageStats);
    this.averageStats = statsData
      .filter((requestKey) => requestKey === 'averageTimePerJob')
      .map((requestKey) => {
        return {
          label: 'Average Time Taken/Tickets',
          value: `${input.averageStats[requestKey]} Mins`,
          key: 'AverageTime',
        };
      });
    this.createdTickets = input.averageStats.averageCreatedJobs;
    this.resolvedTickets = input.averageStats.averageResolvedJobs;
    return this;
  }
}

const colors = ['#2a8853', '#f76b8a', '#224bd5', '#30e3ca'];
