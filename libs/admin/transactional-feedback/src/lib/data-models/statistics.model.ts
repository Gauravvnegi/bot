import { get, set } from 'lodash';

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
  entities;
  departments;
  services;

  deserialize(statistics) {
    this.departments = new Array<any>();
    this.services = new Array<any>();
    this.entities = {};
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
      this.entities[key] = [];
      statistics.entities[key] &&
        Object.keys(statistics.entities[key]).forEach((entity) => {
          this.entities[key].push({
            entity,
            value: statistics.entities[key][entity],
            statistic: statistics.npsStats[key][entity]
              ? statistics.npsStats[key][entity]
              : {},
          });
        });
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
  veryPoor: Distribution;
  poor: Distribution;
  adequate: Distribution;
  good: Distribution;
  veryGood: Distribution;
  outstanding: Distribution;

  deserialize(input) {
    Object.assign(
      this,
      set({}, 'totalCount', get(input, ['totalResponse'])),
      set({}, 'veryPoor', get(input, ['feedbacks', 'VERYPOOR'])),
      set({}, 'poor', get(input, ['feedbacks', 'POOR'])),
      set({}, 'adequate', get(input, ['feedbacks', 'ADEQUATE'])),
      set({}, 'good', get(input, ['feedbacks', 'GOOD'])),
      set({}, 'veryGood', get(input, ['feedbacks', 'VERYGOOD'])),
      set({}, 'outstanding', get(input, ['feedbacks', 'OUTSTANDING']))
    );
    return this;
  }
}

export class Distribution {
  label: string;
  scale: string;
  count: number;
  percent: number;
  color: string;
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

    input.npsPerformace.TOP_PERFORMING.forEach((data) =>
      this.performances.push({ ...data, colorCode: '#1AB99F' })
    );
    input.npsPerformace.LOW_PERFORMING.sort(function (a, b) {
      return b.score - a.score;
    });

    input.npsPerformace.LOW_PERFORMING.forEach((data) =>
      this.performances.push({ ...data, colorCode: '#EF1D45' })
    );

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
        new Data().deserialize(input.feedbacks[key], SharedColors[key])
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

  deserialize(input, color?) {
    Object.assign(
      this,
      set({}, 'label', get(input, ['label'])),
      set({}, 'count', get(input, ['count'])),
      set({}, 'percent', get(input, ['percent'])),
      set({}, 'comparePercent', get(input, ['comparePercent'])),
      set({}, 'color', color)
    );
    return this;
  }
}

export class NPOS {
  data: Outlet[];

  deserialize(input) {
    this.data = new Array<Outlet>();
    input.forEach((data) => this.data.push(new Outlet().deserialize(data)));
    return this;
  }
}

export class Outlet {
  label: string;
  services: Service[];

  deserialize(input) {
    this.services = new Array<Service>();
    Object.assign(this, set({}, 'label', get(input, ['label'])));
    input.services &&
      Object.keys(input.services).forEach((key) => {
        this.services.push(
          new Service().deserialize({
            label: key,
            percentage: input.services[key],
            color: SharedColors[key],
          })
        );
      });

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

export class Bifurcation {
  feedbacks: Service[];
  label: string;
  totalCount: number;

  deserialize(input) {
    this.feedbacks = new Array<Service>();
    Object.assign(
      this,
      set({}, 'totalCount', get(input, ['totalCount'])),
      set({}, 'label', get(input, ['label']))
    );
    Object.keys(input.feedbacks).forEach((key) =>
      this.feedbacks.push(
        new Service().deserialize({
          label: key,
          percentage: input.feedbacks[key],
          color: SharedColors[key],
        })
      )
    );

    return this;
  }
}

export const SharedColors = {
  Received: '#31BB92',
  'Not Received': '#FFEC8C',
  Negative: '#cc052b',
  Positive: '#52b33f',
  Closed: '#4ba0f5',
  'Action Pending': '#ffbf04',
  Lunch: '#f18533',
  Breakfast: '#4974e0',
  Dinner: '#3db76b',
  Quality: '#ffbf04',
};
