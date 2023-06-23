export type RoomTypes = {
  name: string;
  id: string;
  isSelected: boolean;
  variants: Variant[];
};

export type Variant = {
  id: string;
  name: string;
  isSelected: boolean;
  channels: {
    id: string;
    name: string;
    isSelected: boolean;
  }[];
};

export type SourceEmitType = 'parent' | 'variant' | 'channel';
export type UpdatedEmitType = {
  status: boolean;
  id: string;
  variantIndex?: number;
  channelIndex?: number;
  source: SourceEmitType;
};
