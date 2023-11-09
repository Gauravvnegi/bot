export type MarketSourceReportData = {
  company: string;
  nights: number;
  occupancy: number;
  pax: number;
  roomRevenue: number;
  revenue: number;
  arrOrAgr: number;
  arp: number;
};

export type MarketSourceReportResponse = {
  INDIVIDUALS: Accommodation;
  EASEMYTRIP: Accommodation;
  YATRA: Accommodation;
  subTotal: Accommodation;
};

type Accommodation = {
  nights: number;
  occupancyPercent: number;
  pax: number;
  roomRevenue: number;
  revenuePercent: number;
  arr: number;
  arp: number;
};
