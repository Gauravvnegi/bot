import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
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
import {
  AdminUtilityService,
  ConfigService,
  Option,
} from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';

import {
  RoomTypeOption,
  RoomTypeOptionList,
} from '../../models/reservations.model';
import { FormService } from '../../services/form.service';
@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent
  implements OnInit, OnDestroy {
  parentFormGroup: FormGroup;
  roomTypeArray: FormArray;

  @Output() refreshData = new EventEmitter();
  @Output() listenChanges = new EventEmitter();

  fields = roomFields;

  entityId: string;
  globalQueries = [];
  errorMessages = {};

  roomTypeOffSet = 0;
  roomTypeLimit = 10;

  maxAdultLimit = 0;
  maxChildLimit = 0;

  ratePlans: Option[] = [];
  roomTypes: RoomFieldTypeOption[] = [];

  $subscription = new Subscription();

  loadingRoomTypes = false;

  ratePlanOptionsArray: Option[][] = [];
  roomNumberOptionsArray: Option[][] = [];

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService,
    private controlContainer: ControlContainer,
    private configService: ConfigService,
    private formService: FormService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initDetails();
    this.createNewFields();
    this.listenForGlobalFilters();
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
    this.listenForFormChanges(index);
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
            // find the rate plan available in the room type
            this.ratePlanOptionsArray[index] = selectedRoomType.ratePlan.map(
              (item) => {
                const availableRatePlan = this.ratePlans.find(
                  (ratePlan) => ratePlan.value === item.value
                );
                // set the price, value and discounted price of the rate plan.
                return {
                  label: availableRatePlan ? availableRatePlan.label : '',
                  value: item.value,
                  price: item.price,
                  discountedPrice: item.discountedPrice,
                };
              }
            );
            this.roomControls[index].get('ratePlan').enable();
            this.roomControls[index]
              .get('ratePlan')
              .setValidators([Validators.required]);
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
    this.roomControls[index].get('adultCount').setValue(1);
    this.roomControls[index].get('roomCount').setValue(1);
    this.roomControls[index].get('childCount').setValue(0);
  }

  /**
   * @function listenRatePlanChanges Listen changes in rate plan
   * @param index to keep track of the form array.
   */
  listenRatePlanChanges(index: number) {
    this.roomControls[index].get('ratePlan')?.valueChanges.subscribe((res) => {
      const selectedRatePlan = this.ratePlanOptionsArray[index].find(
        (item) => item.value === res
      );
      if (selectedRatePlan) {
        this.formService.price.next(selectedRatePlan.price);
        this.formService.discountedPrice.next(selectedRatePlan.discountedPrice);
      }
    });
  }

  initDetails() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.roomTypeArray = this.fb.array([]);
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { roomRatePlans } = value;
        this.ratePlans = roomRatePlans.map((item) => ({
          label: item.label,
          value: item.id,
        }));
      }
    });
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
                new RoomTypeOption().deserialize(item);
                return {
                  label: item.name,
                  value: item.id,
                  ratePlan: item.ratePlan,
                  roomNumber: ['200', '201'],
                  roomCount: item.roomCount,
                  maxChildren: item.maxChildren,
                  maxAdult: item.maxAdult,
                };
              }) ?? [];
            this.fields[0].options = this.roomTypes;
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

  listenForFormChanges(index: number): void {
    this.listenChanges.emit(index);
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
        offset: this.roomTypeOffSet,
        limit: this.roomTypeLimit,
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
                ratePlan: item.ratePlan,
                roomNumber: ['200', '201'],
                roomCount: item.roomCount,
                maxChildren: item.maxChildren,
                maxAdult: item.maxAdult,
              }));
            this.roomTypes = [...this.roomTypes, ...data];
            this.fields[0].options = this.roomTypes;
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
    setTimeout(() => {
      this.main.nativeElement.scrollIntoView({ behavior: 'smooth' });
      this.main.nativeElement.scrollTop = this.main.nativeElement.scrollHeight;
    }, 1000);
  }

  /**
   * @function removeField handle the removal of fields from array
   * @param index position at which value is to be removed
   */
  removeField(index: number) {
    if (this.roomTypeArray.length === 1) {
      this.roomTypeArray.at(0).reset();
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
