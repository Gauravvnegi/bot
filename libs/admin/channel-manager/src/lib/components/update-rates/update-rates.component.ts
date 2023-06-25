import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { daysOfWeek } from '@hospitality-bot/admin/shared';
import {
  ratesRestrictions,
  RestrictionAndValuesOption,
  restrictionsRecord,
  roomTypeData,
} from '../../constants/data';

@Component({
  selector: 'hospitality-bot-update-rates',
  templateUrl: './update-rates.component.html',
  styleUrls: ['./update-rates.component.scss'],
})
export class UpdateRatesComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];

  dates: DateOption[];
  dateLimit: number = 15;

  restrictions: RestrictionAndValuesOption[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initOptions();
    this.initForm();
  }

  initOptions() {
    this.initDate(Date.now());
    this.initRoomTypes();
    this.getRestrictions();
  }

  getRestrictions() {
    this.restrictions = ratesRestrictions.map((item) => {
      const { label, type } = this.restrictionsRecord[item];
      return { label, type, value: item };
    });
  }

  get roomTypesControl() {
    return this.useFormControl.roomTypes.controls;
  }

  getArray(value?: number) {
    if (value) {
      return Array.from({ length: this.dateLimit }).fill(value);
    }
    return Array.from({ length: this.dateLimit }, (_, index) => index);
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [],
      date: [Date.now()],
    });

    this.addRoomTypesControl();
    this.addDynamicControl();

    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  addDynamicControl() {
    this.useForm.addControl(
      'dynamicPricing',
      this.getValuesArrayControl('boolean')
    );

    this.useFormControl.dynamicPricing.controls.forEach((control, idx) => {
      control.valueChanges.subscribe((res) => {
        console.log(res);
        this.useFormControl.roomTypes.controls.forEach((roomTypeControl) => {
          (roomTypeControl.get('ratePlans') as FormArray).controls.forEach(
            (ratePlanControl) => {
              const rateControl = (ratePlanControl.get('rates') as FormArray)
                .at(idx)
                .get('value');

              if (res.val) rateControl.disable();
              else rateControl.enable();
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
          showChannels: [true],
          selectedRestriction: [this.restrictions[0].value],
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
    this.restrictions.forEach((item) => {
      controlG.addControl(item.value, this.getValuesArrayControl(item.type));

      const restrictionFA = control.at(idx).get(item.value) as FormArray;

      restrictionFA.controls.forEach((rateControl) => {
        rateControl.valueChanges.subscribe((res) => {
          const linkedValue = control.at(idx).get('linked').value;

          if (linkedValue) {
            restrictionFA.patchValue(this.getArray(res), { emitEvent: false });
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
          selectedRestriction: [this.restrictions[0].value],
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

  initRoomTypes() {
    this.roomTypes = roomTypeData;
  }

  initFormSubscription() {}

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

  handleLink(roomTypeIdx: number, ratePlanIdx: number) {}
}

export type UseForm = {
  roomType: string[];
  date: Date;
  roomTypes: any[];
};

export type RoomTypes = {
  label: string;
  value: string;
  ratePlans: {
    type: string;
    label: string;
    value: string;
    channels: {
      label: string;
      value: string;
    }[];
  }[];
};

export type DateOption = { day: string; date: number };
