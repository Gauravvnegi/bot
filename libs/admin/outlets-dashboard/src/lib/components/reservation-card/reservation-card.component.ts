import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OutletReservation } from '../../models/outlet-reservation.model';
import {
  OrderPaymentConfig,
  TableStatusConfig,
} from '../../constants/data-table';
import { Option } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent implements OnInit {
  @Input() data: OutletReservation;
  readonly orderPaymentConfig = OrderPaymentConfig;
  readonly tableStatusConfig = TableStatusConfig;
  constructor() {}

  @Output() onCardClick = new EventEmitter<{
    orderId?: string;
    reservationId?: string;
    selectedTable?: Option;
  }>();

  ngOnInit(): void {}

  cardClick() {
    this.onCardClick.emit({
      orderId: this.data?.orderId,
      reservationId: this.data?.id,
      selectedTable: this.data.tableData,
    });
  }
}
