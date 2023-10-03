import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ConfigService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { BookingConfig } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import {
  GuestDetails,
  QuickReservation,
} from '../../data-models/reservation.model';
import { FormService } from 'libs/admin/manage-reservation/src/lib/services/form.service';

@Component({
  selector: 'hospitality-bot-quick-reservation-form',
  templateUrl: './quick-reservation-form.component.html',
  styleUrls: ['./quick-reservation-form.component.scss'],
})
export class QuickReservationFormComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Item', link: './' }];

  loading: boolean = false;
  useForm: FormGroup;
  entityId: string;
  isSidebar = false;
  guestDetails: GuestDetails;
  @Output() onCloseSidebar = new EventEmitter();
  @Input() set reservationConfig(value: QuickReservationConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
    if (this.reservationId) {
      this.getCountryCode();
      this.initReservationDetails();
    }
    if (this.selectedRoom) {
      this.initRooms();
    }
  }

  reservationId: string;
  roomTypeId: string;
  selectedRoom: string;
  configData: BookingConfig;
  reservationData: QuickReservation;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService,
    private manageReservationService: ManageReservationService,
    private formService: FormService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      from: [''],
      to: [''],
      room: [''],
      roomsOptions: [[]],
      marketSegment: [''],
      adultCount: [''],
      childCount: [''],
      source: [''],
      sourceName: [''],
      specialInstructions: [''],
      price: [''],
    });
  }

  close(): void {
    this.onCloseSidebar.emit();
  }

  editForm() {}

  initReservationDetails() {
    this.manageReservationService
      .getReservationDataById(this.reservationId, this.entityId)
      .subscribe((res) => {
        this.reservationData = new QuickReservation().deserialize(res);
        const { guestDetails, ...data } = this.reservationData;
        this.guestDetails = guestDetails;
        this.useForm.patchValue(data);
      });
  }

  initRooms() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          from: this.useForm.get('from').value,
          to: this.useForm.get('to').value,
          type: 'ROOM',
          createBooking: true,
          roomTypeId: this.roomTypeId,
        },
      ]),
    };
    this.formService.getRooms({
      entityId: this.entityId,
      config: config,
      type: 'string',
      roomControl: this.useForm.get('room'),
      roomNumbersControl: this.useForm.get('roomsOptions'),
      defaultRoomNumbers: [this.selectedRoom],
    });
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
      });
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
}

export type QuickReservationConfig = {
  reservationId: string;
  roomTypeId: string;
  selectedRoom: string;
};
