import { Component, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  messageType = new FormControl();
  email = new FormControl();

  channelList = [
    { label: 'Whatsapp', name: 'Whatsapp' },
    { label: 'Messenger', name: 'Messenger' },
    { label: 'Telegram', name: 'Telegram' },
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
  rooms: string[] = ['P001', 'P002', 'P003', 'P004', 'P005'];

  constructor(
    private _fb: FormBuilder,
    private _location: Location
  ) {
    this.initNotificationForm();
  }

  ngOnInit(): void {}

  initNotificationForm() {
    this.notificationForm = this._fb.group({
      social_channels: [''],
      is_social_channel: [false],
      is_email_channel: [false],
      is_sms_channel: [false],
      message_type: [],
      template_type: [],
      attachment: [],
      message_body: [],
      email_ids: [''],
      room_nos: [],
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

  goBack() {
    this._location.back();
  }

  sendMessage() {
    let values = this.notificationForm.getRawValue();
    debugger;
  }

  setRoomData(event) {
    this.notificationForm.get('room_nos').setValue(event.split(','));
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

  get isSocialChannel() {
    return this.notificationForm.get('is_social_channel').value;
  }

}
