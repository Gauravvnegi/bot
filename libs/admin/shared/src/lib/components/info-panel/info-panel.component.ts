import { Component, Input, OnInit } from '@angular/core';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';

@Component({
  selector: 'hospitality-bot-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss'],
  providers: [RoomService],
})
export class InfoPanelComponent implements OnInit {
  showContent: boolean = false;

  @Input() type: string = 'room';
  title: string = 'Room Status';

  constructor(private roomService: RoomService) {
    this.getDefaultFeatures();
  }

  bookingStatus = [
    {
      name: 'Check-out',
      color: '#ef1d45',
    },
    {
      name: 'Due-in',
      color: '#52b33f',
    },
    {
      name: 'Check-In',
      color: '#3166f0',
    },
    {
      name: 'Due-Out',
      color: '#550000',
    },
    {
      name: 'Out of Service',
      color: '#555555',
    },
    {
      name: 'Out of Order',
      color: 'rgba(85, 85, 85, 0.1',
    },
  ];

  roomStatus = [
    {
      name: 'Occupied',
      color: '#ef1d45',
    },
    {
      name: 'Vacant',
      color: '#52b33f',
    },
    {
      name: 'Clean',
      color: '#52b33f',
    },
    {
      name: 'Due Out',
      color: '#500',
    },
    {
      name: 'Dirty',
      color: '#ff8f00',
    },
  ];

  bookingIndicator = [
    {
      name: 'Day Booking',
      icon: 'assets/images/day-booking.svg',
    },
    {
      name: 'Group Booking',
      icon: 'assets/images/group-booking.svg',
    },
    {
      name: 'Single Lady',
      icon: 'assets/images/signle-lady.svg',
    },
    {
      name: 'VIP',
      icon: 'assets/images/VIP.svg',
    },
    {
      name: 'Payment Pending',
      icon: 'assets/images/payment-pending.svg',
    },
  ];

  ngOnChanges() {
    if (this.type === 'booking') {
      this.title = 'Booking Status';
      this.roomStatus = this.bookingStatus;
    }
  }

  features = [];

  ngOnInit(): void {}

  getDefaultFeatures() {
    this.roomService.getFeatures().subscribe((res) => {
      this.features = res.features.map((feature) => {
        return {
          name: feature.name,
          icon: feature.imageUrl[0].url,
        };
      });
    });
  }

  addGlobalCss(condition: boolean) {
    condition
      ? document.documentElement.classList.add('my-global-class')
      : document.documentElement.classList.remove('my-global-class');
  }
}
