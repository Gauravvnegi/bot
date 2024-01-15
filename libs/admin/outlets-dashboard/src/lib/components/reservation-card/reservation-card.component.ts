import { Component, Input, OnInit } from '@angular/core';
import { OutletReservation } from '../../models/outlet-reservation.model';
import {
  CardConfig,
  ReservationStatusColorConfig,
} from '../../constants/data-table';

@Component({
  selector: 'hospitality-bot-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent implements OnInit {
  @Input() data: OutletReservation;
  isTableAvailable: boolean = true;

  readonly cardConfig = CardConfig;
  readonly statusColorConfig = ReservationStatusColorConfig;
  
  constructor() {}

  ngOnInit(): void {}
}
