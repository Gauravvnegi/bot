import { get, set } from 'lodash';
import { Chip } from '../types/feedback.type';

export class ARTGraph {
  data: ART[];
  average: number;

  deserialize(input) {
    this.data = new Array<ART>();

    input.artGraph?.forEach((item) =>
      this.data.push(new ART().deserialize(item))
    );
    this.average = input.average;
    return this;
  }
}

export class ART {
  label: string;
  colorCode: string;
  value: number;
  feedbackCount: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'value', get(input, ['resolutionTime'])),
      set({}, 'feedbackCount', get(input, ['resolutioncount']))
    );
    this.colorCode =
      input.resolutionTime <= 12
        ? '#508919'
        : input.resolutionTime <= 24
        ? '#ff8f00'
        : '#ef1d45';

    return this;
  }
}

export class NPS {
  label: string;
  score: number;
  npsGraph: any;

  deserialize(statistics) {
    Object.assign(
      this,
      set({}, 'label', get(statistics, ['label'])),
      set({}, 'score', get(statistics, ['score'])),
      set({}, 'npsGraph', get(statistics, ['npsGraph']))
    );
    return this;
  }
}

export class NPSDepartments {
  departments: Department[];

  deserialize(statistics) {
    const keys = Object.keys(statistics);
    this.departments = new Array<Department>();
    keys.forEach((key) => {
      this.departments.push(statistics[key]);
    });
    return this;
  }
}

export class Department {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  difference: number;
  minScore: number;
  maxScore: number;
}

export class NPSAcrossServices {
  npsStats;
  departments;
  services: Chip[];

  deserialize(statistics) {
    this.departments = new Array<any>();
    this.services = new Array<Chip>();
    this.npsStats = {};
    Object.keys(statistics.departments).forEach((key) =>
      this.departments.push({ key, value: statistics.departments[key] })
    );
    this.services.push({
      label: 'All',
      icon: '',
      value: 'ALL',
      total: 0,
      isSelected: true,
      type: '',
    });
    Object.keys(statistics.services).forEach((key) => {
      this.services.push({
        label: statistics.services[key],
        icon: '',
        value: key,
        total: 0,
        isSelected: false,
        type: 'initiated',
      });
      this.npsStats[key] = {
        ...statistics.npsStats[key],
        label: statistics.services[key],
      };
    });
    return this;
  }
}

export class NPSTouchpoints {
  departments;
  chips;
  values;
  maxBarCount;

  deserialize(statistics, time) {
    this.departments = new Array<any>();
    this.values = new Array<any>();
    this.chips = {};
    this.maxBarCount = 3;
    Object.keys(statistics.departments).forEach((key) => {
      this.departments.push({ key, value: statistics.departments[key] });
      if (statistics.entities[key]) {
        this.chips[key] = [];
        this.chips[key].push({
          label: 'All',
          icon: '',
          value: 'ALL',
          total: 0,
          isSelected: true,
          type: '',
        });
        Object.keys(statistics.entities[key]).forEach((touchpoint) => {
          this.chips[key].push({
            label: statistics.entities[key][touchpoint],
            icon: '',
            value: touchpoint,
            total: 0,
            isSelected: false,
            type: 'initiated',
          });
          if (!time) {
            this.values.push({
              key: touchpoint,
              value: statistics.entities[key][touchpoint],
              statistic: statistics.npsStats[touchpoint],
            });
          }
        });
      }
    });
    if (time) {
      Object.keys(statistics.npsStatsByTime).forEach((key, i) => {
        this.values.push({ value: key, data: [] });
        this.maxBarCount =
          Object.keys(statistics.npsStatsByTime[key]).length > this.maxBarCount
            ? Object.keys(statistics.npsStatsByTime[key]).length
            : this.maxBarCount;
        Object.keys(statistics.npsStatsByTime[key]).forEach((dataKey) => {
          this.values[i].data.push({
            statistic: statistics.npsStatsByTime[key][dataKey],
          });
        });
      });
    }
    this.values.sort(function (a, b) {
      return parseInt(a.value) - parseInt(b.value);
    });
    return this;
  }
}

export class Touchpoint {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  difference: number;
  minScore: number;
  maxScore: number;
  colorCode: string;
}

export class FeedbackDistribution {
  totalCount: number;
  data: Distribution[];

  deserialize(input) {
    this.data = new Array<Distribution>();
    Object.keys(input.feedbacks).forEach((key) =>
      this.data.push(
        new Distribution().deserialize({ ...input.feedbacks[key], key })
      )
    );
    Object.assign(this, set({}, 'totalCount', get(input, ['totalResponse'])));
    return this;
  }
}

