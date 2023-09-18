import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-room-card',
  templateUrl: './room-card.component.html',
  styleUrls: ['./room-card.component.scss'],
})
export class RoomCardComponent implements OnInit {
  @Input() roomNo;
  @Input() roomType: string;
  @Input() status: string;
  @Input() frontOfficeState: string;
  @Input() nextStates;
  @Input() recordSetting;
  @Input() roomFeature;

  constructor() {}

  ngOnInit(): void {
    console.log(this.roomNo);
  }

  handleStatus(arg1, arg2): void {}
}
