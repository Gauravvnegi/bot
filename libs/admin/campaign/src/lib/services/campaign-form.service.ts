import { Injectable } from '@angular/core';
import {
  CampaignForm,
  CampaignType,
  PostCampaignForm,
} from '../types/campaign.type';

@Injectable({
  providedIn: 'root',
})
export class CampaignFormService {
  constructor() {}

  posFormData(formData: CampaignForm, campaignType: CampaignType) {
    let data = new PostCampaignForm();

    const individualRecipients = formData.to.filter(
      (item) => !formData.recipients.some((val) => val.label === item)
    );

    data = {
      channel: campaignType,
      to: {
        individual: individualRecipients,
        listing: formData.recipients.map((item) => item.value),
      },
      name: formData.campaignName,
      topicId: formData.topic,
      from: formData.from,
      dateTime: new Date(formData.startDate).getTime(),
      message: formData.message,
      templateId: formData.templateId,
      tags: formData.campaignTags,
      cc: formData?.cc?.length ? formData?.cc : undefined,
      bcc: formData?.bcc?.length ? formData?.bcc : undefined,
    };

    return data;
  }
}
