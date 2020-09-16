import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  messageType = new FormControl();
  email = new FormControl();

  channelList = [
    { label: 'Whatsapp', name: 'whatsapp' },
    { label: 'Messenger', name: 'messenger' },
    { label: 'Telegram', name: 'telegram' },
  ];

  messageTypeList = [
    { label: 'Precheckin', name: 'precheckin' },
    { label: 'Checkin', name: 'checkin' },
    { label: 'Checkout', name: 'checkout' },
  ];

  ckeditorContent;
  public Editor = ClassicEditor;

  ckeConfig = {};
  notificationForm: FormGroup;

  visible = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  fruits = [{ name: 'Lemon' }, { name: 'Lime' }, { name: 'Apple' }];

  constructor(private _fb: FormBuilder) {
    this.initNotificationForm();
  }

  ngOnInit(): void {}

  initNotificationForm() {
    this.notificationForm = this._fb.group({
      social_channels: [''],
      is_email_channel: [false],
      is_sms_channel: [false],
      message_type: [],
      template_type: [],
      attachment: [],
      message_body: [],
      email_ids: [''],
      room_no: [],
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    //check for email regex before adding @to-do
    if ((value || '').trim()) {
      this.email_ids.patchValue(this.email_ids.value.concat(',', value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(emailToRemove): void {
    const allEmails = this.email_ids.value
      .split(',')
      .filter((email) => email != emailToRemove)
      .join(',');
    this.email_ids.patchValue(allEmails);
  }

  get social_channels() {
    return this.notificationForm.get('social_channels') as FormControl;
  }

  get email_ids() {
    return this.notificationForm.get('email_ids') as FormControl;
  }

  get emailIdsList() {
    return this.email_ids.value.split(',').filter((email) => email);
  }
}
