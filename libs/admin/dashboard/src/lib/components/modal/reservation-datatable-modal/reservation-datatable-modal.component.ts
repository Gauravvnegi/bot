import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  FeedbackService,
  TableService,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { ReservationService } from '../../../services/reservation.service';
import { ReservationDatatableComponent } from '../../datatable/reservation/reservation.component';

@Component({
  selector: 'hospitality-bot-reservation-modal',
  templateUrl: './reservation-datatable-modal.component.html',
  styleUrls: [
    './reservation-datatable-modal.component.scss',
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    '../../datatable/reservation/reservation.component.scss',
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

  /**
   * @function closeModal Emits the close click event for the modal
   */
  closeModal(): void {
    this.onModalClose.emit(true);
  }
}