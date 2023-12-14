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
import {
  DetailsComponent,
  DetailsTabOptions,
} from '@hospitality-bot/admin/reservation';
import { EntitySubType, ModuleNames } from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
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
import { MatDialogConfig } from '@angular/material/dialog';
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
    private confirmationService: ConfirmationService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private modalService: ModalService,
    private _clipboard: Clipboard,
    private routesConfigService: RoutesConfigService
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

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );
    this.increaseZIndex(true);

    togglePopupCompRef.componentInstance.content = {
      heading: `Mark Reservation As ${
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      }`,
      description: [
        `You are about to mark this reservation as ${status}`,
        `Are you Sure?`,
        status === 'CANCELED' && reservationData?.totalPaidAmount
          ? ` A total of \u20B9 ${reservationData?.totalPaidAmount} is received for the reservation`
          : '',
      ],
      isRemarks: status === 'CANCELED' || 'NOSHOW',
    };
    togglePopupCompRef.componentInstance.actions = [
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

          this.modalService.close();
        },
        variant: 'outlined',
      },
      {
        label: 'Yes',
        onClick: (modelData) => {
          this.modalService.close();
          this.updateStatus(event, modelData);
        },
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.increaseZIndex(false);
      this.modalService.close();
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

  // statusChange(event) {
  //   this.confirmationService.confirm({
  //     header: `Mark Reservation As ${event.value}`,
  //     message: 'Are you sure... ?',
  //     acceptButtonStyleClass: 'accept-button',
  //     rejectButtonStyleClass: 'reject-button-outlined',
  //     accept: () => {
  //       this.loading = true;
  //       this.$subscription.add(
  //         this.nightAuditService
  //           .updateBookingStatus(
  //             event.details.id,
  //             this.entityId,
  //             EntitySubType.ROOM_TYPE,
  //             {
  //               reservationType: event.value,
  //             }
  //           )
  //           .subscribe(
  //             (res) => {
  //               this.reload.emit({ status: event.value });
  //               this.snackbarService.openSnackBarAsText(
  //                 'Reservation ' + event.value + ' changes successfully',
  //                 '',
  //                 { panelClass: 'success' }
  //               );
  //               this.loading = false;
  //             },
  //             (error) => {
  //               this.loading = false;
  //             }
  //           )
  //       );
  //     },
  //   });
  // }

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
    const openTab: DetailsTabOptions = 'guest_details';
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = reservationId;
    detailCompRef.componentInstance.tabKey = openTab;
    this.increaseZIndex(true);
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        this.increaseZIndex(false);
        detailCompRef.close();
      })
    );

    this.$subscription.add(
      detailCompRef.componentInstance.onRoute.subscribe((res) => {
        this.onClose.emit(true);
      })
    );
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
