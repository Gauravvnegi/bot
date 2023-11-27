import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
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
import { EntitySubType, ModuleNames } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import { TableActionType } from '../../../table-view/table-view.component';
import { Clipboard } from '@angular/cdk/clipboard';

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
    private _clipboard: Clipboard
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
      postDisabled: this.loading || this.isSomeConfirmed(),
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
              EntitySubType.ROOM_TYPE,
              {
                reservationType: event.value,
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
      },
    });
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
      this.loading = res;
      this.initActionConfig();
    });
  }

  reloadTable(refresh?: boolean) {
    this.initActionConfig();
    this.reload.emit(refresh ? { refresh: true } : true);
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }
}
