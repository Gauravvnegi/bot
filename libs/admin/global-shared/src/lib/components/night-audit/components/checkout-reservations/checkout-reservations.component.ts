import { Clipboard } from '@angular/cdk/clipboard';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DetailsTabOptions } from '@hospitality-bot/admin/reservation';
import {
  BookingDetailService,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import { MenuItem } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { NightAuditService } from '../../../../services/night-audit.service';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { TableActionType } from '../../../table-view/table-view.component';
import {
  cols,
  quickActions,
} from '../../constants/checked-in-reservation.table';
import { CheckedOutReservation } from '../../models/night-audit.model';

@Component({
  selector: 'hospitality-bot-checkout-reservations',
  templateUrl: './checkout-reservations.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './checkout-reservations.component.scss',
  ],
  providers: [DialogService],
})
export class CheckoutReservationsComponent implements OnInit, OnDestroy {
  title = 'Pending Check-out';
  cols = cols;
  loading = true;
  actionConfig: ActionConfigType;
  hasError = false;

  @Input() items: CheckedOutReservation[] = [];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();
  @Output() reload = new EventEmitter();
  @Output() onNavigate = new EventEmitter();
  @Output() onClose = new EventEmitter();

  $subscription = new Subscription();

  constructor(
    private snackbarService: SnackBarService,
    private nightAuditService: NightAuditService,
    private _clipboard: Clipboard,
    public dialogService: DialogService,
    private bookingDetailService: BookingDetailService
  ) {}

  ngOnInit(): void {
    this.listenLoaders();
    this.initActionConfig();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items']) {
      this.initActionConfig();
    }
  }

  initActionConfig(postLabel?: string) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: 'Next',
      preSeverity: 'primary',
      postDisabled: !!this.items?.length || this.hasError,
    };
  }

  quickChange(event: TableActionType) {
    if (event.value == quickActions['View Details']) {
      this.openDetailsPage(event.details.id);
      return;
    }

    const isModify = event.value == quickActions.modify;
    const path = isModify
      ? `${manageReservationRoutes.editReservation.route}/${event.details.id}`
      : `${event.details.id}`;
    const submodule = isModify
      ? ModuleNames.ADD_RESERVATION
      : ModuleNames.INVOICE;
    this.onNavigate.emit({
      additionalPath: path,
      subModuleName: submodule,
    });
  }

  reloadTable(refresh?: boolean) {
    this.reload.emit(refresh ? { refresh: true } : true);
  }

  handleNext() {
    if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }

  copyConfirmationNumber(number: string) {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Booking number copied', '', {
      panelClass: 'success',
    });
  }

  listenLoaders() {
    this.nightAuditService.$checkedInLoading.subscribe((res) => {
      this.loading = res.loading;
      this.hasError = res.error;
      this.initActionConfig();
    });
  }

  handleRowClick(event) {
    this.openDetailsPage(event.id);
  }

  openDetailsPage(reservationId: string) {
    const openTab: DetailsTabOptions = 'guest_details';
    this.bookingDetailService.openBookingDetailSidebar({
      bookingId: reservationId,
      tabKey: openTab,
    });
    this.bookingDetailService.changeRoute.subscribe((res) => {
      if (res) {
        this.onClose.emit();
      }
    });
  }

  ngOnDestroy(): void {
    this.bookingDetailService.resetBookingState();
  }
}
