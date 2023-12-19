export enum RuleType {
  'OCCUPANCY' = 'OCCUPANCY',
  'DAY_TIME_TRIGGER' = 'DAY_TIME_TRIGGER',
}

export const ruleLabel: Record<RuleType, string> = {
  DAY_TIME_TRIGGER: 'Day Trigger',
  OCCUPANCY: 'Season',
};

export const rulesRoutes: Record<RuleType, string> = {
  DAY_TIME_TRIGGER: 'create-day-time-trigger',
  OCCUPANCY: 'create-season',
};
