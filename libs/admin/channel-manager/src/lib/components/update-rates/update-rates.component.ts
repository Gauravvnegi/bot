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
  QueryConfig,
  daysOfWeek,
} from '@hospitality-bot/admin/shared';
import {
  ratesRestrictions,
  RestrictionAndValuesOption,
  restrictionsRecord,
} from '../../constants/data';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import {
  DateOption,
  RoomMapType,
  RoomTypes,
} from '../../types/channel-manager.types';
import { getWeekendBG } from '../../models/bulk-update.models';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ChannelManagerService } from '../../services/channel-manager.service';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {
  UpdateInventory,
  UpdateRates,
} from '../../models/channel-manager.model';

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
  isRoomsEmpty = false;
  currentDate = new Date();

  $subscription = new Subscription();
  dynamicPricing = new Map<number, boolean>();
  ratesRoomDetails = new Map<string, RoomMapType>();

  constructor(
    private fb: FormBuilder,
    private channelMangerForm: ChannelManagerFormService,
    private globalFilter: GlobalFilterService,
    private snackbarService: SnackBarService,
    private channelManagerService: ChannelManagerService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
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

  getArray(value?: number) {
    if (value) {
      return Array.from({ length: this.dateLimit }).fill(value);
    }
    return Array.from({ length: this.dateLimit }, (_, index) => index);
  }

  initRoomTypes() {
    this.channelMangerForm.roomDetails.subscribe((rooms: RoomTypes[]) => {
      if (this.channelMangerForm.isRoomDetailsLoaded) {
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
    this.addDynamicControl();
    this.addRoomsControl();
  }

  addRoomsControl() {
    this.addRoomTypesControl();
    this.listenChanges();
  }

  addDynamicControl() {
    this.useForm.addControl(
      'dynamicPricing',
      this.getValuesArrayControl('boolean')
    );

    const disableRateControls = (
      control: AbstractControl,
      idx: number,
      res: { value: boolean }
    ) => {
      const rateControl = (control.get('rates') as FormArray).at(idx);
      if (res.value) rateControl.disable();
      else rateControl.enable();
    };

    this.useFormControl.dynamicPricing.controls.forEach((control, idx) => {
      control.valueChanges.subscribe((res) => {
        this.useFormControl.roomTypes.controls.forEach((roomTypeControl) => {
          (roomTypeControl.get('ratePlans') as FormArray).controls.forEach(
            (ratePlanControl) => {
              disableRateControls(ratePlanControl, idx, res);
              (ratePlanControl.get('channels') as FormArray).controls.forEach(
                (channelControl) => {
                  disableRateControls(channelControl, idx, res);
                }
              );
            }
          );
        });
      });
    });
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
        })
      );
      this.addRatePlansControls(roomType.ratePlans, roomTypeIdx);
    });
    this.getRates();
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

    roomTypeFG.addControl('ratePlans', this.fb.array([]));

    const ratePlansControl = roomTypeFG.get('ratePlans') as FormArray;
    ratePlans.forEach((ratePlan, ratePlanIdx) => {
      ratePlansControl.push(
        this.fb.group({
          type: [ratePlan.type],
          label: [ratePlan.label],
          value: [ratePlan.value],
          linked: [false],
          showChannels: [false],
          selectedRestriction: [
            this.restrictions && this.restrictions[0].value,
          ],
        })
      );

      this.addRatesAndRestrictionControl(ratePlansControl, ratePlanIdx);

      this.addChannelsControl(ratePlan.channels, roomTypeIdx, ratePlanIdx);
    });
  }

  /**
   * Handle Rates and Restrictions Control
   * @param control
   * @param idx
   */
  addRatesAndRestrictionControl(control: FormArray, idx: number) {
    const controlG = control.at(idx) as FormGroup;
    this.restrictions &&
      this.restrictions.forEach((item) => {
        controlG.addControl(item.value, this.getValuesArrayControl(item.type));

        const restrictionFA = control.at(idx).get(item.value) as FormArray;

        restrictionFA.controls.forEach((rateControl) => {
          rateControl.valueChanges.subscribe((res) => {
            const linkedValue = control.at(idx).get('linked').value;

            if (linkedValue) {
              restrictionFA.patchValue(this.getArray(res), {
                emitEvent: false,
              });
            }
          });
        });
      });
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
    const ratePlanFG = (this.useFormControl.roomTypes
      .at(roomTypeIdx)
      .get('ratePlans') as FormArray).at(ratePlanIdx) as FormGroup;

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

      this.addRatesAndRestrictionControl(channelControl, channelIdx);
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
        day: daysOfWeek[day].substring(0, 3),
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

    this.useForm.controls['date'].valueChanges.subscribe((selectedDate) => {
      this.useForm.controls['date'].patchValue(selectedDate, {
        emitEvent: false,
      });
      this.getRates(selectedDate);
    });

    this.useFormControl.roomType.valueChanges.subscribe((res: string[]) => {
      this.roomTypes = this.allRoomTypes.filter((item) =>
        res.includes(item.value)
      );
      this.isRoomsEmpty = !res.length;
      this.useForm.removeControl('roomTypes');
      this.addRoomTypesControl();
    });
  }

  getRates(selectedDate = this.useForm.value.date) {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getChannelManagerDetails(
          this.entityId,
          this.getQueryConfig(selectedDate)
        )
        .subscribe(
          (res) => {
            const data = new UpdateRates().deserialize(res.roomType);
            this.dynamicPricing = data.dynamicPricing;
            this.ratesRoomDetails = data.ratesRoomDetails;
            this.setRoomDetails(selectedDate);
            this.loading = false;
            this.loadingError = false;
          },
          (error) => {
            this.loadingError = true;
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
      fromDate
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
      for (const roomControl of roomTypeControls) {
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
                responseRatePlan ? responseRatePlan.available : null
              );
              currentDate.setDate(currentDate.getDate() + 1);
            }
          );
          currentDate = new Date(fromDate);
        });
      }

      currentDate = new Date(fromDate);
      this.useFormControl.dynamicPricing.controls.forEach(
        (dynamicPrice: FormGroup) => {
          dynamicPrice.controls.value.patchValue(
            this.dynamicPricing[currentDate.getTime()] ?? false
          );
          currentDate.setDate(currentDate.getDate() + 1);
        }
      );
    }
  }

  getDynamicPrice(nextDay) {
    const currDay = new Date(this.useForm.controls['date'].value);
    currDay.setDate(currDay.getDate() + nextDay);
    return this.dynamicPricing[currDay.getTime()] ?? false;
  }

  handleFinal() {
    this.loading = false;
    this.loadingError = false;
  }

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }

  getQueryConfig(selectedDate?: number): QueryConfig {
    const { fromDate, toDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'ROOM_TYPE',
          limit: 5,
          inventoryUpdateType: 'RATES',
        },
        selectedDate && { fromDate: fromDate, toDate: toDate },
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
