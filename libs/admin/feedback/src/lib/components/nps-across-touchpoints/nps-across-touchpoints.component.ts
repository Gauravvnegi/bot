import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-nps-across-touchpoints',
  templateUrl: './nps-across-touchpoints.component.html',
  styleUrls: ['./nps-across-touchpoints.component.scss']
})
export class NpsAcrossTouchpointsComponent implements OnInit {

  isOpened = false;
  progresses: any = [
    { label: 'Checkin', frontDesk: 23, roomCleaning: 35, luggageServices: 42 },
    { label: 'Checkout', frontDesk: 30, roomCleaning: 40, luggageServices: 30 }
  ];

  progressValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  constructor() { }

  ngOnInit(): void {
  }

}
