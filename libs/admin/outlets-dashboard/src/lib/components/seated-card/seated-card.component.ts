import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-seated-card',
  templateUrl: './seated-card.component.html',
  styleUrls: ['./seated-card.component.scss'],
})
export class SeatedCardComponent implements OnInit {
  @Input() item: SeatedCard;
  constructor() {}

  ngOnInit(): void {}
}

export interface SeatedCard {
  tableNo: string;
  orderNo: string;
  time: string;
  timeLimit: string;
  people: number;
  name: string;
  type: 'Resident' | 'None-Resident';
  feedback?: string;
  phone: string;
}
