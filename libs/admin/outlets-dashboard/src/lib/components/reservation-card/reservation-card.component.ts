import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutletReservation } from '../../models/outlet-reservation.model';
import {
  CardConfig,
  ReservationStatusColorConfig,
  TableStatusConfig,
} from '../../constants/data-table';

@Component({
  selector: 'hospitality-bot-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent implements OnInit {
  @Input() data: OutletReservation;
  readonly cardConfig = CardConfig;
  readonly statusColorConfig = ReservationStatusColorConfig;
  readonly tableStatusConfig = TableStatusConfig;
  constructor() {}

  @Output() onCardClick = new EventEmitter<string>();

  ngOnInit(): void {}

  cardClick() {
    // if(this.data.)
    this.onCardClick.emit(this.data?.id);
  }
}
