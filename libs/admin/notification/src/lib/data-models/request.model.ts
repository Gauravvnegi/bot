import { get, set } from 'lodash';

export class RequestData {
  messageType: string;
  templateId: string;
  sources: string[];
  phoneNumbers: string[];
  emailIds: string[];
  roomNumbers: string[];
  attachments: string[];
  message: string;

  deserialize(data) {
    Object.assign(
      this,
      set({}, 'roomNumbers', get(data, ['roomNumbers'])),
      set({}, 'templateId', get(data, ['templateId'])),
      set({}, 'attachments', get(data, ['attachments'])),
      set({}, 'message', get(data, ['message'])),
      set({}, 'messageType', get(data, ['messageType'])),
      set({}, 'phoneNumbers', get(data, ['phoneNumbers']))
    );

    if (data.is_email_channel) {
      this.emailIds = data.emailIds;
      this.sources = ['email'];
    }
    if (data.is_social_channel) {
      this.sources =
        this.sources && this.sources.length
          ? [...this.sources, ...data.social_channels]
          : data.social_channels;
    }
    return this;
  }
}

export class RequestMessageData{
  messageType: string;
  templateId: string;
  sources: string[];
  roomNumbers: string[];
  attachments: string[];
  message: string;

  deserialize(data){
    this.messageType = data.messageType;
    this.templateId = data.templateId;
    this.roomNumbers = data.roomNumbers.map(item=>item.value);
    this.message = data.message;
    this.attachments = data.attachments;

    if(data.social_channels = ['SMS']){
      this.sources = ['MESSENGER_SUPPORT']
    }
    return this;
  }
}

export class RequestConfig {
  channels: IChannels;
  messageTypes: IMessageType[];

  deserialize(data) {
    Object.assign(
      this, 
      set({}, 'channels', get(data, ['channels'])),
      set({}, 'messageTypes', get(data, ['messageTypes']))
    );

    return this;
  }
}

export interface IChannels {
  bot: {
    title: string;
    options: IOption[];
    label: string;
  };
  email: {
    title: string;
    label: string;
  };
  sms: {
    title: string;
    label: string;
  };
}

export interface IOption {
  label: string;
  value: string;
}

export interface IMessageType {
  label: string;
  value: string;
  templeteIds: ITemplateId[];
}

export interface ITemplateId {
  id: string;
  name: string;
}

export class FeedbackNotificationConfig {
  channels: IOption[];
  templateIds: ITemplateId[];

  deserialize(input) {
    this.channels = new Array<IOption>();
    this.templateIds =
      input.messageTypes.filter((type) => type.value === 'FEEDBACK')[0]
        ?.templateIds || [];
    Object.keys(input.channels).forEach((key) => {
      this.channels.push({
        value: input.channels[key].title,
        label: input.channels[key].label,
      });
    });

    return this;
  }
}
