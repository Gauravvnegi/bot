import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-card',
  templateUrl: './guest-card.component.html',
  styleUrls: ['./guest-card.component.scss'],
})
export class GuestCardComponent implements OnInit {
  @Input() item: GuestCard;
  constructor() {}

  ngOnInit(): void {}
}

export interface GuestCard {
  tableNo: string;
  orderNo?: string;
  time: string;
  timeLimit?: string;
  people: number;
  name: string;
  type: 'Resident' | 'None-Resident';
  feedback?: string;
  phone: string;
}
