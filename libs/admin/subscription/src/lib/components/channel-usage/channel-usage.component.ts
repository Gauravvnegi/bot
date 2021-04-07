import { Component, Input, OnInit } from '@angular/core';
import { CommunicationChannels } from '../../data-models/subscription.model';

@Component({
  selector: 'hospitality-bot-channel-usage',
  templateUrl: './channel-usage.component.html',
  styleUrls: ['./channel-usage.component.scss'],
})
export class ChannelUsageComponent implements OnInit {
  @Input() data;
  activeChannels: number;
  communicationChannels;
  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.communicationChannels = new CommunicationChannels().deserialize(
        this.data
      ).channels;
      this.activeChannels = this.data.length;
    }
  }
}
