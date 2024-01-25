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
} from 'libs/admin/channel-manager/src/lib/constants/data';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import {
  DateOption,
  PriceInfo,
  RoomMapType,
} from 'libs/admin/channel-manager/src/lib/types/channel-manager.types';
import {
  RoomTypes,
  getWeekendBG,
} from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';

import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ChannelManagerService } from '../../services/channel-manager.service';
import * as moment from 'moment';
import { Subject, Subscription } from 'rxjs';
import { UpdateRates } from 'libs/admin/channel-manager/src/lib/models/channel-manager.model';
import { debounceTime, tap } from 'rxjs/operators';
import { UpdateRatesResponse } from 'libs/admin/channel-manager/src/lib/types/response.type';
import { PAX, RATE_CONFIG_TYPE } from '../../constants/rates.const';

@Component({
  selector: 'hospitality-bot-update-rates',
  templateUrl: './update-rates.component.html',
  styleUrls: ['./update-rates.component.scss'],
})
export class UpdateRatesComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;
  readonly rateConfigTypes = RATE_CONFIG_TYPE;

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
  ratesRoomDetails: Record<string, RoomMapType> = {};

  configType: RATE_CONFIG_TYPE;

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

  /**
   * Generate an array of values based on the specified parameters.
   *
   * @param {number | undefined} value - The default value to be used in the generated array.
   * @param {FormArray | undefined} restrictionFA - A FormArray containing FormGroup controls
   *  with a 'value' control representing restrictions.
   * @returns {number[]} An array of values generated based on the specified parameters.
   */
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

  /**
   * @function initRoomTypes
   * Initialize room types by subscribing to changes in the 'roomDetails' observable from the channelMangerForm.
   * If room details are already loaded, it sorts rate plans within each room type, sets roomTypes and allRoomTypes arrays,
   * and initializes configuration types. If room details are not loaded, it triggers the loading process.
   */
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
        this.initConfigType();
      } else {
        this.channelMangerForm.loadRoomTypes(this.entityId);
      }
    });
  }

  /**
   * @function initConfigType will set the view RATE_PLAN_BASED or PAX_BASED
   * Initialize configuration type by fetching data from the Channel Manager service.
   * Sets the loading flag to true before making the request and updates it upon success or error.
   */
  initConfigType() {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getConfigType({ 'entity-id': this.entityId })
        .subscribe(
          (res) => {
            this.configType = res.type;
            this.loading = false;
            this.initForm();
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  /**
   * @function initForm will build the form
   * and create the control
   */
  initForm() {
    this.currentDate.setHours(0, 0, 0, 0);
    this.useForm = this.fb.group({
      roomType: [],
      date: [this.currentDate.getTime()],
    });
    this.addRoomsControl();
  }

  /**
   * @function addRoomsControl the all controls of room
   * @function listenChanges will subscribe the all listener
   * @function getRates getting rate plans
   */
  addRoomsControl() {
    this.addRoomTypesControl();
    if (this.hasDynamicPricing) this.addRootDynamicControl();
    this.listenChanges();
    this.getRates();
  }

  /**
   * @function addRootDynamicControl
   * Add parent dynamic control
   */
  addRootDynamicControl() {
    this.useForm.addControl(
      'dynamicPricing',
      this.getValuesArrayControl('boolean')
    );
  }

  /**
   * @function addRoomTypesControl
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
          maxOccupancy: roomType.maxOccupancy,
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

  /**
   * Disable or enable rate controls based on a condition.
   *
   * @param roomTypeFormGroup - The FormGroup representing the room type.
   * @param idx - The index of the room type.
   * @param res - An object with a boolean value used to determine whether to disable or enable controls.
   *
   * @remarks
   * This function iterates through rate plans, channels, and pax controls within a room type FormGroup,
   * disabling or enabling specific controls based on the provided condition.
   * It also updates the dynamic price for each room based on the provided condition.
   *
   * @function disableRateControls take (roomTypeFormGroup, 0, { value: true });
   */
  disableRateControls(
    roomTypeFormGroup: FormGroup,
    idx: number,
    res: { value: boolean }
  ) {
    const disableControls = (
      control: AbstractControl,
      idx: number,
      controlName: 'rates' | 'paxData',
      res: { value: boolean }
    ) => {
      const formControl = (control.get(controlName) as FormArray)?.at(idx);
      if (res.value) {
        formControl?.disable({ emitEvent: false });
      } else {
        formControl?.enable({ emitEvent: false });
      }
    };

    (roomTypeFormGroup.get('ratePlans') as FormArray)?.controls?.forEach(
      (ratePlanControl) => {
        disableControls(ratePlanControl, idx, 'rates', res);
        (ratePlanControl.get('channels') as FormArray)?.controls?.forEach(
          (channelControl) => {
            disableControls(channelControl, idx, 'rates', res);
          }
        );

        if (this.configType === this.rateConfigTypes.pax) {
          (ratePlanControl.get('pax') as FormArray)?.controls?.forEach(
            (paxControl: FormGroup) => {
              disableControls(paxControl, idx, 'paxData', res);
            }
          );
        }
      }
    );

    // Dynamic price for each room
    (roomTypeFormGroup.get('dynamicPrice') as FormArray).controls[
      idx
    ].patchValue({ value: res.value }, { emitEvent: false });
  }

  /**
   * @function changeDynamicPriceStatus
   * Change the dynamic price status based on the availability of dynamic prices at a specific index.
   * @param res - An object containing information about the dynamic price and its index.
   * @remarks
   * This function checks the availability of dynamic prices for a specific index across all room types.
   * If dynamic prices are available for all room types at the given index, it updates the dynamic pricing
   * status at that index to true; otherwise, it sets the status to false.
   */
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
          subLabel: [PAX[0]],
          paxVisible: [false],
          value: [ratePlan.value],
          linked: [true],
          showChannels: [false],
          isBase: [ratePlan.isBase],
          variablePrice: [ratePlan.variablePrice],
          selectedRestriction: [
            this.restrictions && this.restrictions[0].value,
          ],
          maxOccupancy: ratePlan.maxOccupancy,
        })
      );

      // console.log(ratePlanIdx, 'Rate Plan===>>', ratePlan);
      /**
       * @function addPaxControl will add only if configuration
       * would be PAX_BASED
       */
      if (this.configType == this.rateConfigTypes.pax) {
        this.addPaxControl(
          ratePlan,
          ratePlansControl,
          ratePlanIdx,
          roomTypeIdx
        );
      }

      this.addRatesAndRestrictionControl(
        ratePlansControl,
        ratePlanIdx,
        roomTypeIdx,
        isBaseRoomType
      );

      /**
       * @deprecated addChannelsControl
       * not using yet
       */
      // this.addChannelsControl(ratePlan.channels, roomTypeIdx, ratePlanIdx);
    });
  }

  /**
   * Adds pax controls to a rate plan within a room type.
   *
   * @param ratePlan - The rate plan to which pax controls will be added.
   * @param control - The FormArray containing rate plans within the room type.
   * @param ratePlanIdx - The index of the rate plan within the FormArray.
   * @param roomTypeIdx - The index of the room type.
   *
   * @remarks
   * This function adds pax controls to a specified rate plan within a room type. It calculates the
   * pax price based on the rate plan's pricing details and the number of occupants. It also adds
   * controls for each date within the rate plan's pricing period.
   */
  addPaxControl(
    ratePlan: RoomTypes['ratePlans'][number],
    control: FormArray,
    ratePlanIdx: number,
    roomTypeIdx: number
  ) {
    const ratePlanFG = control.at(ratePlanIdx) as FormGroup;
    const masterPaxPrice = {
      0: ratePlan.pricingDetails.paxDoubleOccupancy,
      1: ratePlan.pricingDetails.paxTripleOccupancy,
    };
    /**
     * it will add maxOccupancy-1 pax control, because on base rate plan
     * control is already added,
     * NOTE: Consider mapping 1 based indexing,
     * Formula is derived (PaxN = (BP+Triple) + [(n-3)*adult]) for all n>=4
     */
    ratePlanFG.addControl(
      'pax',
      this.fb.array(
        Array.from({ length: ratePlan.maxOccupancy - 1 }, (_, ind) => {
          const paxPrice = masterPaxPrice[ind]
            ? masterPaxPrice[ind]
            : masterPaxPrice[1] +
              (ind + 2 - 3) * ratePlan.pricingDetails.paxAdult;

          const paxFG = this.fb.group({
            basePrice: [ratePlan.basePrice],
            label: [ratePlan.label],
            subLabel: [PAX[ind + 1]],
            linked: [true],
            paxPrice: [paxPrice],
            selectedRestriction: [
              this.restrictions && this.restrictions[0].value,
            ],
            maxOccupancy: ratePlan.maxOccupancy,
          });
          return paxFG;
        })
      )
    );

    const paxFA = ratePlanFG.get('pax') as FormArray;
    paxFA.controls.forEach((paxFG: FormGroup, paxIdx: number) => {
      paxFG.addControl(
        'paxData',
        this.fb.array(
          Array.from({ length: this.dates.length }, (_, ind) =>
            this.fb.group({
              label: [],
              value: [],
            })
          )
        )
      );

      const currentPaxControls = paxFG.get('paxData') as FormArray;
      this.listenPaxChanges(currentPaxControls, paxFG, roomTypeIdx);
    });
  }

  /**
   *
   * @param currentPaxControls all control for listening
   * @param paxFG for checking linking state
   */
  listenPaxChanges(
    currentPaxControls: FormArray,
    paxFG: FormGroup,
    roomTypeIdx: number
  ) {
    currentPaxControls.controls.forEach(
      (paxControl: AbstractControl, paxIdx: number) => {
        paxControl.valueChanges.subscribe(
          (res: { label: string; value: string }) => {
            const isLinked = paxFG.get('linked').value;
            if (isLinked) {
              currentPaxControls?.controls.forEach(
                (control: AbstractControl, dayIdx: number) => {
                  const dpArray = this.getDynamicPriceFA(roomTypeIdx);
                  const isDisable = dpArray.at(dayIdx).get('value').value;
                  const samePrice = control.get('value').value;
                  control.patchValue(
                    {
                      value: isDisable
                        ? samePrice
                        : res?.value?.length
                        ? res.value
                        : null,
                    },
                    { emitEvent: false }
                  );
                }
              );
            }
          }
        );
      }
    );
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

            /**
             * Map pax configuration when the rate plan is not a baseRatePlan row.
             * ( PAX MAPPING CASE 1)
             * @param controlG - The FormGroup representing the current control.
             * @param dayIndex - The index representing the day.
             * @param linkedValue - A boolean indicating whether the rate plan is linked.
             * @param isBaseRatePlanRow - A boolean indicating whether the rate plan is a baseRatePlan row.
             * @param isBaseRoomType - A boolean indicating whether the room type is a base room type.
             * @param res - The resource object used for mapping.
             */
            if (this.configType == this.rateConfigTypes.pax) {
              const dpArray = this.getDynamicPriceFA(roomTypeIdx);

              /**
               * @Case 1  Non BaseRatePlan Row ( Change All [RP+PAX] )
               */
              if (!isBaseRatePlanRow) {
                // console.log('Non BaseRatePlan Row====>>', !isBaseRatePlanRow);
                this.mapPaxPrice(controlG, dpArray, {
                  dayWise: dayIndex,
                  isLinked: linkedValue,
                  res: res,
                });
              }

              /**
               * @Case 2 Non Base Room Type && BaseRatePlan Row ( Change All PAX )
               */
              if (!isBaseRoomType && isBaseRatePlanRow) {
                // console.log(
                //   'Non Base Room Type && BaseRatePlan Row====>>',
                //   !isBaseRatePlanRow
                // );

                const ratePlans = control as FormArray;
                ratePlans.controls.forEach((ratePlan: FormGroup) => {
                  this.mapPaxPrice(ratePlan, dpArray, {
                    dayWise: dayIndex,
                    isLinked: linkedValue,
                    res: res,
                  });
                });
              }
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
        } else {
          rates.at(dayIndex).patchValue({ value: price }, { emitEvent: false });
        }

        if (isMapInAllRoom) {
          this.mapAllRoomPrice({
            isLinked: linkedValue,
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
  mapAllRoomPrice(mappingInfo: RoomMapProps) {
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

        /**
         * @Case 3 ALL Data
         * ( PAX MAPPING CASE 3)
         * Mapping all pax ( Entire Screen ) if configuration is
         * pax based ( PAX MAP CASE 3)
         */
        if (this.configType == this.rateConfigTypes.pax) {
          const { ratePlans, dynamicPrice } = roomType.controls;
          const ratePlansArray = ratePlans as FormArray;
          const dpArray = dynamicPrice as FormArray;
          // console.log('@Case3 ALL Data Mapping', ratePlans);
          ratePlansArray.controls.forEach((ratePlan: FormGroup) => {
            this.mapPaxPrice(ratePlan, dpArray, mappingInfo, true);
          });
        }
      }
    );
  }

  /**
   * Map pax price based on mapping information.
   *
   * @param {AbstractControl} ratePlan - The rate plan abstract control.
   * @param {RoomMapProps} mappingInfo - Information for mapping pax price.
   * @param isBaseRoom is indicate, either mapping input is base room or non base room.
   */
  mapPaxPrice(
    ratePlan: AbstractControl,
    dpArray: FormArray,
    mappingInfo: RoomMapProps,
    isBaseRoom = false
  ) {
    const setFormArrayValueAtIndex = (
      formArray: FormArray,
      index: number,
      value: any
    ) => {
      formArray.at(index).patchValue({ value }, { emitEvent: false });
    };

    const mapValue = mappingInfo?.res?.value;
    const paxArray = ratePlan.get('pax') as FormArray;
    const rates = ratePlan.get('rates') as FormArray;
    const isBaseRP = ratePlan.get('isBase').value;
    const variablePriceRP = ratePlan.get('variablePrice').value;

    paxArray.controls.forEach((paxControl: FormGroup, paxInd: number) => {
      const { paxPrice, paxData } = paxControl.controls;
      const paxDataArray = paxData as FormArray;
      let baseRatePrice = +rates.at(mappingInfo.dayWise).value?.value;
      let price = mapValue?.length ? baseRatePrice + +paxPrice.value : '';

      /**
       * @Remarks Adding the extra price to
       * other person currPrice= ( Price + (variable_price_of_ratePlan * no_of_person))
       */
      if (isBaseRoom && !isBaseRP && typeof price === 'number') {
        price += +variablePriceRP * (paxInd + 1);
        // console.log('Base room type mapping', variablePriceRP, ratePlan);
      }
      // Check linked, then modify all data
      if (mappingInfo.isLinked) {
        // Iterate over paxData controls and set the value
        paxDataArray.controls.forEach(
          (paxInfo: FormGroup, paxInfoInd: number) => {
            const isDisabled = dpArray.at(paxInfoInd).get('value').value;
            const samePrice = paxInfo.get('value').value;
            setFormArrayValueAtIndex(
              paxDataArray,
              paxInfoInd,
              isDisabled ? samePrice : price
            );
          }
        );
      } else {
        setFormArrayValueAtIndex(paxDataArray, mappingInfo.dayWise, price);
      }
    });
  }

  /**
   * @deprecated addChannelsControl
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
   *
   * @param roomIdx
   * @returns form array list of dynamic pricing
   */
  getDynamicPriceFA(roomIdx: number): FormArray {
    return this.useFormControl.roomTypes.controls[roomIdx].get(
      'dynamicPrice'
    ) as FormArray;
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

  /**
   * Get a type-safe representation of the form controls in the `useForm` FormGroup.
   * The returned object includes controls for 'roomType' and 'date', as well as additional controls for 'roomTypes' and 'dynamicPricing' stored in FormArrays.
   *
   * @returns {Record<'roomType' | 'date', AbstractControl> & { roomTypes: FormArray; dynamicPricing: FormArray }} A type-safe object containing form controls.
   */
  get useFormControl() {
    return this.useForm.controls as Record<
      'roomType' | 'date',
      AbstractControl
    > & {
      roomTypes: FormArray;
      dynamicPricing: FormArray;
    };
  }

  /**
   * Initialize date options for a given start date and limit.
   * @function initDate will initialize all day from starting date.
   * @param {number} startDate - The epoch timestamp of the start date.
   * @param {number} limit - The number of days to generate date options (default is 14 days).
   */
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

  /**
   * @function listenChanges
   * Listen to changes in the form controls and take corresponding actions.
   * - Updates the initialization of date changes.
   * - Fetches rates based on the selected date with debouncing.
   * - Monitors changes in selected room types and updates the roomTypes array accordingly.
   * - Handles dynamic pricing changes and disables rate controls as needed.
   */
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

  /**
   * Fetch rates and room details for a specified date (or default date) through the Channel Manager service.
   * @function getRates will give get the all rates corresponding selected day
   * @param {number} selectedDate - The selected date in epoch format (optional, defaults to the form's date value).
   */
  getRates(selectedDate: number = this.useForm.value.date) {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getChannelManagerDetails<UpdateRatesResponse>(
          this.entityId,
          this.getQueryConfig(selectedDate)
        )
        .subscribe(
          (res) => {
            const data = new UpdateRates().deserialize(
              res.roomTypes,
              this.configType
            );
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

  /**
   * Handle the process of saving form data and updating rates through the Channel Manager service.
   * If the form is invalid, mark all controls as touched and display an error message.
   * If the form is valid, construct the request data, update rates, and handle success or error responses.
   */
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
      'submit-form',
      this.configType
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

  /**
   * Set room details including rate plans and dynamic pricing for a specified date or the default date.
   *
   * @param {number | undefined} selectedDate - The selected date in epoch format (optional).
   */
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
        ] as FormArray)?.controls?.forEach((ratePlan: FormGroup, index) => {
          const { rates, value } = ratePlan.controls;
          const paxFA = ratePlan.controls['pax'] as FormArray;

          let ratePlanInfo: RoomMapType['ratePlans'][string] = this
            .ratesRoomDetails[roomId]?.ratePlans[value.value];

          /**
           * Day wise Mapping of all pax
           * NOTE: below iteration will run for PAX only
           */

          if (this.configType == this.rateConfigTypes.pax) {
            paxFA.controls.forEach(
              (paxControls: FormGroup, paxIndex: number) => {
                const currentDWPaxFA = paxControls.get('paxData') as FormArray;
                currentDWPaxFA.controls.forEach(
                  (paxDW: AbstractControl, idx: number) => {
                    const value =
                      ratePlanInfo?.[currentDate.getTime()]?.pax?.[
                        paxIndex + 2
                      ];
                    paxDW.get('value').patchValue(value, { emitEvent: false });
                    currentDate.setDate(currentDate.getDate() + 1);
                  }
                );
                currentDate = new Date(fromDate);
              }
            );
          }

          /**
           * Day wise mapping of ratePlan
           * NOTE: below iteration will run for PAX or RATE_PLAN_BASED both
           */
          currentDate = new Date(fromDate);
          (rates as FormArray)?.controls?.forEach(
            (ratePlanControl: FormGroup) => {
              const valueControl = ratePlanControl.controls[
                'value'
              ] as FormControl;

              valueControl.patchValue(
                ratePlanInfo?.[currentDate.getTime()]?.available,
                { emitEvent: false }
              );
              currentDate.setDate(currentDate.getDate() + 1);
            }
          );

          currentDate = new Date(fromDate);
        });

        if (this.hasDynamicPricing) {
          //roomType dynamic price mapping
          (roomControl.get('dynamicPrice') as FormArray)?.controls?.forEach(
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

  /**
   * Fetch dynamic pricing information for a specific date and room types.
   *
   * @param {{
   *   value: boolean;
   *   roomControls: { roomTypeFG: FormGroup }[];
   *   index: number;
   *   rootDynamicPrice?: AbstractControl;
   * }} dynamicPrice - An object containing information needed for fetching dynamic pricing.
   */
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
            const data = UpdateRates.buildDynamicPricing(
              res.roomType,
              this.configType
            );
            dynamicPrice.roomControls.forEach((roomType) => {
              (roomType.roomTypeFG.get(
                'ratePlans'
              ) as FormArray).controls.forEach((item: FormGroup) => {
                const ratePlan = (item.get('rates') as FormArray).controls[
                  dynamicPrice.index
                ];

                const priceInfo: PriceInfo =
                  data[roomType.roomTypeFG.get('value').value][
                    item.get('value').value
                  ];

                /**
                 * @Remarks When configuration will
                 * pax type, then we have to map every pax
                 */
                if (this.configType == this.rateConfigTypes.pax) {
                  const pax = item.get('pax') as FormArray;
                  pax.controls.forEach(
                    (paxControl: AbstractControl, paxNumber: number) => {
                      const dayWisePax = paxControl.get('paxData') as FormArray;
                      dayWisePax.controls[dynamicPrice.index].patchValue(
                        { value: priceInfo.pax[paxNumber + 2] },
                        { emitEvent: false }
                      );
                    }
                  );
                }

                /**
                 * @Remarks mapping current rate plan, price
                 * If pax is the configuration type, then first rateplan will be
                 * first pax, so we will consider the first price as a 1st pax or 1st rateplan
                 */
                ratePlan.patchValue(
                  {
                    value: priceInfo.price,
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

  /**
   * Get a query configuration object for making API requests.
   *
   * @param {number | undefined} selectedDate - The selected date in epoch format (optional).
   * @param {string} inventoryType - The type of inventory ('RATES' by default).
   * @param {string | undefined} roomTypeId - The ID of the room type (optional).
   * @returns {QueryConfig} The query configuration object for making API requests.
   */
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

  /**
   * Get epoch timestamps for the start and end dates based on the provided current time.
   *
   * @param {number} currentTime - The current time in epoch format.
   * @returns {{ fromDate: number, toDate: number }} An object containing epoch timestamps for the start and end dates.
   */
  getFromAndToDateEpoch(currentTime) {
    const fromDate = currentTime;
    const toDate = new Date(currentTime);
    toDate.setDate(toDate.getDate() + this.dates.length - 1);
    return {
      fromDate: moment(fromDate).unix() * 1000,
      toDate: moment(toDate).unix() * 1000,
    };
  }

  /**
   * Get availability information for a specific room type on a given date.
   *
   * @param {number} nextDate - The number of days from the current date.
   * @param {'quantity' | 'occupancy'} type - The type of availability information to retrieve ('quantity' or 'occupancy').
   * @param {string} roomTypeId - The ID of the room type for which availability is requested.
   * @returns {number} The availability value for the specified room type and date.
   */
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

  /**
   * @function emptyViewDescription
   * give the description of the empty view based on certain condition
   */
  get emptyViewDescription() {
    return this.configType
      ? this.allRoomTypes?.length
        ? 'Please select at least one rooms'
        : 'There is no room available'
      : 'Configuration does not exist !';
  }

  togglePax(ratePlan: FormGroup) {
    const { paxVisible } = ratePlan.controls;
    paxVisible.patchValue(!paxVisible.value);
  }

  getPaxCount(ratePlan: FormGroup): number {
    const pax = ratePlan.get('pax') as FormArray;
    return pax?.controls?.length;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

type RoomMapProps = {
  isLinked: boolean;
  dayWise: number;
  res: { value: string };
};

export interface UpdateRateFormObj {
  date: number;
  dynamicPricing: InputData<boolean>[];
  roomTypes: {
    value: string; // room Id
    ratePlans: RatePlanForm[];
  }[];
}

type InputData<iType extends string | boolean = string> = { value: iType };

export type RatePlanForm = {
  value: string; // rate plan id
  rates: InputData[]; // day wise rate plan
  pax: {
    paxData: InputData[]; // day wise rate plan
  }[];
};
