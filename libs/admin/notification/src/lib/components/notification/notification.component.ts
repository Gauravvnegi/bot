import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  channel = new FormControl();
  messageType = new FormControl();

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
  constructor() {}

  ngOnInit(): void {}
}
