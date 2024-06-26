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

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: false,
    speed: 100,
    autoplay: false,
    method: {},
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };
  communicationChannels: CommunicationChannels;
  constructor() {}

  ngOnInit(): void {
    if (this.data) {
      this.communicationChannels = new CommunicationChannels()
        .deserialize(this.data)
        .channels.sort((x, y) =>
          x.isSubscribed === y.isSubscribed ? 0 : x.isSubscribed ? -1 : 1
        );
      this.activeChannels = this.data.filter((d) => d.isSubscribed).length;
    }
  }
}
