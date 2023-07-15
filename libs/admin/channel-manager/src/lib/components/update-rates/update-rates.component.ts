import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
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
import { UpdateRates } from '../../models/channel-manager.model';

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
    this.initOptions();
    this.initForm();
    this.listenChanges();
    this.initEditView();
  }

  initOptions() {
    this.initDate(Date.now());
    this.initRoomTypes();
    this.getRestrictions();
  }

  initRoomTypes() {
    this.channelMangerForm.loadRoomTypes(this.entityId);
    this.channelMangerForm.roomDetails.subscribe((rooms: RoomTypes[]) => {
      if (rooms.length !== 0) {
        this.roomTypes = rooms;
        this.allRoomTypes = rooms;
        this.initForm();
      }
    });
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

  initForm() {
    this.currentDate.setHours(0, 0, 0, 0);
    this.useForm = this.fb.group({
      roomType: [],
      date: [this.currentDate.getTime()],
    });
    this.addRoomTypesControl();
    this.addDynamicControl();

    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res);
    });

    this.useFormControl.roomType.valueChanges.subscribe((res: string[]) => {
      if (res.length) {
        this.roomTypes = this.allRoomTypes.filter((item) =>
          res.includes(item.value)
        );
      } else {
        this.initRoomTypes();
      }

      this.useForm.removeControl('roomTypes');
      this.addRoomTypesControl();
    });
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
    this.setRoomDetails();
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
        this.fb.group({ value: [type === 'number' ? null : false] })
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
    this.useForm.controls['date'].valueChanges.subscribe((selectedDate) => {
      this.useForm.controls['date'].patchValue(selectedDate, {
        emitEvent: false,
      });
      this.initEditView(selectedDate);
    });
  }

  initEditView(selectedDate = this.useForm.value.date) {
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
            this.useForm.controls['date'].patchValue(this.currentDate, {
              emitEvent: false,
            });
            this.setRoomDetails();
            this.loading = false;
            this.loadingError = true;
          },
          this.handleFinal
        )
    );
  }

  handleSave() {
    // this.snacu
  }

  setRoomDetails(selectedDate?: number) {
    const roomTypeControls = (this.useForm.controls['roomTypes'] as FormArray)
      .controls;
    const { fromDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    let currentDate = new Date(fromDate);

    if (this.ratesRoomDetails && roomTypeControls.length > 0) {
      // this.setDynamicPricing(fromDate);
      for (const roomControl of roomTypeControls) {
        const roomId = roomControl.value.value;
        // debugger;

        roomControl.value.ratePlans.forEach((ratePlan, index) => {
          const ratePlanId = ratePlan.value;
          const ratePlanControl = ((roomControl as FormGroup).controls[
            'ratePlans'
          ] as FormArray).controls;
          // debugger;
          // current plan, all control iteration
          ratePlanControl.forEach((currentPlanDayControl) => {
            const currentPlanDayValueControl = ((currentPlanDayControl as FormGroup)
              .controls['rates'] as FormArray).controls;

            // current plan each day input iteration
            currentPlanDayValueControl.forEach(
              (valueControl: FormGroup, index) => {
                const responseRatePlan = this.ratesRoomDetails[roomId][
                  'ratePlans'
                ][ratePlanId][currentDate.getTime()];

                // const d = currentDate.getTime();

                valueControl.controls['value'].patchValue(
                  responseRatePlan ? responseRatePlan.available : null
                );
                // debugger;
                currentDate.setDate(currentDate.getDate() + 1);
              }
            );
            currentDate = new Date(fromDate);
          });
        });
      }
      // debugger;
    }
  }

  getDynamicPriceSize() {
    return Object.keys(this.dynamicPricing).length;
  }

  getDynamicPrice(nextDay) {
    const currDay = new Date(this.useForm.controls['date'].value);
    currDay.setDate(currDay.getDate() + nextDay);
    return this.dynamicPricing[currDay.getTime()] ?? false;
  }

  handleFinal() {
    this.loading = false;
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
    if (!this.ratesRoomDetails) return 0;

    const date = new Date(this.useForm.controls['date'].value);
    date.setDate(date.getDate() + nextDate);
    let room = this.ratesRoomDetails[roomTypeId]['availability'][
      date.getTime()
    ];
    if (room) return room[type] === 'NaN' || !room[type] ? 0 : room[type];
    return 0;
  }
}
