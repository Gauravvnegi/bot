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
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService, Item } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AdminUtilityService, ConfigService } from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { RoomTypeOptionList } from '../../models/reservations.model';
import { FormService } from '../../services/form.service';
import { RoomTypeForm } from 'libs/admin/room/src/lib/models/room.model';
import { RoomTypes } from '../../constants/form';
import { forEach } from 'lodash';
import { P } from '@angular/cdk/keycodes';
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

  maxAdultLimit = 0;
  maxChildLimit = 0;

  roomTypes: RoomFieldTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = false;
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

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(): void {
    const data = {
      roomTypeId: ['', [Validators.required]],
      ratePlan: [{ value: '', disabled: true }],
      roomCount: ['', [Validators.required, Validators.min(1)]],
      roomNumber: [{ value: [], disabled: true }],
      adultCount: [''],
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
    this.listenRoomTypeChanges(index);
    this.listenRatePlanChanges(index);
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
      this.roomTypeArray.at(index).patchValue({
        roomTypeId: value.roomTypeId,
        roomCount: value.adultCount,
        childCount: value.childCount,
        adultCount: value.adultCount,
        ratePlan: value.allRatePlans.value,
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

            this.roomControls[index].get('ratePlan').enable();

            if (!this.isDefaultRoomType) {
              // Patch default Base rate plan when not in edit mode.
              const defaultPlan = ratePlanOptions.filter(
                (item) => item.isBase
              )[0].value;
              this.roomControls[index]
                .get('ratePlan')
                .patchValue(defaultPlan, { emitEvent: false });
            }
          }
          this.updateFormValueAndValidity(selectedRoomType, index);
        }
      });
  }

  /**
   * @function updateFormValueAndValidity Updates child, adult and room count values and validations
   */
  updateFormValueAndValidity(
    selectedRoomType: RoomFieldTypeOption,
    index: number
  ) {
    this.maxAdultLimit = selectedRoomType.maxAdult;
    this.maxChildLimit = selectedRoomType.maxAdult;
    this.roomControls[index]
      .get('childCount')
      .setValidators([
        Validators.min(0),
        Validators.max(selectedRoomType.maxChildren),
      ]);
    this.roomControls[index]
      .get('adultCount')
      .setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(selectedRoomType.maxAdult),
      ]);
    this.roomControls[index]
      .get('ratePlan')
      .setValidators([Validators.required]);

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
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes(index: number): void {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomType(this.globalQueries);
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string): void {
    this.loadingRoomTypes = true;
    if (text) {
      this.manageReservationService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=ROOM_TYPE`,
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
            this.loadingRoomTypes = false;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes = false;
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
  getRoomType(queries): void {
    queries = [
      ...queries,
      {
        type: 'ROOM_TYPE',
        pagination: false,
        createBooking: true,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };

    this.loadingRoomTypes = true;
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
            this.loadingRoomTypes = false;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
          },
          () => {
            this.loadingRoomTypes = false;
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
    setTimeout(() => {
      this.main.nativeElement?.scrollIntoView({ behavior: 'smooth' });
      this.main.nativeElement.scrollTop = this.main.nativeElement?.scrollHeight;
    }, 1000);
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

  get roomControls() {
    return ((this.parentFormGroup.get('roomInformation') as FormGroup).get(
      'roomTypes'
    ) as FormArray).controls;
  }
}
