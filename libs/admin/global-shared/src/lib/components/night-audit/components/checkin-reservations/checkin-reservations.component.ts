import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { ConfirmationService, MenuItem } from 'primeng/api';
import {
  cols,
  reservationStatus,
} from '../../constants/checked-in-reservation.table';
import { CheckedInReservation } from '../../models/night-audit.model';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { NightAuditService } from '../../../../services/night-audit.service';
import { EntityType } from '@hospitality-bot/admin/shared';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';

@Component({
  selector: 'hospitality-bot-checkin-reservations',
  templateUrl: './checkin-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    '../checkout-reservations/checkout-reservations.component.scss',
    './checkin-reservations.component.scss',
  ],
  providers: [ConfirmationService],
})
export class CheckinReservationsComponent implements OnInit {
  readonly reservationStatusConfig = reservationStatus;
  title = 'Pending Check-ins';
  cols = cols;
  actionConfig: ActionConfigType;
  entityId = '';

  @Input() loading = false;
  @Input() items: CheckedInReservation[] = [];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter();
  @Output() onClose = new EventEmitter();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private confirmationService: ConfirmationService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initActionConfig();
    this.initTable();
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: 'Next',
      preSeverity: 'primary',
    };
  }

  statusChange(event) {
    this.confirmationService.confirm({
      header: `Mark Reservation As ${event.value}`,
      message: 'Are you sure... ?',
      acceptButtonStyleClass: 'accept-button',
      rejectButtonStyleClass: 'reject-button-outlined',
      accept: () => {
        this.loading = true;
        this.$subscription.add(
          this.nightAuditService
            .updateBookingStatus(
              event.details.id,
              this.entityId,
              EntityType.HOTEL,
              {
                reservationType: event.value,
              }
            )
            .subscribe(
              (res) => {
                this.reloadTable();
                this.snackbarService.openSnackBarAsText(
                  'Reservation ' + event.value + ' changes successfully',
                  '',
                  { panelClass: 'success' }
                );
                this.loading = false;
              },
              (error) => {
                this.loading = false;
              }
            )
        );
      },
    });
  }

  // TODO: Dynamic Routing...
  /**
   * @function editReservation To navigate to the edit page
   */
  editReservation(id: string) {
    this.onClose.emit(true);
    this.routesConfigService.navigate({
      isRespectiveToProduct: true,
      additionalPath: `/predicto-pms/front-desk-home/manage-reservation/${manageReservationRoutes.editReservation.route}/${id}`,
      queryParams: {
        entityId: this.entityId,
      },
    });
  }

  initTable() {
    if (!this.items.length) this.reloadTable();
  }

  reloadTable() {
    this.reload.emit(true);
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }
}