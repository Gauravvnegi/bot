import {
  Component,
  ElementRef,
  EventEmitter,
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
  globalQueries = [];
  errorMessages = {};
  roomTypeOffSet = 0;
  roomTypeLimit = 10;
  ratePlans: Option[] = [];
  roomTypes: RoomFieldTypeOption[] = [];
  entityId: string;
  $subscription = new Subscription();
  loadingRoomTypes = false;

  ratePlanOptionsArray: Option[][] = [];

  @ViewChild('main') main: ElementRef;

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService,
    private controlContainer: ControlContainer,
    private configService: ConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initOptions();
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.roomTypeArray = this.fb.array([]);
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
      roomNumber: [[]],
      adultCount: ['', [Validators.required, Validators.min(1)]],
      childCount: ['', [Validators.min(0)]],
      price: [''],
      index: [''],
    };

    const formGroup = this.fb.group(data);
    this.roomTypeArray.push(formGroup);

    const index = this.roomTypeArray.controls.indexOf(formGroup);
    // formGroup.addControl('index', this.fb.control(index));
    const roomInformationGroup = this.fb.group({
      roomTypes: this.roomTypeArray,
    });
    this.parentFormGroup.addControl('roomInformation', roomInformationGroup);
    this.roomControls[index].get('index').setValue(index);
    this.listenRoomTypeChanges(index);
    this.listenRatePlanChanges(index);
    this.listenForFormChanges(index);

    // this.setFormDisability();
  }

  listenRoomTypeChanges(index: number) {
    this.roomControls[index]
      .get('roomTypeId')
      ?.valueChanges.subscribe((res) => {
        if (res) {
          const selectedRoomType = this.roomTypes.find(
            (item) => item.value === res
          );
          if (selectedRoomType) {
            this.ratePlanOptionsArray[index] = selectedRoomType.ratePlan.map(
              (item) => {
                const availableRatePlan = this.ratePlans.find(
                  (ratePlan) => ratePlan.value === item.value
                );
                return {
                  label: availableRatePlan ? availableRatePlan.label : '',
                  value: item.value,
                  price: item.price,
                };
              }
            );
            this.roomControls[index].get('ratePlan').enable();
            this.roomControls[index]
              .get('ratePlan')
              .setValidators([Validators.required]);
          }
          // this.fields[2].options = ['201', '202'];
        }
      });
  }

  listenRatePlanChanges(index: number) {
    this.roomControls[index].get('ratePlan')?.valueChanges.subscribe((res) => {
      const selectedRatePlan = this.ratePlanOptionsArray[index].find(
        (item) => item.value === res
      );
      if (selectedRatePlan)
        this.roomControls[index].get('price').setValue(selectedRatePlan.price);
    });
  }

  initOptions() {
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { roomRatePlans } = value;
        this.ratePlans = roomRatePlans.map((item) => ({
          label: item.label,
          value: item.id,
        }));
        // this.fields[1].options = this.ratePlans;
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
                  ratePlanId: item.ratePlanId,
                  roomNumber: ['200', '201'],
                  roomCount: item.roomCount,
                  maxChildren: item.maxChildren,
                  maxAdult: item.maxAdult,
                };
              }) ?? [];
            this.fields[0].options = this.roomTypes;
            // this.fields[3].options = this.roomTypes.map((item)=>)
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
   * Handle addition of new field to array
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
