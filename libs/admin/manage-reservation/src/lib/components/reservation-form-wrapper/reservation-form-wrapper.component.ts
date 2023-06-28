import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { EntityTabGroup } from '../../constants/reservation-table';

@Component({
  selector: 'hospitality-bot-reservation-form-wrapper',
  templateUrl: './reservation-form-wrapper.component.html',
  styleUrls: ['./reservation-form-wrapper.component.scss'],
})
export class ReservationFormWrapperComponent implements OnInit {
  selectedOutlet: EntityTabGroup;
  constructor(private manageReservationService: ManageReservationService) {}

  ngOnInit(): void {
    this.manageReservationService
      .getSelectedOutlet()
      .subscribe((value) => (this.selectedOutlet = value));
  }
}
