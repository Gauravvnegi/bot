import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ConfigService,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  BookingConfig,
  ReservationFormData,
} from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import {
  GuestDetails,
  QuickReservation,
} from '../../data-models/reservation.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';
import { Router } from '@angular/router';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { IGRoomType } from '../reservation-calendar-view/reservation-calendar-view.component';
import { IGCol } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';
import { debounceTime } from 'rxjs/operators';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-quick-reservation-form',
  templateUrl: './quick-reservation-form.component.html',
  styleUrls: ['./quick-reservation-form.component.scss'],
})
export class QuickReservationFormComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Item', link: './' }];

  useForm: FormGroup;

  entityId: string;
  reservationId: string;

  roomTypes: Option[] = [];
  ratePlans: Option[] = [];
  guests: Option[] = [];
  guestOptions: Option[] = [];
  globalQueries = [];

  loading: boolean = false;
  isSidebar = false;
  isCreateForm = false;

  selectedRoomType: IGRoomType;
  selectedRoom: string;
  date: IGCol;

  guestDetails: GuestDetails;
  configData: BookingConfig;
  reservationData: QuickReservation;

  $subscription = new Subscription();

  @Output() onCloseSidebar = new EventEmitter();
  @Input() set reservationConfig(value: QuickReservationConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
    if (this.selectedRoomType) this.initDetails();
  }

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private manageReservationService: ManageReservationService,
    private formService: FormService,
    private adminUtilityService: AdminUtilityService,
    private roomService: RoomService,
    private guestService: GuestTableService
  ) {
    this.initForm();
  }

  ngOnInit(): void {}

  initDetails() {
    this.getCountryCode();

    if (this.reservationId) {
      this.isCreateForm = false;
      this.initReservationDetails();
    } else {
      this.isCreateForm = true;
      this.initRatePlans();
      this.useForm
        .get('roomInformation.roomTypeId')
        .patchValue(this.selectedRoomType.value);
      this.listenForRoomTypeChanges();
      this.initDefaultDate();
    }

    this.initRooms();
    this.listenForGlobalFilters();
    this.getGuests();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.entityId = this.globalFilterService.entityId;
        this.globalQueries = [
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: 'DUEIN',
          },
        ];
      })
    );
  }

  initDefaultDate() {
    const fromDate = new Date(this.date); // Convert epoch to milliseconds
    const toDate = new Date(fromDate);
    toDate.setDate(fromDate.getDate() + 1); // Add 1 day

    this.useForm.get('reservationInformation').patchValue({
      from: fromDate,
      to: toDate,
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      reservationInformation: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        source: ['', Validators.required],
        sourceName: ['', [Validators.required, Validators.maxLength(60)]],
        marketSegment: ['', Validators.required],
      }),

      roomInformation: this.fb.group({
        roomTypeId: ['', [Validators.required]],
        ratePlan: [''],
        roomCount: ['', [Validators.required, Validators.min(1)]],
        roomNumber: [''],
        adultCount: ['', [Validators.required, Validators.min(1)]],
        childCount: ['', [Validators.min(0)]],
        roomsOptions: [[]],
        id: [''],
      }),

      instructions: this.fb.group({
        specialInstructions: [''],
      }),

      paymentMethod: this.fb.group({
        totalPaidAmount: [0, [Validators.min(0)]],
        currency: ['INR'],
        paymentMethod: ['Cash Payment'],
      }),

      guestInformation: this.fb.group({
        guestDetails: ['', [Validators.required]],
      }),
    });

    this.entityId = this.globalFilterService.entityId;
  }

  close(): void {
    this.onCloseSidebar.emit();
  }

  editForm() {
    this.router.navigate([`/pages/efrontdesk/reservation/add-reservation`], {
      queryParams: {
        entityId: this.entityId,
      },
    });
  }

  initReservationDetails() {
    this.$subscription.add(
      this.manageReservationService
        .getReservationDataById(this.reservationId, this.entityId)
        .subscribe((res) => {
          const reservationData = new ReservationFormData().deserialize(res);
          this.guestDetails = {
            guestName:
              res.guest.firstName +
              ' ' +
              (res.guest?.lastName ? res.guest.lastName : ''),
            phoneNumber:
              res.guest.contactDetails?.cc +
              '' +
              res.guest?.contactDetails?.contactNumber,
            id: res.guest?.id ?? '',
            email: res.guest?.contactDetails?.emailId,
          };
          this.useForm.patchValue(reservationData);
        })
    );
  }

  initRatePlans() {
    this.$subscription.add(
      this.roomService
        .getRoomTypeById(this.entityId, this.selectedRoomType.value)
        .subscribe((res) => {
          this.ratePlans = res.ratePlans.map((res) => ({
            label: res.label,
            value: res.id,
          }));
          this.useForm.get('roomInformation').patchValue({
            ratePlan: this.ratePlans[0].value,
          });
        })
    );
  }

  listenForRoomTypeChanges() {
    this.useForm
      .get('roomInformation.roomTypeId')
      .valueChanges.pipe(debounceTime(500))
      .subscribe((res) => {
        if (res) {
          this.selectedRoomType = this.roomTypes.find(
            (roomType) => roomType.value === res
          );
          this.initRooms();
          this.initRatePlans();
        }
      });
  }

  initRooms() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          from: this.useForm.get('reservationInformation.from').value,
          to: this.useForm.get('reservationInformation.to').value,
          type: 'ROOM',
          createBooking: true,
          roomTypeId: this.selectedRoomType.value,
        },
      ]),
    };
    this.formService.getRooms({
      entityId: this.entityId,
      config: config,
      type: 'string',
      roomControl: this.useForm.get('roomInformation.room'),
      roomNumbersControl: this.useForm.get('roomInformation.roomsOptions'),
      defaultRoomNumbers: [this.selectedRoom],
    });
  }

  getGuests() {
    this.$subscription.add(
      this.guestService.getGuestList(this.getConfig()).subscribe((res) => {
        const guests = res.records;
        this.guestOptions = guests.map((guest) => ({
          label: `${guest.firstName} ${guest.lastName}`,
          value: guest.id,
          phoneNumber: guest.contactDetails.contactNumber,
          cc: guest.contactDetails.cc,
          email: guest.contactDetails.emailId,
        }));
      })
    );
  }

  getConfig() {
    const config = [
      ...this.globalQueries,
      {
        entityState: 'ALL',
        offset: 0,
        limit: 10,
        type: 'GUEST',
      },
    ];
    return { params: this.adminUtilityService.makeQueryParams(config) };
  }

  getCountryCode(): void {
    this.$subscription.add(
      this.configService
        .getColorAndIconConfig(this.entityId)
        .subscribe((response) => {
          this.configData = new BookingConfig().deserialize(
            response.bookingConfig
          );
        })
    );
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.useForm.getRawValue();
    this.formService.mapRoomReservationData(data);
    this.loading = true;
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Service Created successfully`,
      '',
      { panelClass: 'success' }
    );
    this.onCloseSidebar.emit();
  };

  handleError = (error) => {
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

export type QuickReservationConfig = {
  reservationId: string;
  selectedRoom?: string;
  roomTypes?: Option[];
  selectedRoomType?: IGRoomType;
  date: IGCol;
};
