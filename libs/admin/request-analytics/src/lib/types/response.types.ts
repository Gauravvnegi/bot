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

export type RequestResponse = {
  requestStats: RequestStat;
  totalCount: number;
};

export type RequestStat = {
  TODO: number;
  RESOLVED: number;
  IN_PROGRESS: number;
  TIMEOUT?: number;
  CANCELLED?: number;
};

export type AverageStats = {
  averageStats: {
    averageCreatedJobs: number;
    averagetTimePerJob: number;
    averageResolvedJobs: number;
    timeoutJobs: number;
  };
};

export type DistributionStats = {
  distributionStats: {
    availableUsers: number;
    occupiedUsers: number;
  };
};
