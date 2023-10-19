import { StatCard } from "../types/complaint.type";

  export const statCard: StatCard[] = [
    {
      label: 'Resolved',
      score: '50',
      additionalData: '100',
      comparisonPercent: 100,
      color: '#31bb92',
    },
    {
      label: 'Timed-out',
      score: '10',
      additionalData: '5',
      comparisonPercent: 100,
      color: '#ef1d45',
    },
    {
      label: 'In-Progress',
      score: '50',
      additionalData: '5',
      comparisonPercent: 100,
      color: '#4ba0f5',
    },
    {
      label: 'To Do',
      score: '5',
      additionalData: '100',
      comparisonPercent: 100,
      color: '#c5c5c5',
    },
  ];