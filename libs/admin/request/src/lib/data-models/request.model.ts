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
			// set({}, 'emailIds', get(data, ['emailIds'])),
			// set({}, 'sources', get(data, ['sources'])),
			set({}, 'messageType', get(data, ['messageType'])),
			set({}, 'phoneNumbers', get(data, ['phoneNumbers']))
		)

		if (data.is_email_channel) {
			this.emailIds = data.emailIds;
			this.sources = ['email'];
		}
		if (data.is_social_channel) {
			this.sources = this.sources.length ? [...this.sources, ...data.social_channels] : data.social_channels;
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
		)

		return this;
	}
}

export interface IChannels {
	"bot": {
		title: string;
        options: IOption[];
	};
	"email": {
		"title": string;
	};
	"sms": {
		"title": string;
	};
}

export interface IOption { label: string; value: string; }

export interface IMessageType {
	label: string;
	value: string;
	templeteIds: any[]
}