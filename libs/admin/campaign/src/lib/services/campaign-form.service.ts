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

  postFormData(
    formData: CampaignForm,
    campaignType: CampaignType,
    action: 'send' | 'save'
  ) {
    let data = new PostCampaignForm();

    const individualRecipients = formData.to.filter(
      (item) => !formData.recipients.some((val) => val.label === item)
    );

    const isEmailType = campaignType === 'EMAIL';
    data = {
      channel: campaignType,
      to: {
        individual: individualRecipients,
        listing: formData.recipients.map((item) => item.value),
      },
      name: formData?.campaignName,
      topicId: formData?.topic.length ? formData.topic : undefined,
      from: formData?.from?.length ? formData.from : undefined,
      dateTime: new Date(formData.startDate).getTime(),
      message: formData?.message,
      templateId: formData?.templateId,
      tags: formData?.campaignTags,
      cc: formData?.cc?.length ? formData?.cc : undefined,
      bcc: formData?.bcc?.length ? formData?.bcc : undefined,
      isDraft: action === 'save',
      subject: isEmailType ? { text: formData.subject } : undefined,
    };

    return data;
  }
}
