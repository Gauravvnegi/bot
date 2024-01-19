import { Component, Input, OnInit } from '@angular/core';
import { TabsType } from '../../types/guest.type';

@Component({
  selector: 'hospitality-bot-guest-card',
  templateUrl: './guest-card.component.html',
  styleUrls: ['./guest-card.component.scss'],
})
export class GuestCardComponent implements OnInit {
  readonly tabs = TabsType;
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
  type: TabsType;
  feedback?: string;
  phone: string;
}
