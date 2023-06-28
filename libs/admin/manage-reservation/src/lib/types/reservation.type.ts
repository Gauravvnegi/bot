/**
 * @type CategoryData
 * @key params format is `?type=NEW`
 * One of the query param is 'type'
 */
export type CategoryData = {
  name: string;
  status: string;
  source: 1;
  type: 'SERVICE_CATEGORY' | 'PACKAGE_CATEGORY';
};

/**
 * @type QueryConfig
 * @key params format is `?type=NEW`
 * One of the query param is 'type'
 */
export type QueryConfig = {
  params: string;
};

export type ReservationStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELED';

export type selectedOutlet = {
  id: string;
  type: string;
  label: string;
  value: string;
};
