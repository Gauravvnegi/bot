import { FlagType } from '@hospitality-bot/admin/shared';

export type SiteType = 'PUBLISHED' | 'TRASH' | 'DRAFT';

export const siteStatusDetails: Record<
  SiteType,
  { label: string; type: FlagType }
> = {
  PUBLISHED: {
    label: 'Published',
    type: 'active',
  },
  DRAFT: {
    label: 'Draft',
    type: 'warning',
  },
  TRASH: {
    label: 'Trash',
    type: 'inactive',
  },
};
