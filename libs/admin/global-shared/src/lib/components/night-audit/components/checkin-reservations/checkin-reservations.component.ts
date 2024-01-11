import { DialogService } from 'primeng/dynamicdialog';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { DetailsTabOptions } from '@hospitality-bot/admin/reservation';
import {
  BookingDetailService,
  EntitySubType,
  ModuleNames,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { NightAuditService } from '../../../../services/night-audit.service';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { TableActionType } from '../../../table-view/table-view.component';
import {
  cols,
  reservationStatus,
} from '../../constants/checked-in-reservation.table';
import { CheckedInReservation } from '../../models/night-audit.model';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

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

  loading = true;
  hasError = false;
  @Input() items: CheckedInReservation[] = [];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter();
  @Output() onClose = new EventEmitter();
  @Output() onNavigate = new EventEmitter();

  $subscription = new Subscription();

  constructor(
    private nightAuditService: NightAuditService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private _clipboard: Clipboard,
    private routesConfigService: RoutesConfigService,
    public bookingDetailService: BookingDetailService,
    private dialogService: DialogService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.initActionConfig();
    }
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenLoaders();
    this.initTable();
    this.initActionConfig();
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: 'Next',
      preSeverity: 'primary',
      postDisabled: this.loading || this.isSomeConfirmed() || this.hasError,
    };
  }

  handelStatus(event, reservationData) {
    const status = event?.value;
    const content:Partial<ModalComponent> = {
      heading: `Mark Reservation As ${
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      }`,
      descriptions: [
        `You are about to mark this reservation as ${status}`,
        `Are you Sure?`,
        status === 'CANCELED' && reservationData?.totalPaidAmount
          ? ` A total of \u20B9 ${reservationData?.totalPaidAmount} is received for the reservation`
          : '',
      ],
      isRemarks: ['CANCELED','NOSHOW'].includes(status),
    };
    const actions = [
      {
        label: status === 'CANCELED' ? 'Cancel & Settlement' : 'Cancel',
        onClick: () => {
          if (status === 'CANCELED') {
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.INVOICE,
              additionalPath: reservationData.id,
              queryParams: {
                entityId: this.entityId,
                type: EntitySubType.ROOM_TYPE,
              },
            });
            this.onClose.emit(true);
          }
          dialogRef.close();
        },
        variant: 'outlined',
      },
      {
        label: 'Yes',
        onClick: (modelData) => {
          dialogRef.close();
          this.updateStatus(event, modelData);
        },
        variant: 'contained',
      },
    ];
    const dialogRef = openModal({
      component: ModalComponent,
      config: {
        styleClass: 'confirm-dialog',
        width: '600px',
        data: {
          content: content,
          actions: actions,
        },
      },
      dialogService: this.dialogService,
    });
  }

  updateStatus(event, additionalData) {
    this.$subscription.add(
      this.nightAuditService
        .updateBookingStatus(
          event.details.id,
          this.entityId,
          EntitySubType.ROOM_TYPE,
          {
            reservationType: event.value,
            remarks: additionalData.remarks,
          }
        )
        .subscribe(
          (res) => {
            this.reload.emit({ status: event.value });
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
  }

  copyConfirmationNumber(number: string) {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Booking number copied', '', {
      panelClass: 'success',
    });
  }

  editReservation(event: TableActionType) {
    this.onNavigate.emit({
      additionalPath: `${manageReservationRoutes.editReservation.route}/${event.details.id}`,
      subModuleName: ModuleNames.ADD_RESERVATION,
    });
  }

  isSomeConfirmed() {
    return this.items.some(
      (item) => item.action.dropDown.currentState == 'CONFIRMED'
    );
  }

  initTable() {
    if (!this.items.length) this.reloadTable();
  }

  listenLoaders() {
    this.nightAuditService.$checkedInLoading.subscribe((res) => {
      this.loading = res.loading;
      this.hasError = res.error;
      this.initActionConfig();
    });
  }

  reloadTable(refresh?: boolean) {
    this.initActionConfig();
    this.reload.emit(refresh ? { refresh: true } : true);
  }

  handleRowClick(event) {
    this.openDetailsPage(event.id);
  }

  openDetailsPage(reservationId: string) {
    const activeTab: DetailsTabOptions = 'guest_details';
    this.bookingDetailService.openBookingDetailSidebar({
      bookingId: reservationId,
      tabKey: activeTab,
    });
  }

  increaseZIndex(toggleZIndex: boolean) {
    const cdkOverlayContainer = document.querySelector(
      '.cdk-overlay-container'
    ) as HTMLElement;
    if (cdkOverlayContainer)
      cdkOverlayContainer.style.zIndex = toggleZIndex ? '1500 ' : '1000';
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }
}