export class Distribution {
  label: string;
  scale: string;
  count: number;
  percent: number;
  comparePercent: number;
  color: string;
  key: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'scale', get(input, ['scale'])),
      set({}, 'count', get(input, ['count'])),
      set({}, 'percent', get(input, ['percent'])),
      set({}, 'comparePercent', get(input, ['comparePercent'])),
      set({}, 'color', get(input, ['colorCode'])),
      set({}, 'key', get(input, ['key']))
    );

    return this;
  }
}

export class GlobalNPS {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  comparisonPercent: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['globalNpsStats', 'label'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set({}, 'positive', get(input, ['globalNpsStats', 'POSITIVE'])),
      set({}, 'negative', get(input, ['globalNpsStats', 'NEGATIVE'])),
      set({}, 'neutral', get(input, ['globalNpsStats', 'NEUTRAL']))
    );
    return this;
  }
}

export class PerformanceNPS {
  label: string;
  performances: Touchpoint[];

  deserialize(input) {
    this.performances = new Array<Touchpoint>();
    Object.assign(this, set({}, 'label', get(input, ['label'])));

    input.npsPerformace.forEach((data) => {
      this.performances.push({
        ...data,
        colorCode:
          data.score < 40
            ? '#ef1d45'
            : data.score <= 80
            ? '#ff8f00'
            : '#508919',
      });
    });
    input.npsPerformace.sort(function (a, b) {
      return b.score - a.score;
    });
    return this;
  }
}

export class SharedStats {
  totalResponse: number;
  feedbacks: Data[];

  deserialize(input) {
    this.feedbacks = new Array<Data>();
    Object.assign(
      this,
      set({}, 'totalResponse', get(input, ['totalResponse']))
    );

    Object.keys(input.feedbacks).forEach((key) =>
      this.feedbacks.push(
        new Data().deserialize(
          {
            ...input.feedbacks[key],
            key: key.toUpperCase().split(' ').join(''),
          },
          SharedColors[key]
        )
      )
    );
    return this;
  }
}

export class Data {
  label: string;
  count: number;
  percent: number;
  comparePercent: number;
  color: string;
  key: string;

  deserialize(input, color?) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'count', get(input, ['count'])),
      set({}, 'percent', get(input, ['percent'])),
      set({}, 'comparePercent', get(input, ['comparePercent'])),
      set({}, 'color', color),
      set({}, 'key', get(input, ['key']))
    );
    return this;
  }
}

export class NPOS {
  data: Outlet[];
  chipLabels: string[];

  deserialize(input) {
    this.data = new Array<Outlet>();
    this.chipLabels = new Array<string>();
    input.forEach((data) => {
      this.data.push(new Outlet().deserialize(data));
      this.chipLabels.push(data.label);
    });
    return this;
  }
}

export class Outlet {
  label: string;
  services: Service[];

  deserialize(input) {
    this.services = new Array<Service>();
    Object.assign(this, set({}, 'label', get(input, ['label'])));
    Object.keys(input.services).forEach((key) =>
      this.services.push(
        new Service().deserialize({
          label: key,
          percentage: input.services[key],
          color: SharedColors[key.toUpperCase()],
        })
      )
    );

    // this.services = new Services().deserialize(input.services);
    return this;
  }
}

export class Service {
  color: string;
  percentage: number;
  label: string;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'color', get(input, ['color'])),
      set({}, 'percentage', get(input, ['percentage'])),
      set({}, 'label', get(input, ['label']))
    );
    return this;
  }
}

export class Bifurcation {
  feedbacks: Status[];
  label: string;
  totalCount: number;

  deserialize(input) {
    this.feedbacks = new Array<Status>();
    Object.assign(
      this,
      set({}, 'totalCount', get(input, ['totalCount'])),
      set({}, 'label', get(input, ['label']))
    );
    Object.keys(input.stats).forEach((key) =>
      this.feedbacks.push(
        new Status().deserialize({
          ...input.stats[key],
          color: SharedColors[key.toUpperCase()],
        })
      )
    );

    return this;
  }
}

export class Status {
  label: string;
  score: number;
  comparisonPercent: number;
  color: string;
  key: string;
  selected: boolean;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'color', get(input, ['color'])),
      set({}, 'score', get(input, ['score'])),
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set({}, 'label', get(input, ['label'])),
      set({}, 'selected', get(input, ['selected'], false))
    );
    this.key = input.key
      ? input.key
      : this.label.toUpperCase().split(' ').join('');
    return this;
  }
}

export class GTM {
  comparisonPercent: number;
  CLOSED: number;
  REMAINING: number;
  score: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'comparisonPercent', get(input, ['comparisonPercent'])),
      set({}, 'CLOSED', get(input, ['gtmStatData', 'CLOSED'])),
      set({}, 'REMAINING', get(input, ['gtmStatData', 'REMAINING'])),
      set({}, 'score', get(input, ['score']))
    );

    return this;
  }
}

