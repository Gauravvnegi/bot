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
    autoplay: true,
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
  // pauseSlickCarousel() {
  //   this.slickModal.slickPause();
  // }

  // playSlickCarousel() {
  //   this.slickModal.slickPlay();
  // }
  ngOnInit(): void {
    if (this.data) {
      this.communicationChannels = new CommunicationChannels().deserialize(
        this.data
      ).channels;
      this.activeChannels = this.data.length;
    }
  }

}
