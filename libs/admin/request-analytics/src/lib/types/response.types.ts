export type SentimentStatsResponse = {
  label: string;
  totalCount: number;
  comparisonPercent: number;
  score: number;
  toDoRequest: {
    label: string;
    totalCount: number;
    stats: Record<string, number>;
  };
  resolvedRequest: {
    label: string;
    totalCount: number;
    stats: Record<string, number>;
  };
  //   timeoutRequest: {
  //     label: string;
  //     totalCount: number;
  //     stats: Record<string, number>;
  //   };
  cancelledRequest: {
    label: string;
    totalCount: number;
    stats: Record<string, number>;
  };
  inProgressRequest: {
    label: string;
    totalCount: number;
    stats: Record<string, number>;
  };
  packageTotalCounts: Record<string, number>;
};
