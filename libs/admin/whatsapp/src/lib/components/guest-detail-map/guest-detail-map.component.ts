import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { debounceTime, filter } from 'rxjs/operators';
import { Regex } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-guest-detail-map',
  templateUrl: './guest-detail-map.component.html',
  styleUrls: ['./guest-detail-map.component.scss'],
})
export class GuestDetailMapComponent implements OnInit, OnDestroy {
  @Input() data;
  @Input() parentFG: FormGroup;
  @Output() onModalClose = new EventEmitter();
  searchFG: FormGroup;
  $subscription = new Subscription();
  hotelId: string;
  reservationIds = [];
  showSearchResult = false;
  channelList;
  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService // private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
    // this.loadChannels();
  }

  initFG(): void {
    this.parentFG = this.fb.group({
      reservationId: [this.data.reservationId || ''],
      guestName: [this.data.name || ''],
      guestPhone: [this.data.phone || ''],
      roomNo: [this.data.roomNo || ''],
      lastMessageAt: [this.data.lastMessageAt],
      firstName: [
        this.data.name?.split(' ')[0] || '',
        [Validators.required, Validators.pattern(Regex.NAME)],
      ],
      lastName: [
        this.data.name?.split(' ')[1] || '',
        [Validators.required, Validators.pattern(Regex.NAME)],
      ],
      channelValue: [''],
      email: [
        this.data.email || '',
        [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)],
      ],
      company: [],
    });
    this.searchFG = this.fb.group({
      search: [this.data.reservationId || ''],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForReservationIdChanges();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.hotelId = this.globalFilterService.hotelId;
      })
    );
  }

  saveDetails() {
    if (this.parentFG.invalid) {
      this.parentFG.markAsTouched();
      this.snackbarService.openSnackBarAsText('Please fill all details');
      return;
    }
    const values = this.parentFG.getRawValue();
    values.guestName = `${values.firstName} ${values.lastName}`;
    if (values.reservationId.length === 0) values.reservationId = null;
    this.$subscription.add(
      this.messageService
        .updateGuestDetail(this.hotelId, this.data.receiverId, values)
        .subscribe(
          (response) => {
            this.messageService.refreshData$.next(true);
            this.onModalClose.emit();
          },
          ({ error }) =>
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: `messages.error.${error?.type}`,
                  priorityMessage: error?.message,
                },
                ''
              )
              .subscribe()
        )
    );
  }

  listenForReservationIdChanges() {
    const formChanges$ = this.searchFG.valueChanges.pipe(
      filter(() => !!(this.searchFG.get('search') as FormControl).value)
    );

    formChanges$.pipe(debounceTime(1000)).subscribe((response) => {
      // setting minimum search character limit to 3
      if (
        response?.search.length >= 3 &&
        response?.search !== this.reservationId.value
      ) {
        this.$subscription.add(
          this.messageService
            .searchBooking(
              this.adminUtilityService.makeQueryParams([
                {
                  key: response?.search,
                  hotel_id: this.hotelId,
                },
              ])
            )
            .subscribe((response) => {
              if (response && response.reservations) {
                this.reservationIds = response.reservations;
                this.showSearchResult = true;
              } else {
                this.reservationIds = [];
                this.showSearchResult = false;
              }
            })
        );
      } else {
        this.reservationIds = [];
        this.showSearchResult = false;
      }
    });
  }

  onFocus() {
    if (
      this.reservationIds.length &&
      this.reservationId.value !== this.searchFG.get('search').value
    ) {
      this.showSearchResult = true;
    }
  }

  setReservationId(value) {
    this.reservationId.setValue(value);
    this.searchFG.get('search').setValue(value);
    this.showSearchResult = false;
  }

  closeModal() {
    this.onModalClose.emit();
    this.parentFG.reset();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get reservationId(): FormControl {
    return this.parentFG.get('reservationId') as FormControl;
  }
}
