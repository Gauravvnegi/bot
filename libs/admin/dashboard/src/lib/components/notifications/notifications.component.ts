import { Component, OnInit } from '@angular/core';
import { config } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent implements OnInit {
  config = config;
  notification = {
    circles: {
      Sent: 161,
      Delivered: 154,
      Read: 148,
      Failed: 60,
    },
    percent: {
      Sent: (161 / 161) * 100,
      Delivered: (154 / 161) * 100,
      Read: (148 / 161) * 100,
      Failed: (60 / 161) * 100,
    },
    total: 161,
  };
  constructor() {}

  ngOnInit(): void {}

  get notificationKeys() {
    return Object.keys(this.notification.circles);
  }
}
