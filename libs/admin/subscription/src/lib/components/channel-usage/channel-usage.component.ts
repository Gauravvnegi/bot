import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-channel-usage',
  templateUrl: './channel-usage.component.html',
  styleUrls: ['./channel-usage.component.scss'],
})
export class ChannelUsageComponent implements OnInit {
  @Input() data;
  activeChannels: number;
  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.activeChannels = this.data.length;
    }
  }
}
