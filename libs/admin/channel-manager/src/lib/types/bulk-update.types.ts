import { Pax } from '../models/bulk-update.models';

export type TreeType = {
  name: string;
  id: string;
  isSelected: boolean;
};
export interface RoomTypes extends TreeType {
  channels: Channel[];
  variants: Variant[];
  pax?: Pax[];
}

export interface Variant extends TreeType {
  channels: Channel[];
  pax?: Pax[];
}

export type Channel = TreeType;

export type SourceEmitType = 'parent' | 'variant' | 'channel';
export type UpdatedEmitType = {
  status: boolean;
  id: string;
  variantIndex?: number;
  channelIndex?: number;
  source: SourceEmitType;
};

export type BulkUpdateResponse = {
  success: boolean;
  message: string;
};

export type BulkUpdateRequest = {
  startDate: string; //'2023-02-22';
  endDate: string; //'2023-02-24';
  rates: Rates[];
};

type Rates = {
  roomCode: string;
  rate: number;
  rateplanCode: string;
};

export type BulkUpdateForm = {
  update: string;
  updateValue: string;
  fromDate: number;
  toDate: number;
  roomType?: string[];
  selectedDays: string[];
};
