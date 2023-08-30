import {
  Component,
  ElementRef,
  EventEmitter,
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
import { GlobalFilterService, Item } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AdminUtilityService, EntitySubType } from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { RoomTypeOptionList } from '../../models/reservations.model';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
import { ReservationForm, RoomTypes } from '../../constants/form';
import { RoomsByRoomType } from 'libs/admin/room/src/lib/types/service-response';
@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent
  implements OnChanges, OnInit, OnDestroy {
  parentFormGroup: FormGroup;
  roomTypeArray: FormArray;

  @Output() refreshData = new EventEmitter();
  @Output() listenChanges = new EventEmitter();

  fields = roomFields;

  entityId: string;
  globalQueries = [];
  errorMessages = {};

  roomTypeOffSet = 0;
  roomTypeLimit = 20;

  roomTypes: RoomFieldTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = [false];
  isDefaultRoomType = false;

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService,
    private controlContainer: ControlContainer
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
    this.createNewFields();
    this.listenForFormChanges();
  }

  initDetails() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.roomTypeArray = this.fb.array([]);
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];

      this.getRoomType(this.globalQueries);
    });
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(): void {
    const data = {
      roomTypeId: ['', [Validators.required]],
      ratePlan: [{ value: '', disabled: true }],
      roomCount: ['', [Validators.required]],
      roomNumbers: [{ value: [], disabled: true }],
      adultCount: ['', [Validators.required]],
      childCount: [''],
      ratePlanOptions: [[]],
      roomNumberOptions: [[]],
      id: [''],
    };

    const formGroup = this.fb.group(data);
    this.roomTypeArray.push(formGroup);

    // Index for keeping track of roomTypes array.
    const index = this.roomTypeArray.controls.indexOf(formGroup);
    const roomInformationGroup = this.fb.group({
      roomTypes: this.roomTypeArray,
    });
    this.parentFormGroup.addControl('roomInformation', roomInformationGroup);

    this.listenRoomFormChanges(index);
  }

  listenRoomFormChanges(index: number) {
    this.listenRoomTypeChanges(index);
    this.listenRatePlanChanges(index);
    this.listenRoomNumbersChanges(index);
  }

  // Init Room Details
  initRoomDetails(itemValues: RoomTypes[]) {
    this.isDefaultRoomType = true;
    itemValues.forEach((value, index) => {
      // Check if the room type option is present
      if (
        this.roomTypes.findIndex((item) => item.value === value.roomTypeId) ===
        -1
      ) {
        this.roomTypes.push({
          label: value?.roomTypeLabel,
          value: value?.roomTypeId,
          roomCount: value?.roomCount,
          maxAdult: value?.adultCount,
          maxChildren: value?.childCount,
          ratePlan: [value.allRatePlans],
          id: value?.id,
        });
      }
      // Patch room details in the form array
      this.roomControls[index].patchValue({
        roomTypeId: value.roomTypeId,
        roomCount: value.roomCount,
        childCount: value.childCount,
        adultCount: value.adultCount,
        ratePlan: value.allRatePlans.value,
        roomNumbers: value?.roomNumbers,
        id: value?.id,
      });
    });
  }

  /**
   * @function listenRoomTypeChanges Listen changes in room type
   * @param index to keep track of the form array.
   */
  listenRoomTypeChanges(index: number) {
    this.roomControls[index]
      .get('roomTypeId')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          // Get currently selected room type
          const selectedRoomType = this.roomTypes.find(
            (item) => item.value === res
          );

          this.roomControls[index].get('roomNumbers').reset();
          if (selectedRoomType) {
            // Sets rate plan options according to the selected room type
            const ratePlanOptions = selectedRoomType.ratePlan.map((item) => ({
              label: item.label,
              value: item.value,
              sellingprice: item.sellingPrice,
              isBase: item.isBase,
            }));
            this.roomControls[index]
              .get('ratePlanOptions')
              .patchValue(ratePlanOptions, { emitEvent: false });

            this.getRoomsByRoomType(res, index);
            if (!this.isDefaultRoomType) {
              // Patch default Base rate plan when not in edit mode.
              const defaultPlan = ratePlanOptions.filter(
                (item) => item.isBase
              )[0]?.value;
              // If there is no default plan patch first plan.
              defaultPlan
                ? this.roomControls[index]
                    .get('ratePlan')
                    .patchValue(defaultPlan, { emitEvent: false })
                : this.roomControls[index]
                    .get('ratePlan')
                    .patchValue(ratePlanOptions[0].value, { emitEvent: false });
            }
          }
          this.updateFormValueAndValidity(index);
        }
      });
  }

  getRoomsByRoomType(roomTypeId: string, index: number) {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          from: this.inputControls.reservationInformation.get('from').value,
          to: this.inputControls.reservationInformation.get('to').value,
          type: 'ROOM',
          createBooking: true,
          roomTypeId: roomTypeId,
        },
      ]),
    };
    // Set loading for roomNumber
    this.fields[3].loading[index] = true;
    this.manageReservationService
      .getRoomNumber(this.entityId, config)
      .subscribe((res) => {
        const roomNumberOptions = res.rooms
          .filter((room: RoomsByRoomType) => room.roomNumber.length)
          .map((room: RoomsByRoomType) => ({
            label: room.roomNumber,
            value: room.roomNumber,
          }));
        this.roomControls[index]
          .get('roomNumberOptions')
          .patchValue(roomNumberOptions, { emitEvent: false });
        this.fields[3].loading[index] = false;
      });
  }

  /**
   * @function updateFormValueAndValidity Updates child, adult and room count values and validations
   */
  updateFormValueAndValidity(index: number) {
    this.roomControls[index].get('ratePlan').enable();
    this.roomControls[index].get('roomNumbers').enable();
    if (!this.isDefaultRoomType) {
      // Patch default count values only if not in edit mode
      this.roomControls[index]
        .get('adultCount')
        .patchValue(1, { emitEvent: false });
      this.roomControls[index]
        .get('roomCount')
        .patchValue(1, { emitEvent: false });
      this.roomControls[index]
        .get('childCount')
        .patchValue(0, { emitEvent: false });
    }
  }

  /**
   * @function listenRatePlanChanges Listen changes in rate plan
   * @param index to keep track of the form array.
   */
  listenRatePlanChanges(index: number) {
    this.roomControls[index].get('ratePlan')?.valueChanges.subscribe((res) => {
      if (res) {
        const selectedRatePlan = this.roomControls[index]
          .get('ratePlanOptions')
          .value.find((item) => item.value === res);
      }
    });
  }

  listenRoomNumbersChanges(index) {
    this.roomControls[index]
      .get('roomNumbers')
      .valueChanges.subscribe((res) => {
        if (res) {
          this.roomControls[index]
            .get('roomCount')
            .patchValue(res.length, { emitEvent: false });
        }
      });
  }

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes(index: number): void {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomType(this.globalQueries, index);
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string, index): void {
    if (text) {
      this.loadingRoomTypes[index] = true;
      this.manageReservationService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=${EntitySubType.ROOM_TYPE}`,
        })
        .subscribe(
          (res: any) => {
            const data = res;
            this.roomTypes =
              data.ROOM_TYPE?.filter((item) => item.status).map((item) => {
                new RoomTypeForm().deserialize(item);
                return {
                  label: item.name,
                  value: item.id,
                  ratePlan: item.allRatePlans,
                  roomCount: item.roomCount,
                  maxChildren: item.maxChildren,
                  maxAdult: item.maxAdult,
                };
              }) ?? [];
            this.fields[0].options = this.roomTypes;
            this.loadingRoomTypes[index] = false;
          },
          ({ error }) => {
            this.loadingRoomTypes[index] = false;
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes[index] = false;
          }
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [];
      this.getRoomType(this.globalQueries);
    }
  }

  getSummaryData(): void {
    this.refreshData.emit();
  }

  listenForFormChanges(): void {
    this.listenChanges.emit();
  }

  /**
   * @function getRoomType to get room types.
   * @param queries global Queries.
   */
  getRoomType(queries, index?: number): void {
    queries = [
      ...queries,
      {
        type: EntitySubType.ROOM_TYPE,
        offset: this.roomTypeOffSet,
        limit: this.roomTypeLimit,
        createBooking: true,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };

    this.loadingRoomTypes[index ?? 0] = true;
    this.$subscription.add(
      this.manageReservationService
        .getRoomTypeList(this.entityId, config)
        .subscribe(
          (response) => {
            const data = new RoomTypeOptionList()
              .deserialize(response)
              .records.map((item) => ({
                label: item.name,
                value: item.id,
                ratePlan: item.allRatePlans,
                roomCount: 1,
                maxChildren: item.maxChildren,
                maxAdult: item.maxAdult,
              }));
            this.roomTypes = [...this.roomTypes, ...data];
            this.fields[0].options = this.roomTypes;
            this.loadingRoomTypes[index ?? 0] = false;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes[index ?? 0] = false;
          }
        )
    );
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

  get roomControls() {
    return ((this.parentFormGroup.get('roomInformation') as FormGroup).get(
      'roomTypes'
    ) as FormArray).controls;
  }
}
