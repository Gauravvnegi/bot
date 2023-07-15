import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { EntitySubType } from '@hospitality-bot/admin/shared';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-reservation-form-wrapper',
  templateUrl: './reservation-form-wrapper.component.html',
  styleUrls: ['./reservation-form-wrapper.component.scss'],
})
export class ReservationFormWrapperComponent implements OnInit {
  selectedOutlet: EntitySubType;
  constructor(private formService: FormService) {}

  ngOnInit(): void {
    this.formService
      .getSelectedEntity()
      .subscribe((value) => (this.selectedOutlet = value.subType));
  }
}
