import { get } from 'lodash';
import { IDeserializable } from '@hospitality-bot/admin/shared';

export class Notification implements IDeserializable {
  id?: string;
  title?: string;
  body?: string;
  // expiresAt?: Date;
  // startsAt?: Date;
  dateFormat?: string;
  status?: string;
  icon?: string;
  clickAction?: string;
  name?: string;
  patronId?: string;
  expiresOn?: number;
  expiresOnLocal?: number;

  deserialize(input: any): this {
    this.id = get(input, 'id');
    this.title = get(input, 'notification.title');
    this.body = get(input, 'notification.body');
    // this.expiresAt = get(input, 'notification.expire_at');
    // this.startsAt = get(input, 'notification.start_date');
    this.status = get(input, 'notification.status');
    this.icon = get(input, 'notification.icon');
    this.clickAction = get(input, 'notification.click_action');
    this.dateFormat = 'dd MMM, yyyy';
    this.name = get(input, 'name');
    this.patronId = get(input, 'patron_id');
    this.expiresOn = Number.parseInt(get(input, 'notification.expiresOn'));
    this.expiresOnLocal =
      Number.parseInt(get(input, 'notification.expiresOn')) * 1000;

    return this;
  }
}