export const SharedColors = {
  Received: '#4ba0f5',
  'Not Received': '#ef1d45',
  Dropped: '#ffec8c',
  Negative: '#cc052b',
  Positive: '#52b33f',
  Closed: '#4ba0f5',
  'Action Pending': '#ffbf04',
  Staff: '#f18533',
  Cleaniness: '#4974e0',
  Pricing: '#3db76b',
  Quality: '#ffbf04',
  READ: '#4ba0f5',
  UNREAD: '#c5c5c5',
  ACTIONED: '#31bb92',
  LUNCH: '#f18533',
  BREAKFAST: '#4974e0',
  DINNER: '#3db76b',
  INPROGRESS: '#4ba0f5',
  RESOLVED: '#31bb92',
  OPEN: '#4ba0f5',
  CLOSED: '#ff6804',
  TODO: '#c5c5c5',
  TIMEOUT: '#ef1d45',
  NOACTION: '#ff8f00',
};

export class NPOSVertical {
  Breakfast: ServiceStat[];
  Lunch: ServiceStat[];
  Dinner: ServiceStat[];

  deserialize(input) {
    this.Breakfast = new Array<ServiceStat>();
    this.Lunch = new Array<ServiceStat>();
    this.Dinner = new Array<ServiceStat>();
    const chipLabels = new Array<string>();

    input.forEach((data) => {
      chipLabels.push(data.label);
      if (data.npsStats.Breakfast)
        this.Breakfast.push(
          new ServiceStat().deserialize({
            ...data.npsStats.Breakfast,
            label: data.label,
          })
        );
      if (data.npsStats.Lunch)
        this.Lunch.push(
          new ServiceStat().deserialize({
            ...data.npsStats.Lunch,
            label: data.label,
          })
        );
      if (data.npsStats.Dinner)
        this.Dinner.push(
          new ServiceStat().deserialize({
            ...data.npsStats.Dinner,
            label: data.label,
          })
        );
    });

    return { verticalData: this, chipLabels };
  }
}

export class ServiceStat {
  label: string;
  maxScore: number;
  minScore: number;
  negative: number;
  neutral: number;
  positive: number;
  score: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'maxScore', get(input, ['maxScore'])),
      set({}, 'negative', get(input, ['negative'])),
      set({}, 'neutral', get(input, ['neutral'])),
      set({}, 'positive', get(input, ['positive'])),
      set({}, 'score', get(input, ['score']))
    );

    return this;
  }
}

export class Bifurcations {
  data: Bifurcation[];

  deserialize(input) {
    this.data = new Array<Bifurcation>();
    input.forEach((service) =>
      this.data.push(new Bifurcation().deserialize(service))
    );

    return this;
  }
}

export class Disengagement {
  gtmClosureGraph: GtmClosureGraph;
  gtmBreakDown: GtmBreakdown;
  disengagementDrivers: Status[];
  total: number;
  selectedItemColor: string;

  deserialize(input) {
    this.total = 0;
    this.disengagementDrivers = new Array<Status>();
    this.gtmClosureGraph = new GtmClosureGraph().deserialize({
      closerGraph: input.gtmClosedRate?.closerGraph?.closerGraphStats,
      gtmGraph: input.gtmClosedRate?.gtmGraph?.gtmGraphStats,
    });
    this.gtmBreakDown = new GtmBreakdown().deserialize(input.gtmbreakDown);
    this.selectedItemColor = '#e61042';
    Object.keys(input.disengagmentDrivers).forEach((key, i) => {
      this.disengagementDrivers.push(
        new Status().deserialize({
          label: input.departmenList[key],
          score: input.disengagmentDrivers[key],
          key,
          color: this.colors[i],
          selected: key === input.entityType,
        })
      );
      this.total += input.disengagmentDrivers[key];
    });

    return this;
  }
  colors = [
    '#b8bbbe',
    '#b2b7bc',
    '#99a6b5',
    '#909090',
    '#7e7e7e',
    '#696969',
    '#363636',
  ];
}

export class GtmClosureGraph {
  closerGraph;
  gtmGraph;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'closerGraph', get(input, ['closerGraph'])),
      set({}, 'gtmGraph', get(input, ['gtmGraph']))
    );

    return this;
  }
}

export class GtmBreakdown {
  HIGH_RISK: number;
  HIGH_RISK_PERCENTAGE: number;
  MEDIUM_RISK: number;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'HIGH_RISK', get(input, ['HIGH_RISK'])),
      set({}, 'HIGH_RISK_PERCENTAGE', get(input, ['HIGH_RISK_PERCENTAGE'])),
      set({}, 'MEDIUM_RISK', get(input, ['MEDIUM_RISK']))
    );

    return this;
  }
}
