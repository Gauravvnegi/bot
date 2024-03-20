import { Injectable } from '@angular/core';
import {
  CampaignForm,
  CampaignType,
  PostCampaignForm,
} from '../types/campaign.type';
import { Option } from '@hospitality-bot/admin/shared';

@Injectable({
  providedIn: 'root',
})
export class CampaignFormService {
  constructor() {}

  posFormData(
    formData: CampaignForm,
    campaignType: CampaignType,
    selectedRecipients: Option[]
  ) {
    let data = new PostCampaignForm();

    const individualRecipients = formData.to.filter(
      (item) => !selectedRecipients.some((val) => val.label === item)
    );

    data = {
      channel: campaignType,
      to: {
        individual: individualRecipients,
        listing: selectedRecipients.map((item) => item.value),
      },
      name: formData.campaignName,
      topicId: formData.topic,
      from: formData.startDate,
      message: formData.message,
      templateId: formData.templateId,
      tags: formData.campaignTags,
      campaignType: campaignType,
    };

    return data;
  }
}
