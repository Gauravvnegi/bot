import { Component, Input, OnInit } from '@angular/core';
import { OutletReservation } from '../../models/outlet-reservation.model';

@Component({
  selector: 'hospitality-bot-reservation-card',
  templateUrl: './reservation-card.component.html',
  styleUrls: ['./reservation-card.component.scss'],
})
export class ReservationCardComponent implements OnInit {
  @Input() data: OutletReservation;

  constructor() {}

  ngOnInit(): void {}
}
