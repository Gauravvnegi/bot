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
import { EntitySubType } from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription, forkJoin } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { debounceTime } from 'rxjs/operators';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';

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
  @Input() isDraftBooking: boolean = false;
  fields = roomFields;

  entityId: string;
  globalQueries = [];
  errorMessages = {};

  roomTypes: RoomFieldTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = [false];
  isDataInitialized = false;
  reinitializeRooms = false;

  itemValuesCount = 0;
  selectedRoomNumber: string = '';

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private controlContainer: ControlContainer,
    public formService: FormService,
    private roomService: RoomService
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
    this.entityId = this.globalFilterService.entityId;
    this.initDetails();
    this.listenForGlobalFilters();
    this.createNewFields(true);
    this.listenForFormChanges();
  }

  initDetails() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.roomTypeArray = this.fb.array([]);
    this.formService.isDataInitialized
      .pipe(debounceTime(500))
      .subscribe((res) => {
        if (res) {
          this.isDataInitialized = res;
          this.listenForDateChanges();
        }
      });
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [...data['dateRange'].queryValue];
    });
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(initialField = false): void {
    const data = {
      roomTypeId: ['', [Validators.required]],
      ratePlan: [''],
      roomCount: ['', [Validators.required, Validators.min(1)]],
      roomNumber: [''],
      roomNumbers: [[]],
      adultCount: ['', [Validators.required, Validators.min(1)]],
      childCount: ['', [Validators.min(0)]],
      ratePlanOptions: [[]],
      roomNumberOptions: [[]],
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
      this.listenForDateChanges();
    }
  }

  listenForDateChanges() {
    this.reservationInfoControls.from.valueChanges.subscribe((res) => {
      if (res) this.reinitializeRooms = !this.reinitializeRooms;
    });
    this.reservationInfoControls.to.valueChanges
      .pipe(debounceTime(50))
      .subscribe((res) => {
        if (res) this.reinitializeRooms = !this.reinitializeRooms;
      });
  }

  listenForRoomChanges(index) {
    let roomCount = this.roomControls[index].get('roomCount').value ?? 0;
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
        let currentRoomCount = res ? res : 1;
        let previousRoomCount = roomCount;
        let previousAdultCount = this.roomControls[index].get('adultCount')
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
      // Rooms number is not multi-select in edit mode.
      if (
        this.reservationInfoControls.reservationType.value !== 'DRAFT' &&
        !this.isDraftBooking
      ) {
        this.fields[3].name = 'roomNumber';
        this.fields[3].type = 'select';
      }
      // Patch room details in the form array
      this.selectedRoomNumber = value?.roomNumber;
      this.roomControls[index].patchValue({
        roomTypeId: value.roomTypeId,
        roomCount: value.roomCount,
        childCount: value.childCount,
        adultCount: value.adultCount,
        ratePlan: value.ratePlans?.value ?? value.ratePlan,
        roomNumbers: value?.roomNumbers,
        roomNumber: value?.roomNumber,
        id: value?.id,
      });
    });

    // const observables = itemValues.map((value, index) =>
    //   this.roomService.getRoomTypeById(this.entityId, value.roomTypeId)
    // );

    // // Use forkJoin to wait for all observables to complete
    // forkJoin(observables).subscribe(
    //   (responses) => {
    //     // Process the responses if needed
    //     responses.forEach((res, index) => {
    //       this.roomTypes[index] = this.formService.setReservationRoomType(res);
    //       this.listenRoomTypeChanges(index);
    //     });
    //   },
    //   (error) => {},
    //   () => this.formService.isDataInitialized.next(true)
    // );
  }

  /**
   * @function listenRoomTypeChanges Listen changes in room type
   * @param index to keep track of the form array.
   */
  listenRoomTypeChanges(index: number) {
    if (this.roomTypes.length) {
      // Sets rate plan options according to the selected room type
      const ratePlanOptions = this.roomTypes[index].ratePlans.map((item) => ({
        label: item.label,
        value: item.value,
        sellingprice: item.sellingPrice,
        isBase: item.isBase,
      }));

      // Patch the selected room number if available.
      this.roomControls[index].patchValue(
        {
          ratePlanOptions: ratePlanOptions,
          roomNumberOptions: this.selectedRoomNumber?.length
            ? [
                {
                  label: this.selectedRoomNumber,
                  value: this.selectedRoomNumber,
                },
                ...this.roomTypes[index].rooms,
              ]
            : this.roomTypes[index].rooms,
        },
        { emitEvent: false }
      );
      if (this.isDataInitialized || !this.reservationId) {
        this.roomControls[index].get('roomNumbers').reset();
        this.roomControls[index].get('roomNumber').reset();
        // Patch default Base rate plan when not in edit mode.
        const defaultPlan = ratePlanOptions.filter((item) => item.isBase)[0]
          ?.value;
        this.roomControls[index].patchValue(
          {
            ratePlan: defaultPlan ? defaultPlan : ratePlanOptions[0].value,
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
  roomTypeChange(event: RoomTypeResponse, index: number) {
    const exists =
      this.roomTypes.length &&
      this.roomTypes.some((item) => item?.value === event?.id);
    if (event && !exists) {
      this.roomTypes[index] = this.formService.setReservationRoomType(event);
      this.listenRoomTypeChanges(index);
      if (this.isDraftBooking) this.listenForRoomChanges(index);
      this.formService.isDataInitialized.next(true);
    }
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
