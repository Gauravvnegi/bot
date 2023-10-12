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
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { IteratorField } from 'libs/admin/shared/src/lib/types/fields.type';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { CalendarViewData } from 'libs/admin/reservation/src/lib/components/reservation-calendar-view/reservation-calendar-view.component';

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
  @Input() paramsData: CalendarViewData;
  fields = roomFields;

  entityId: string;
  globalQueries = [];
  errorMessages = {};

  roomTypes: RoomFieldTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = [false];
  isDefaultRoomType = false;

  itemValuesCount = 0;
  selectedRoomNumber: string = '';

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private controlContainer: ControlContainer,
    public formService: FormService
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
      ratePlan: [{ value: '', disabled: true }],
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
  }

  // Init Room Details
  initRoomDetails(itemValues: RoomTypes[]) {
    this.isDefaultRoomType = true;
    this.itemValuesCount = itemValues.length;
    itemValues.forEach((value, index) => {
      // Rooms number is not multi-select in edit mode.
      if (this.reservationInfoControls.reservationType.value !== 'DRAFT') {
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
        ratePlan: value.allRatePlans?.value ?? value.ratePlan,
        roomNumbers: value?.roomNumbers,
        roomNumber: value?.roomNumber,
        id: value?.id,
      });
    });
  }

  /**
   * @function listenRoomTypeChanges Listen changes in room type
   * @param index to keep track of the form array.
   */
  listenRoomTypeChanges(index: number) {
    if (this.roomTypes.length) {
      // Sets rate plan options according to the selected room type
      const ratePlanOptions = this.roomTypes[index].ratePlan.map((item) => ({
        label: item.label,
        value: item.value,
        sellingprice: item.sellingPrice,
        isBase: item.isBase,
      }));

      // Patch the selected room number if available.
      this.roomControls[index].patchValue(
        {
          ratePlanOptions: ratePlanOptions,
          roomNumberOptions: this.selectedRoomNumber.length
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

      if (!this.isDefaultRoomType) {
        this.roomControls[index].get('roomNumbers').reset();
        // Patch default Base rate plan when not in edit mode.
        const defaultPlan = ratePlanOptions.filter((item) => item.isBase)[0]
          ?.value;
        this.roomControls[index].patchValue(
          {
            ratePlan: defaultPlan ? defaultPlan : ratePlanOptions[0].value,
            adultCount: 1,
            roomCount: 1,
            childCount: 0,
          },
          { emitEvent: false }
        );
        this.roomControls[index].get('ratePlan').enable();
      }

      // Enable Rate plan in Draft Booking in edit mode
      if (
        this.isDefaultRoomType &&
        this.reservationInfoControls.reservationType.value === 'DRAFT'
      ) {
        this.roomControls[index].get('ratePlan').enable();
      }
      setTimeout(() => {
        this.isDefaultRoomType = false;
      }, 2000);
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
    if (event) {
      const data = new RoomTypeForm().deserialize(event);
      this.roomTypes[index] = {
        label: data.name,
        value: data.id,
        ratePlan: data.allRatePlans,
        roomCount: 1,
        maxChildren: data.maxChildren,
        maxAdult: data.maxAdult,
        rooms: data.rooms.map((room) => ({
          label: room.roomNumber,
          value: room.roomNumber,
        })),
      };
      this.listenRoomTypeChanges(index);
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
    this.isDefaultRoomType = false;
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

  // getRoomTypeById

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
