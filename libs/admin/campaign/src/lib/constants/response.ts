import { FlagType } from '@hospitality-bot/admin/shared';

export const campaignStatus: Record<
  'ACTIVE' | 'INACTIVE' | 'DRAFT' | 'ARCHIVE' | 'SENT',
  { label: string; type: FlagType }
> = {
  ACTIVE: {
    label: 'Active',
    type: 'active',
  },
  INACTIVE: {
    label: 'In-Active',
    type: 'inactive',
  },
  DRAFT: {
    label: 'Draft',
    type: 'warning',
  },
  ARCHIVE: {
    label: 'Archive',
    type: 'default',
  },
  SENT: {
    label: 'Sent',
    type: 'completed',
  },
};
