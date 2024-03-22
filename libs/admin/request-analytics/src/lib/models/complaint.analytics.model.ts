import { labels } from 'libs/admin/shared/src/lib/constants/config';
import {
  CategoryStatsResponse,
  ComplaintBreakDownResponse,
  ComplaintsDataResponse,
  DistributionStatsResponse,
} from '../types/response.types';
import { DualPlotDataset } from '@hospitality-bot/admin/shared';

export class ComplaintBreakDown {
  total: number;
  complaintCategoryStats: ComplaintCategoryStats;
  distributionStats: DistributionStats;
  complaintsData: ComplaintsData;
  complaintCategoryBreakDownStats: ComplaintCategoryBreakDownStats;

  deserialize(input: ComplaintBreakDownResponse) {
    this.complaintCategoryStats = new ComplaintCategoryStats().deserialize(
      input?.categoryStats
    );
    this.total = input?.totalCount;

    this.distributionStats = new DistributionStats().deserialize(
      input?.distributionStats
    );

    this.complaintsData = new ComplaintsData().deserialize(
      input?.complaintsData
    );

    this.complaintCategoryBreakDownStats = new ComplaintCategoryBreakDownStats().deserialize(
      input.categoryStats
    );
    return this;
  }
}

export class ComplaintsData {
  data: DualPlotDataset[];

  deserialize(input: ComplaintsDataResponse) {
    this.data = [
      {
        label: 'Complaint',
        data: Object.values(
          input?.totalComplaintsGraph.totalComplaintGraphStats
        ),
        fill: false,
        borderColor: '#FF6384',
        backgroundColor: '#FF6384',
        pointBorderColor: '#FF6384',
        pointHoverBackgroundColor: '#FF6384',
        pointHoverBorderColor: '#FF6384',
      },
      {
        label: 'Closed',
        data: Object.values(
          input?.closedComplaintsGraph.closedComplaintGraphStats
        ),
        borderColor: '#C5C5C5',
        backgroundColor: '#C5C5C5',
        pointBorderColor: '#C5C5C5',
        pointHoverBackgroundColor: '#C5C5C5',
        pointHoverBorderColor: '#C5C5C5',
        fill: false,
      },
    ];

    return this;
  }
}

export class ComplaintCategoryBreakDownStats {
  data: { label: string; score: number; colorCode: string; percentage }[] = [];
  maxNumber: number = 0;

  deserialize(input: CategoryStatsResponse) {
    Object.entries(input).forEach(([key, value]) => {
      this.maxNumber = Math.max(this.maxNumber, value);
      this.data.push({
        label: key,
        score: value,
        colorCode: '#4BC0C0',
        percentage: () => {
          return `${(value * 100) / this.maxNumber}`;
        },
      });
    });
    return this;
  }
}

export class ComplaintCategoryStats {
  labels: string[] = [];
  data: number[] = [];
  backgroundColor: string[] = [];
  borderColor: string[] = [];

  deserialize(input: CategoryStatsResponse) {
    Object.entries(input).forEach(([key, value]) => {
      this.labels.push(key);
      this.data.push(value);
      this.borderColor.push('transparent');
    });

    this.backgroundColor = generateMonotoneColors('#b2b7bc', this.data.length);
    return this;
  }
}

export class DistributionStats {
  data: { label: string; count: number; color: string; score }[] = [];
  total: number = 0;

  deserialize(input: DistributionStatsResponse) {
    const colorConfig = {
      HIGH: '#1495A4',
      MEDIUM: '#63FF78',
      ASAP: '#FF6384',
    };

    Object.entries(input).forEach(([key, value]) => {
      this.total += value;
      this.data.push({
        label: key,
        count: value,
        color: colorConfig[key],
        score: () => {
          return `${(value * 100) / this.total}%`;
        },
      });
    });

    return this;
  }
}

function generateMonotoneColors(
  baseColor: string,
  count: number = 5
): string[] {
  const colors: string[] = [];

  // Convert hexadecimal to RGB components
  const baseRGB =
    baseColor
      .match(/#(..)(..)(..)/)
      ?.slice(1)
      .map((hex) => parseInt(hex, 16)) ?? [];
  if (baseRGB.length !== 3)
    throw new Error(
      'Invalid baseColor format. Use hexadecimal color format, e.g., "#b2b7bc"'
    );

  // Generate monotone colors
  for (let i = 0; i < count; i++) {
    const darkeningFactor = 20; // Adjust this value to control darkness
    const red = Math.max(baseRGB[0] - darkeningFactor * i, 0);
    const green = Math.max(baseRGB[1] - darkeningFactor * i, 0);
    const blue = Math.max(baseRGB[2] - darkeningFactor * i, 0);
    const color = `#${componentToHex(red)}${componentToHex(
      green
    )}${componentToHex(blue)}`;
    colors.push(color);
  }

  return colors;
}

function componentToHex(component: number): string {
  const hex = component.toString(16);
  return hex.length === 1 ? '0' + hex : hex; // Ensure two-digit hexadecimal representation
}
