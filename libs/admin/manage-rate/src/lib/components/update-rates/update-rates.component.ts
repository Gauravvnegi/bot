import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  ModuleNames,
  QueryConfig,
  daysOfWeek,
} from '@hospitality-bot/admin/shared';
import {
  ratesRestrictions,
  RestrictionAndValuesOption,
  restrictionsRecord,
} from '../../constants/data';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { DateOption, RoomMapType } from '../../types/channel-manager.types';
import { RoomTypes, getWeekendBG } from '../../models/bulk-update.models';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ChannelManagerService } from '../../services/channel-manager.service';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { UpdateRates } from '../../models/channel-manager.model';
import { debounceTime, tap } from 'rxjs/operators';
import { UpdateRatesResponse } from '../../types/response.type';

@Component({
  selector: 'hospitality-bot-update-rates',
  templateUrl: './update-rates.component.html',
  styleUrls: ['./update-rates.component.scss'],
})
export class UpdateRatesComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];
  allRoomTypes: RoomTypes[] = [];

  entityId: string;

  dates: DateOption[];
  dateLimit: number = 15;

  restrictions: RestrictionAndValuesOption[];
  loading = false;
  loadingError = false;
  isLoaderVisible = false;
  isRoomsEmpty = false;
  hasDynamicPricing = false;
  currentDate = new Date();

  $subscription = new Subscription();
  private valueChangesSubject = new Subject<string[]>();
  ratesRoomDetails = new Map<string, RoomMapType>();

  constructor(
    private fb: FormBuilder,
    private channelMangerForm: ChannelManagerFormService,
    private globalFilter: GlobalFilterService,
    private snackbarService: SnackBarService,
    private channelManagerService: ChannelManagerService,
    private adminUtilityService: AdminUtilityService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.initDynamicPriceSubscription();
    this.initDate(Date.now());
    this.getRestrictions();
    this.initRoomTypes();
  }

  getRestrictions() {
    this.restrictions = ratesRestrictions.map((item) => {
      const { label, type } = this.restrictionsRecord[item];
      return { label, type, value: item };
    });
  }

  get roomTypesControl() {
    return this.useFormControl.roomTypes?.controls;
  }

  getArray(value?: number, restrictionFA?: FormArray) {
    if (restrictionFA && value) {
      return restrictionFA.controls.map((FG: FormGroup) =>
        FG.get('value').disabled ? FG.get('value').value : value
      );
    }

    if (value) {
      return Array.from({ length: this.dateLimit }).fill(value);
    }
    return Array.from({ length: this.dateLimit }, (_, index) => index);
  }
  initRoomTypes() {
    this.channelMangerForm.roomDetails.subscribe((rooms: RoomTypes[]) => {
      if (this.channelMangerForm.isRoomDetailsLoaded) {
        rooms = rooms.map((room: RoomTypes) => {
          // baseRatePlan should be at the top of the list in ratePlan
          room.ratePlans.sort((ratePlan1, ratePlan2) => {
            if (ratePlan1.isBase && !ratePlan2.isBase) {
              return -1; // ratePlan1 should come before ratePlan2
            } else if (!ratePlan1.isBase && ratePlan2.isBase) {
              return 1; // ratePlan2 should come before ratePlan1
            } else {
              return 0; // no preference if both are base or both are not base
            }
          });
          return room;
        });

        this.roomTypes = rooms;
        this.allRoomTypes = rooms;
        this.initForm();
      } else {
        this.channelMangerForm.loadRoomTypes(this.entityId);
      }
    });
  }

  initForm() {
    this.currentDate.setHours(0, 0, 0, 0);
    this.useForm = this.fb.group({
      roomType: [],
      date: [this.currentDate.getTime()],
    });
    this.addRoomsControl();
  }

  addRoomsControl() {
    this.addRoomTypesControl();
    if (this.hasDynamicPricing) this.addRootDynamicControl();
    this.listenChanges();
    this.getRates();
  }

  addRootDynamicControl() {
    this.useForm.addControl(
      'dynamicPricing',
      this.getValuesArrayControl('boolean')
    );
  }

  /**
   * Add Room Types Control
   */
  addRoomTypesControl() {
    this.useForm.addControl('roomTypes', this.fb.array([]));
    this.roomTypes.forEach((roomType, roomTypeIdx) => {
      this.useFormControl.roomTypes.push(
        this.fb.group({
          label: roomType.label,
          value: roomType.value,
          isBaseRoomType: roomType.isBaseRoomType,
          basePrice: roomType.price,
          masterBasePrice: roomType.price,
        })
      );
      this.addRoomDynamicPriceControl(roomTypeIdx);
      this.addRatePlansControls(roomType.ratePlans, roomTypeIdx);
    });
  }

  /**
   * Add Rates plan control to room type control
   * @param ratePlans rate plans array
   * @param roomTypeIdx selected room type index
   */
  addRoomDynamicPriceControl(roomTypeIdx: number) {
    const roomTypeFormGroup = this.useFormControl.roomTypes.at(
      roomTypeIdx
    ) as FormGroup;

    roomTypeFormGroup.addControl('dynamicPrice', this.fb.array([]));
    const dynamicPriceFormArray = roomTypeFormGroup.get(
      'dynamicPrice'
    ) as FormArray;

    this.dates.forEach((date, idx) => {
      dynamicPriceFormArray.push(
        this.fb.group({
          value: false,
        })
      );
      (dynamicPriceFormArray.controls[idx] as FormGroup).valueChanges.subscribe(
        (res) => {
          res.value &&
            this.getDynamicPrice({
              ...res,
              index: idx,
              roomControls: [
                {
                  roomTypeFG: roomTypeFormGroup as FormGroup,
                },
              ],
            });
          this.disableRateControls(roomTypeFormGroup, idx, res);
          this.changeDynamicPriceStatus({ ...res, index: idx });
        }
      );
    });
  }

  disableRateControls(
    roomTypeFormGroup: FormGroup,
    idx: number,
    res: { value: boolean }
  ) {
    const disableControls = (
      control: AbstractControl,
      idx: number,
      res: { value: boolean }
    ) => {
      const rateControl = (control.get('rates') as FormArray).at(idx);
      if (res.value) {
        rateControl.disable({ emitEvent: false });
      } else {
        rateControl.enable({ emitEvent: false });
      }
    };

    (roomTypeFormGroup.get('ratePlans') as FormArray).controls.forEach(
      (ratePlanControl) => {
        disableControls(ratePlanControl, idx, res);
        (ratePlanControl.get('channels') as FormArray).controls.forEach(
          (channelControl) => {
            disableControls(channelControl, idx, res);
          }
        );
      }
    );

    // Dynamic price for each room
    (roomTypeFormGroup.get('dynamicPrice') as FormArray).controls[
      idx
    ].patchValue({ value: res.value }, { emitEvent: false });
  }

  changeDynamicPriceStatus(res) {
    const index = res.index;
    let isDynamicPriceAvailable = true;

    const roomTypes = this.useFormControl.roomTypes as FormArray;
    roomTypes.controls.forEach((roomType) => {
      const dynamicPrices = roomType.get('dynamicPrice') as FormArray;
      if (!dynamicPrices.at(index).value.value) {
        isDynamicPriceAvailable = false;
      }
    });

    const dynamicPricing = this.useFormControl.dynamicPricing as FormArray;
    const dateGroup = dynamicPricing.at(index) as FormGroup;
    dateGroup.patchValue(
      { value: isDynamicPriceAvailable },
      { emitEvent: false }
    );
  }

  /**
   * Add Rates plan control to room type control
   * @param ratePlans rate plans array
   * @param roomTypeIdx selected room type index
   */
  addRatePlansControls(ratePlans: RoomTypes['ratePlans'], roomTypeIdx: number) {
    const roomTypeFG = this.useFormControl.roomTypes.at(
      roomTypeIdx
    ) as FormGroup;

    const isBaseRoomType = roomTypeFG.get('isBaseRoomType').value;

    roomTypeFG.addControl('ratePlans', this.fb.array([]));

    const ratePlansControl = roomTypeFG.get('ratePlans') as FormArray;
    ratePlans.forEach((ratePlan, ratePlanIdx) => {
      ratePlansControl.push(
        this.fb.group({
          type: [ratePlan.type],
          basePrice: [ratePlan.basePrice],
          label: [ratePlan.label],
          value: [ratePlan.value],
          linked: [true],
          showChannels: [false],
          isBase: [ratePlan.isBase],
          variablePrice: [ratePlan.variablePrice],
          selectedRestriction: [
            this.restrictions && this.restrictions[0].value,
          ],
        })
      );

      this.addRatesAndRestrictionControl(
        ratePlansControl,
        ratePlanIdx,
        roomTypeIdx,
        isBaseRoomType
      );
      this.addChannelsControl(ratePlan.channels, roomTypeIdx, ratePlanIdx);
    });
  }

  /**
   * Handle Rates and Restrictions Control
   * @param control rate plans
   * @param idx index of roomType
   */
  addRatesAndRestrictionControl(
    control: FormArray,
    idx: number,
    roomTypeIdx: number,
    isBaseRoomType: boolean
  ) {
    const controlG = control.at(idx) as FormGroup;
    this.restrictions &&
      this.restrictions.forEach((item) => {
        controlG.addControl(item.value, this.getValuesArrayControl(item.type));
        const restrictionFA = control.at(idx).get(item.value) as FormArray;
        restrictionFA.controls.forEach((rateControl, dayIndex) => {
          rateControl.valueChanges.subscribe((res) => {
            const linkedValue = control.at(idx).get('linked').value;
            if (linkedValue) {
              restrictionFA.patchValue(this.getArray(res, restrictionFA), {
                emitEvent: false,
              });
            }

            const mapPrices = (isMapAllRoom: boolean) => {
              this.mapRoomPrices(
                control,
                dayIndex,
                roomTypeIdx,
                res,
                linkedValue,
                isMapAllRoom
              );
            };

            // RatePlan Pricing Control with Base RatePlan
            const isBaseRatePlanRow = controlG.get('isBase').value;
            if (isBaseRatePlanRow && isBaseRoomType) {
              // change entire price
              mapPrices(true);
            } else if (isBaseRatePlanRow) {
              mapPrices(false);
            }
          });
        });
      });
  }

  /**
   *
   * @param control rate plans control
   * @param dayIndex in which column user input (0,1,2,3,4)
   * @param roomTypeIdx room type index
   * @param res value changes
   * @param linkedValue link or unlink state of changes
   * @param isMapInAllRoom do you want map all room of perticular room
   * @param source from where its called
   */
  mapRoomPrices(
    control: FormArray,
    dayIndex: number,
    roomTypeIdx: number,
    res: { value: string },
    linkedValue: boolean,
    isMapInAllRoom: boolean,
    source: 'basePrice' | 'noneBasePrice' = 'noneBasePrice'
  ) {
    let basePrice = 0;
    control.controls?.forEach((ratePlanControl) => {
      const isBase = ratePlanControl.get('isBase').value;
      const dynamicControl = this.useFormControl.roomTypes.controls[
        roomTypeIdx
      ].get('dynamicPrice') as FormArray;

      if (
        (!isBase || source == 'basePrice') &&
        !dynamicControl.at(dayIndex).get('value').value
      ) {
        const variablePrice = ratePlanControl.get('variablePrice').value;
        const currentPrice = +res.value + variablePrice;
        let price = res?.value?.length ? currentPrice : null;

        // if mapping data came from the baseRoomType then all price will be calculated as per the baseRatePlan, except to baseRoom
        if (source === 'basePrice') {
          if (isBase) basePrice = +res.value + variablePrice;
          const baseRatePlanPrice = +res.value + variablePrice;
          const nonBaseRatePlanPrice = basePrice + variablePrice;
          const newPrice = isBase ? baseRatePlanPrice : nonBaseRatePlanPrice;
          price = res?.value?.length ? newPrice : null;
        }

        const rates = ratePlanControl.get('rates') as FormArray;

        // mapping data in which dynamic pricing off
        const newPriceList = rates.controls.map((rate, rateIndex) => ({
          value: dynamicControl.at(rateIndex).get('value').value
            ? rate.get('value').value
            : price,
        })); 

        if (linkedValue) {
          rates.patchValue(newPriceList, {
            emitEvent: false,
          });
          isMapInAllRoom &&
            this.mapAllRoomPrice({
              isLinked: true,
              dayWise: dayIndex,
              res: res,
            });
        } else {
          rates.at(dayIndex).patchValue({ value: price }, { emitEvent: false });
          isMapInAllRoom &&
            this.mapAllRoomPrice({
              isLinked: false,
              dayWise: dayIndex,
              res: res,
            });
        }
      }
    });
  }

  /**
   *
   * @param mappingInfo for mapping all rooms if room is base room
   */
  mapAllRoomPrice(mappingInfo: {
    isLinked: boolean;
    dayWise: number;
    res: { value: string };
  }) {
    this.useFormControl.roomTypes.controls.forEach(
      (roomType: FormGroup, index: number) => {
        const {
          isBaseRoomType,
          basePrice,
          masterBasePrice,
        } = roomType.controls;
        basePrice.patchValue(
          mappingInfo.res.value.length
            ? +mappingInfo.res.value
            : +masterBasePrice.value,
          { emitEvent: false }
        );
        if (!isBaseRoomType.value) {
          const { ratePlans } = roomType.controls;

          this.mapRoomPrices(
            ratePlans as FormArray,
            mappingInfo.dayWise,
            index,
            {
              value: mappingInfo.res.value.length
                ? basePrice.value.toString()
                : '',
            },
            mappingInfo.isLinked,
            false,
            'basePrice'
          );
        }
      }
    );
  }

  /**
   * Add channels to the rate plans and subscribe changes
   * @param channels channels array
   * @param roomTypeIdx selected room type index
   * @param ratePlanIdx selected rate plan index
   */
  addChannelsControl(
    channels: RoomTypes['ratePlans'][0]['channels'],
    roomTypeIdx: number,
    ratePlanIdx: number
  ) {
    const roomType = this.useFormControl.roomTypes.at(roomTypeIdx) as FormGroup;
    const ratePlanFG = (roomType.get('ratePlans') as FormArray).at(
      ratePlanIdx
    ) as FormGroup;
    const isBaseRoomType = roomType.get('isBaseRoomType').value;
    ratePlanFG.addControl('channels', this.fb.array([]));
    const channelControl = ratePlanFG.get('channels') as FormArray;
    channels.forEach((channel, channelIdx) => {
      channelControl.push(
        this.fb.group({
          label: channel.label,
          value: channel.value,
          linked: [true],
          selectedRestriction: [
            this.restrictions && this.restrictions[0].value,
          ],
        })
      );

      this.addRatesAndRestrictionControl(
        channelControl,
        channelIdx,
        roomTypeIdx,
        isBaseRoomType
      );
    });
  }

  /**
   * Return value controls form array
   * @returns FormArray
   */
  getValuesArrayControl(type: RestrictionAndValuesOption['type'] = 'number') {
    return this.fb.array(
      this.dates.map((item) =>
        this.fb.group({
          value: type === 'number' ? [null, [Validators.min(0)]] : [false],
        })
      )
    );
  }

  get useFormControl() {
    return this.useForm.controls as Record<
      'roomType' | 'date',
      AbstractControl
    > & {
      roomTypes: FormArray;
      dynamicPricing: FormArray;
    };
  }

  initDate(startDate: number, limit = 14) {
    const dates = [];
    const currentDate = new Date(startDate);

    for (let i = 0; i < limit; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      const day = nextDate.getDay();
      const data: DateOption = {
        day: daysOfWeek[day]?.substring(0, 3),
        date: nextDate.getDate(),
      };
      dates.push(data);
    }

    this.dates = dates;
  }

  listenChanges() {
    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });

    this.useForm.controls['date'].valueChanges
      .pipe(
        tap((value) => {
          this.isLoaderVisible = true;
        }),
        debounceTime(300)
      )
      .subscribe((selectedDate) => {
        this.useForm.controls['date'].patchValue(selectedDate, {
          emitEvent: false,
        });
        this.getRates(selectedDate);
      });

    // Select Room Types Changes
    this.useFormControl.roomType.valueChanges
      .pipe(
        tap((value) => {
          this.isLoaderVisible = true;
        }),
        debounceTime(600)
      )
      .subscribe((res: string[]) => {
        this.valueChangesSubject.next(res);
      });

    this.valueChangesSubject.subscribe((res: string[]) => {
      this.roomTypes = this.allRoomTypes.filter((item) =>
        res.includes(item.value)
      );
      this.isRoomsEmpty = !res.length;
      this.useForm.removeControl('roomTypes');
      this.addRoomTypesControl();
      this.setRoomDetails();
      this.isLoaderVisible = false;
    });

    if (this.hasDynamicPricing) {
      this.useFormControl.dynamicPricing.controls.forEach((control, idx) => {
        control.valueChanges.subscribe((res) => {
          this.useFormControl.roomTypes.controls.forEach(
            (roomTypeControl: FormGroup) => {
              this.disableRateControls(roomTypeControl, idx, res);
            }
          );
          if (res.value) {
            this.getDynamicPrice({
              ...res,
              index: idx,
              roomControls: [
                ...this.useFormControl.roomTypes.controls.map(
                  (roomTypeControls: FormArray) => ({
                    roomTypeFG: roomTypeControls,
                  })
                ),
              ],
              rootDynamicPrice: control,
            });
          }
        });
      });
    }
  }

  getRates(selectedDate = this.useForm.value.date) {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getChannelManagerDetails<UpdateRatesResponse>(
          this.entityId,
          this.getQueryConfig(selectedDate)
        )
        .subscribe(
          (res) => {
            const data = new UpdateRates().deserialize(res.roomTypes);
            this.ratesRoomDetails = data.ratesRoomDetails;
            this.setRoomDetails(selectedDate);
            this.loading = false;
            this.loadingError = false;
            this.isLoaderVisible = false;
          },
          (error) => {
            this.loading = false;
            this.loadingError = true;
            this.isLoaderVisible = false;
          },
          this.handleFinal
        )
    );
  }

  handleSave() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
    }
    this.loading = true;

    const { fromDate } = this.getFromAndToDateEpoch(
      this.useForm.controls['date'].value
    );

    const data = UpdateRates.buildRequestData(
      this.useForm.getRawValue(),
      fromDate,
      'submit-form'
    );
    this.$subscription.add(
      this.channelManagerService
        .updateChannelManager(data, this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            this.getRates();
            this.snackbarService.openSnackBarAsText(
              'Rates Update successfully',
              '',
              { panelClass: 'success' }
            );
            this.loading = false;
            this.loadingError = false;
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  setRoomDetails(selectedDate?: number) {
    const roomTypeControls = this.useFormControl.roomTypes.controls;
    const { fromDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    let currentDate = new Date(fromDate);

    if (roomTypeControls.length > 0) {
      // Rate Plans Mapping
      currentDate = new Date(fromDate);
      for (let roomControl of roomTypeControls) {
        const roomId = roomControl.value.value;
        ((roomControl as FormGroup).controls[
          'ratePlans'
        ] as FormArray).controls.forEach((ratePlan: FormGroup, index) => {
          const { rates, value } = ratePlan.controls;
          (rates as FormArray).controls.forEach(
            (ratePlanControl: FormGroup) => {
              const valueControl = ratePlanControl.controls[
                'value'
              ] as FormControl;

              const responseRatePlan = this.ratesRoomDetails[roomId]?.ratePlans[
                value.value
              ]
                ? this.ratesRoomDetails[roomId]['ratePlans'][value.value][
                    currentDate.getTime()
                  ]
                : null;
              valueControl.patchValue(
                responseRatePlan ? responseRatePlan.available : null,
                { emitEvent: false }
              );
              currentDate.setDate(currentDate.getDate() + 1);
            }
          );
          currentDate = new Date(fromDate);
        });

        if (this.hasDynamicPricing) {
          //roomType dynamic price mapping
          (roomControl.get('dynamicPrice') as FormArray).controls.forEach(
            (dynamicPriceControl, index) => {
              let currentRoomDate = new Date(fromDate);
              currentRoomDate.setDate(currentRoomDate.getDate() + index);
              const dynamicPriceStatus =
                this.ratesRoomDetails[roomId]?.availability[
                  currentRoomDate.getTime()
                ]?.dynamicPrice ?? false;

              this.disableRateControls(roomControl as FormGroup, index, {
                value: dynamicPriceStatus,
              });
            }
          );
        }
      }

      if (this.hasDynamicPricing) {
        // Root Dynamic Pricing mapping
        const verticalData = UpdateRates.buildRequestData(
          this.useForm.getRawValue(),
          this.useForm.get('date').value,
          'dynamic-pricing'
        );

        verticalData.inventoryList.forEach((item, idx) => {
          this.useFormControl.dynamicPricing
            .at(idx)
            .patchValue(
              { value: item.rates.every((elm) => elm.dynamicPricing) },
              { emitEvent: false }
            );
        });
      }
    }
  }

  getDynamicPrice(dynamicPrice: {
    value: boolean;
    roomControls: { roomTypeFG: FormGroup }[];
    index: number;
    rootDynamicPrice?: AbstractControl;
  }) {
    this.loading = true;
    let roomTypeIds = dynamicPrice.roomControls
      .map((item) => item.roomTypeFG.get('value').value)
      .join(',');
    let currentDate = new Date(this.useFormControl.date.value);
    currentDate.setDate(currentDate.getDate() + dynamicPrice.index);
    this.$subscription.add(
      this.channelManagerService
        .getDynamicPricing(
          this.entityId,
          this.getQueryConfig(
            currentDate.getTime(),
            'DYNAMIC_PRICING',
            roomTypeIds
          )
        )
        .subscribe(
          (res) => {
            const data = UpdateRates.buildDynamicPricing(res.roomType);
            dynamicPrice.roomControls.forEach((roomType) => {
              (roomType.roomTypeFG.get(
                'ratePlans'
              ) as FormArray).controls.forEach((item: FormGroup) => {
                const ratePlan = (item.get('rates') as FormArray).controls[
                  dynamicPrice.index
                ];
                ratePlan.patchValue(
                  {
                    value:
                      data[roomType.roomTypeFG.get('value').value][
                        item.get('value').value
                      ],
                  },
                  { emitEvent: false }
                );
              });
            });
            this.loading = false;
          },
          (error) => {
            this.loading = false;
            // TODO: reset state on error
            dynamicPrice.roomControls.forEach((roomType) => {
              this.disableRateControls(
                roomType.roomTypeFG,
                dynamicPrice.index,
                { value: false }
              );
            });
            if (dynamicPrice?.rootDynamicPrice) {
              dynamicPrice.rootDynamicPrice.patchValue(
                { value: false },
                {
                  emitEvent: false,
                }
              );
            }
          },
          this.handleFinal
        )
    );
  }

  initDynamicPriceSubscription() {
    this.hasDynamicPricing = this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.DYNAMIC_PRICING
    );
  }

  handleFinal() {
    this.loading = false;
    this.loadingError = false;
  }

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }

  getQueryConfig(
    selectedDate?: number,
    inventoryType = 'RATES',
    roomTypeId?: string
  ): QueryConfig {
    const { fromDate, toDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          limit: 5,
          inventoryUpdateType: inventoryType,
          roomTypeIds: roomTypeId,
        },
        selectedDate && {
          fromDate: fromDate,
          toDate: roomTypeId ? fromDate : toDate,
        },
      ]),
    };
    return config;
  }

  getFromAndToDateEpoch(currentTime) {
    const fromDate = currentTime;
    const toDate = new Date(currentTime);
    toDate.setDate(toDate.getDate() + this.dates.length - 1);
    return {
      fromDate: moment(fromDate).unix() * 1000,
      toDate: moment(toDate).unix() * 1000,
    };
  }

  getAvailability(
    nextDate: number,
    type: 'quantity' | 'occupancy',
    roomTypeId: string
  ) {
    if (
      Object.keys(this.ratesRoomDetails).length === 0 ||
      !this.ratesRoomDetails[roomTypeId]?.availability
    )
      return 0;

    const date = new Date(this.useForm.controls['date'].value);
    date.setDate(date.getDate() + nextDate);
    let room = this.ratesRoomDetails[roomTypeId]['availability'][
      date.getTime()
    ];
    if (room) return room[type] === 'NaN' || !room[type] ? 0 : room[type];
    return 0;
  }
}
