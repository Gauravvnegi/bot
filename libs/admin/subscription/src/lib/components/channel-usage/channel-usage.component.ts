import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
@Component({
  selector: 'hospitality-bot-channel-usage',
  templateUrl: './channel-usage.component.html',
  styleUrls: ['./channel-usage.component.scss'],
})
export class ChannelUsageComponent implements OnInit {
  @Input() data;
  activeChannels: number;
  // @ViewChild('slickModal') slickModal: SlickCarouselComponent;
  // slides = [
  //   {img: "https://via.placeholder.com/600.png/09f/fff"},
  //   {img: "https://via.placeholder.com/600.png/021/fff"},
  //   {img: "https://via.placeholder.com/600.png/321/fff"},
  //   {img: "https://via.placeholder.com/600.png/422/fff"},
  //   {img: "https://via.placeholder.com/600.png/654/fff"}
  // ];
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
  constructor() {}
  // pauseSlickCarousel() {
  //   this.slickModal.slickPause();
  // }

  // playSlickCarousel() {
  //   this.slickModal.slickPlay();
  // }
  ngOnInit(): void {
    if (this.data) {
      this.activeChannels = this.data.length;
    }
  }

}
