import {
  emailCampaignReportData,
  emailMarketingTemplateReportData,
  whatsappCampaignReportData,
  whatsappMarketingTemplateReportData,
} from '../types/campaign-reports.types';
import { ColsData } from '../types/reports.types';

export const emailCampaignReportCols: ColsData<emailCampaignReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  channel: {
    header: 'Channel',
    isSortDisabled: true,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
  },
  delivered: {
    header: 'Delivered',
    isSortDisabled: true,
  },
  failed: {
    header: 'Failed',
    isSortDisabled: true,
  },
  opened: {
    header: 'Opened',
    isSortDisabled: true,
  },
  unOpened: {
    header: 'Unopened',
    isSortDisabled: true,
  },
  clicked: {
    header: 'Clicked',
    isSortDisabled: true,
  },
};

export const emailMarketingTemplateReportCols: ColsData<emailMarketingTemplateReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  channel: {
    header: 'Channel',
    isSortDisabled: true,
  },
  active: {
    header: 'Active',
    isSortDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
  },
  updatedBy: {
    header: 'Updated By',
    isSortDisabled: true,
  },
};

export const whatsappCampaignReportCols: ColsData<whatsappCampaignReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  channel: {
    header: 'Channel',
    isSortDisabled: true,
  },
  status: {
    header: 'Status',
    isSortDisabled: true,
  },
  sent: {
    header: 'Sent',
    isSortDisabled: true,
  },
  delivered: {
    header: 'Delivered',
    isSortDisabled: true,
  },
  read: {
    header: 'Read',
    isSortDisabled: true,
  },
  failed: {
    header: 'Failed',
    isSortDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
  },
};

export const whatsappMarketingTemplateReportCols: ColsData<whatsappMarketingTemplateReportData> = {
  name: {
    header: 'Name',
    isSortDisabled: true,
  },
  channel: {
    header: 'Channel',
    isSortDisabled: true,
  },
  active: {
    header: 'Active',
    isSortDisabled: true,
  },
  createdBy: {
    header: 'Created By',
    isSortDisabled: true,
  },
  updatedBy: {
    header: 'Updated By',
    isSortDisabled: true,
  },
};
