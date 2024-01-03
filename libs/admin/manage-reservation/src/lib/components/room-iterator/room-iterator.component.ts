import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  EntitySubType,
  QueryConfig,
  openModal,
} from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomTypeOption } from '../../constants/reservation';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { ReservationType } from '../../constants/reservation-table';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { ReservationCurrentStatus } from '../../models/reservations.model';
import { RoomUpgradeType } from '../../types/response.type';
import {
  RoomUpgradeClose,
  UpgradeRoomTypeComponent,
} from '../upgrade-room-type/upgrade-room-type.component';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent
  implements OnChanges, OnInit, OnDestroy {
  parentFormGroup: FormGroup;
  roomTypeArray: FormArray;

  @Output() listenChanges = new EventEmitter();

  @Input() reservationId: string;
  isDraftBooking: boolean = false;
  isConfirmedBooking: boolean = false;

  @Input() set bookingConfig(value: BookingConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
  }
  fields = roomFields;

  entityId: string;
  globalQueries = [];
  errorMessages = {};

  selectedRoomTypes: RoomTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = [false];
  isDataInitialized = false;
  reinitializeRooms = false;
  updatedRoomsLoaded = false;
  initItems = false;

  itemValuesCount = 0;
  selectedRoomNumber: string = '';
  isCheckedIn = false;
  isCheckedout = false;
  isRouteData = false;

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private controlContainer: ControlContainer,
    public formService: FormService,
    private roomService: RoomService,
    private adminUtilityService: AdminUtilityService,
    public dialogService: DialogService
  ) {
    super(fb);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const itemValues = changes?.itemValues?.currentValue;
    if (itemValues?.length) {
      if (itemValues.length > 1) {
        // Create new form fields for each item in the array
        itemValues.slice(1).forEach((item) => {
          this.createNewFields();
        });
      }
      this.initRoomDetails(itemValues);
      // Patch the new values to the form array
    }
  }

  ngOnInit(): void {
    this.fields[3].name = 'roomNumbers';
    this.fields[3].type = 'multi-select';
    this.entityId = this.globalFilterService.entityId;
    this.initDetails();
    this.listenForGlobalFilters();
    this.createNewFields(true);
    this.listenForFormChanges();
    if (!this.reservationId) this.initItems = true;
  }

  initDetails() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.roomTypeArray = this.fb.array([]);
    this.formService.isDataInitialized.subscribe((res) => {
      if (res) {
        this.isDataInitialized = res;
      }
    });
    this.listenForDateChanges();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [...data['dateRange'].queryValue];
    });
    this.formService.currentJourneyStatus.subscribe((res) => {
      if (res) {
        this.isCheckedIn =
          res === ReservationCurrentStatus.INHOUSE ||
          res === ReservationCurrentStatus.DUEOUT;
        this.isCheckedout = res === ReservationCurrentStatus.CHECKEDOUT;
      }
    });
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(initialField = false): void {
    const data = {
      roomTypeId: ['', [Validators.required]],
      ratePlanId: [''],
      roomCount: ['', [Validators.required, Validators.min(1)]],
      roomNumber: [''],
      roomNumbers: [[]],
      adultCount: ['', [Validators.required, Validators.min(1)]],
      childCount: ['', [Validators.min(0)]],
      ratePlans: [[]],
      rooms: [[]],
      id: [''],
    };

    const formGroup = this.fb.group(data);
    this.roomTypeArray.push(formGroup);
    // Index for keeping track of roomTypes array.
    const index = this.roomTypeArray.controls.indexOf(formGroup);

    if (initialField) {
      const roomInformationGroup = this.fb.group({
        roomTypes: this.roomTypeArray,
      });
      this.parentFormGroup.addControl('roomInformation', roomInformationGroup);
    }

    if (!this.reservationId) {
      this.fields[3].name = 'roomNumbers';
      this.fields[3].type = 'multi-select';
      this.listenForRoomChanges(index);
    }
  }

  listenForDateChanges() {
    this.formService.reinitializeRooms.subscribe((res) => {
      if (res) {
        this.reinitializeRooms = !this.reinitializeRooms;
        this.updatedRoomsLoaded = true;
      }
    });
  }

  listenForRoomChanges(index: number) {
    let roomCount = +this.roomControls[index].get('roomCount')?.value ?? 0;
    this.roomControls[index]
      .get('roomNumbers')
      .valueChanges.subscribe((res) => {
        if (res) {
          const currentRoomCount = res.length ? res.length : 1;
          // Update roomCount
          this.roomControls[index].get('roomCount').setValue(currentRoomCount);
        }
      });
    this.roomControls[index].get('roomCount').valueChanges.subscribe((res) => {
      if (res) {
        let currentRoomCount = +res ? +res : 1;
        let previousRoomCount = roomCount;
        let previousAdultCount = +this.roomControls[index].get('adultCount')
          .value;

        // Update roomCount
        roomCount = currentRoomCount;
        // Update adultCount only if room count is increased
        if (
          currentRoomCount > previousRoomCount &&
          currentRoomCount > previousAdultCount
        ) {
          this.roomControls[index]
            .get('adultCount')
            .setValue(currentRoomCount, {
              emitEvent: false,
            });
        }
      }
    });
  }

  // Init Room Details
  initRoomDetails(itemValues: RoomTypes[]) {
    this.itemValuesCount = itemValues.length;
    itemValues.forEach((value, index) => {
      // Rooms number is not multi-select in edit mode for confirmed reservation.
      if (
        this.reservationInfoControls.reservationType.value !== 'DRAFT' &&
        !this.isDraftBooking &&
        !this.isRouteData
      ) {
        this.fields[3].name = 'roomNumber';
        this.fields[3].type = 'select';
      }
      // Patch room details in the form array
      this.selectedRoomNumber = value?.roomNumber;
      this.roomControls[index].patchValue(
        {
          roomTypeId: value.roomTypeId,
          roomCount: value.roomCount,
          childCount: value.childCount,
          adultCount: value.adultCount,
          ratePlanId: value.ratePlans?.value ?? value.ratePlanId,
          roomNumbers: value?.roomNumbers,
          roomNumber: value?.roomNumber,
          id: value?.id,
        },
        { emitEvent: false }
      );

      // Init rooms data
      this.initItems = true;
    });
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          offset: 0,
          limit: 200,
          raw: true,
          roomTypeStatus: true,
          createBooking: true,
        },
      ]),
    };
    return config;
  }

  /**
   * @function listenRoomTypeChanges Listen changes in room type
   * @param index to keep track of the form array.
   */
  listenRoomTypeChanges(
    roomType: RoomTypeOption,
    index: number,
    defaultOption: boolean
  ) {
    if (roomType) {
      this.selectedRoomTypes[index] = defaultOption ? null : roomType;
      const ratePlanOptions = roomType.ratePlans;
      // Patch the selected room number if available.
      this.roomControls[index].patchValue(
        {
          ratePlans: ratePlanOptions,
          rooms:
            (this.selectedRoomNumber?.length &&
              !roomType.rooms.some(
                (room) => room?.value === this.selectedRoomNumber
              )) ||
            this.updatedRoomsLoaded
              ? [
                  {
                    label: this.selectedRoomNumber,
                    value: this.selectedRoomNumber,
                  },
                  ...roomType.rooms,
                ]
              : roomType.rooms,
        },
        { emitEvent: false }
      );
      if (
        !this.isCheckedIn &&
        !this.isCheckedout &&
        (this.isDataInitialized ||
          (!this.reservationId && !this.isRouteData)) &&
        (!this.updatedRoomsLoaded || !this.isConfirmedBooking)
      ) {
        this.roomControls[index].get('roomNumbers').reset();
        this.roomControls[index].get('roomNumber').reset();
        // Patch default Base rate plan when not in edit mode.
        const defaultPlan = ratePlanOptions.filter((item) => item.isBase)[0]
          ?.value;
        this.roomControls[index].patchValue(
          {
            ratePlanId: defaultPlan ? defaultPlan : ratePlanOptions[0].value,
            adultCount: 1,
            roomCount: this.roomControls[index].get('roomNumbers')?.value
              ?.length
              ? this.roomControls[index].get('roomNumbers')?.value.length
              : 1,
            childCount: 0,
          },
          { emitEvent: false }
        );
      }
    }
  }

  listenForFormChanges(): void {
    this.listenChanges.emit();

    // Listen changes in reservation Type.
    this.reservationInfoControls.reservationType.valueChanges.subscribe(
      (res) => {
        // Disable roomNumber field if the reservation type is draft.
        if (res === ReservationType.DRAFT) {
          this.roomControls.forEach((item) => {
            item.get('roomNumbers').patchValue([], { emitEvent: false });
          });
          this.fields[3].disabled = true;
        } else {
          // Load updated rooms for draft reservations according to current date
          res === ReservationType.CONFIRMED &&
            this.isDraftBooking &&
            !this.updatedRoomsLoaded &&
            this.formService.reinitializeRooms.next(true);
          this.fields[3].disabled = false;
        }
      }
    );
  }

  getConfig() {
    const queries = {
      type: EntitySubType.ROOM_TYPE,
      toDate: this.reservationInfoControls.to?.value,
      fromDate: this.reservationInfoControls.from?.value,
      createBooking: true,
      raw: true,
      roomTypeStatus: true,
    };
    return queries;
  }

  // Patch data for selected room type
  roomTypeChange(event: RoomTypeResponse, index: number, defaultOption = true) {
    if (event) {
      this.listenRoomTypeChanges(
        this.formService.setReservationRoomType(event),
        index,
        defaultOption
      );
      this.isDraftBooking && this.listenForRoomChanges(index);

      // Data initialized only when all the roomTypes in itemValues are patched.
      this.itemValuesCount - 1 === index &&
        this.reservationId &&
        this.formService.isDataInitialized.next(true);
    }
  }

  loadMoreRoomTypes(id: string, index: number) {
    this.roomService.getRoomTypeById(this.entityId, id).subscribe((res) => {
      if (res) {
        this.roomTypeChange(res, index, false);
      }
    });
  }

  /**
   * @function addNewField Handle addition of new field to array
   */
  addNewField() {
    if (this.roomTypeArray.invalid) {
      this.roomTypeArray.markAllAsTouched();
      return;
    }
    this.createNewFields();
  }

  /**
   * @function removeField handle the removal of fields from array
   * @param index position at which value is to be removed
   */
  removeField(index: number) {
    if (this.roomTypeArray.length === 1) {
      this.roomTypeArray.at(0).reset({ value: null, emitEvent: false });
      return;
    }
    this.roomTypeArray.removeAt(index);
  }

  upgradeRoomType() {
    const ref = openModal({
      config: {
        width: '60vw',
        header: 'Room Upgrade',
        styleClass: 'header-dialog',
        data: {
          entityId: this.entityId,
          reservationId: this.reservationId,
          effectiveDate: this.isCheckedIn
            ? this.reservationInfoControls.from.value
            : Date.now(),
          toDate: this.reservationInfoControls.to.value,
        },
      },
      component: UpgradeRoomTypeComponent,
      dialogService: this.dialogService,
    });
    ref.onClose.subscribe((res) => res && this.onCloseRoomUpgrade(res));
  }

  onCloseRoomUpgrade(upgradedRoom: RoomUpgradeClose) {
    if (upgradedRoom) {
      // this.roomControls[0].patchValue({
      //   roomTypeId: upgradedRoom.roomTypeId,
      //   roomNumber: upgradedRoom.roomNumber,
      //   ratePlanId: upgradedRoom.ratePlanId,
      //   rooms: upgradedRoom.rooms,
      //   ratePlans: upgradedRoom.ratePlans,
      // });
    }
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get inputControls() {
    return this.parentFormGroup.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get reservationInfoControls() {
    return (this.controlContainer.control.get(
      'reservationInformation'
    ) as FormGroup).controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get roomControls() {
    return ((this.parentFormGroup.get('roomInformation') as FormGroup).get(
      'roomTypes'
    ) as FormArray).controls;
  }

  errorMessage(field: IteratorField) {
    return `Value should be more than ${field.minValue}`;
  }
}

type BookingConfig = {
  reservationId: string;
  isDraftBooking?: boolean;
  isRouteData?: boolean;
  isConfirmedBooking?: boolean;
};
