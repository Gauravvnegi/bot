import { EntitySubType, EntityType } from '@hospitality-bot/admin/shared';

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

export type ReservationStatus = 'DRAFT' | 'CONFIRMED' | 'CANCELED';

export type OutletReservationStatus =
  | ReservationStatus
  | 'NOSHOW'
  | 'WAITLISTED'
  | 'COMPLETED'
  | 'IN';

export type SelectedEntity = {
  id?: string;
  type?: EntityType;
  subType?: EntitySubType;
  label: string;
  value?: string;
};
