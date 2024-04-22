import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BookingDetailService,
  ConfigService,
  FeedbackService,
} from '@hospitality-bot/admin/shared';
import {
  GlobalFilterService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ReservationService } from '../../../services/reservation.service';
import { ReservationDatatableComponent } from '../../datatable/reservation/reservation.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReservationDialogData } from '../../../types/dashboard.type';

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
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    public feedbackService: FeedbackService,
    public router: Router,
    protected bookingDetailService: BookingDetailService,
    protected subscriptionPlanService: SubscriptionPlanService,
    protected routesConfigService: RoutesConfigService,
    private dialogRef: DynamicDialogRef,
    public dialogConfig: DynamicDialogConfig, //generic not supported yet,
    public _configService: ConfigService
  ) {
    super(
      fb,
      _reservationService,
      _adminUtilityService,
      globalFilterService,
      snackbarService,
      feedbackService,
      bookingDetailService,
      subscriptionPlanService,
      routesConfigService,
      router,
      _configService
    );

    /**
     * @remarks Extracting data from dialog Service
     */
    const data = dialogConfig.data as ReservationDialogData;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {
    this.registerListeners();
    this.listenModal();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeModal();
      });
  }

  /**
   * @function listenModal will listen the close event of the details, for refreshing data
   */
  listenModal() {
    this.$subscription.add(
      this.bookingDetailService.actionEvent.subscribe((res) => {
        if (!res) {
          super.refreshData();
        }
      })
    );
  }

  /**
   * @function closeModal Emits the close click event for the modal
   */
  closeModal(): void {
    this.dialogRef.close();
    this.onModalClose.emit(true);
  }
}
