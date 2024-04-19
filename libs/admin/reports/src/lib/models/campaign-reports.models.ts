import { templateConfig } from './../../../../template/src/lib/constants/template';
import {
  emailCampaignReportData,
  emailCampaignReportResponse,
  emailMarketingTemplateReportData,
  emailMarketingTemplateReportResponse,
  whatsappCampaignReportData,
  whatsappCampaignReportResponse,
  whatsappMarketingTemplateReportData,
  whatsappMarketingTemplateReportResponse,
} from '../types/campaign-reports.types';
import { ReportClass } from '../types/reports.types';

export class EmailCampaignReport
  implements
    ReportClass<emailCampaignReportData, emailCampaignReportResponse[]> {
  records: emailCampaignReportData[];
  deserialize(value: emailCampaignReportResponse[]): this {
    this.records = new Array<emailCampaignReportData>();
    value &&
      value.forEach((item) => {
        this.records.push({
          name: item?.templateName,
          channel: item?.channel,
          status: item?.active,
          delivered: item?.statsCampaign?.delivered,
          opened: item?.statsCampaign?.opened,
          unOpened: item?.statsCampaign?.unopened,
          clicked: item?.statsCampaign?.clicked,
          failed: item?.statsCampaign?.failed,
          createdBy: item?.createdBy,
        });
      });
    return this;
  }
}

export class EmailMarketingTemplateReport
  implements
    ReportClass<
      emailMarketingTemplateReportData,
      emailMarketingTemplateReportResponse[]
    > {
  records: emailMarketingTemplateReportData[];
  deserialize(value: emailMarketingTemplateReportResponse[]): this {
    this.records = new Array<emailMarketingTemplateReportData>();
    value &&
      value.forEach((item) => {
        this.records.push({
          name: item?.name,
          channel: item?.channel,
          active: item?.active,
          createdBy: item?.createdBy,
          updatedBy: item?.updatedBy,
        });
      });
    return this;
  }
}

export class WhatsappCampaignReport
  implements
    ReportClass<whatsappCampaignReportData, whatsappCampaignReportResponse[]> {
  records: whatsappCampaignReportData[];
  deserialize(value: whatsappCampaignReportResponse[]): this {
    this.records = new Array<whatsappCampaignReportData>();
    value &&
      value.forEach((item) => {
        this.records.push({
          name: item?.templateName,
          channel: item?.channel,
          status: item?.active,
          sent: item?.statsCampaign?.sent,
          delivered: item?.statsCampaign?.delivered,
          read: item?.statsCampaign?.read,
          failed: item?.statsCampaign?.failed,
          createdBy: item?.createdBy,
        });
      });
    return this;
  }
}

export class WhatsappMarketingTemplateReport
  implements
    ReportClass<
      whatsappMarketingTemplateReportData,
      whatsappMarketingTemplateReportResponse[]
    > {
  records: whatsappMarketingTemplateReportData[];
  deserialize(value: whatsappMarketingTemplateReportResponse[]): this {
    this.records = new Array<whatsappMarketingTemplateReportData>();
    value &&
      value.forEach((item) => {
        this.records.push({
          name: item?.name,
          channel: item?.channel,
          active: item?.active,
          createdBy: item?.createdBy,
          updatedBy: item?.updatedBy,
        });
      });
    return this;
  }
}
