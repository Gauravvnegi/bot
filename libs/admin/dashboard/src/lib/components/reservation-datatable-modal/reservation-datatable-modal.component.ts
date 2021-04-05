import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { ReservationService } from '../../services/reservation.service';
import { ReservationDatatableComponent } from '../reservation-datatable/reservation-datatable.component';

@Component({
  selector: 'hospitality-bot-reservation-datatable-modal',
  templateUrl: './reservation-datatable-modal.component.html',
  styleUrls: [
    './reservation-datatable-modal.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    '../reservation-datatable/reservation-datatable.component.scss',
  ],
})
export class ReservationDatatableModalComponent
  extends ReservationDatatableComponent
  implements OnInit {
  @Output() onModalClose = new EventEmitter();
  constructor(
    public fb: FormBuilder,
    protected _reservationService: ReservationService,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    public feedbackService: FeedbackService
  ) {
    super(
      fb,
      _reservationService,
      _adminUtilityService,
      _globalFilterService,
      _snackbarService,
      _modal,
      feedbackService,
      tabFilterService
    );
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  closeModal() {
    this.onModalClose.emit(true);
  }
}
