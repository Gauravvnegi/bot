import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { daysOfWeek } from '@hospitality-bot/admin/shared';
import {
  inventoryRestrictions,
  RestrictionAndValuesOption,
  restrictionsRecord,
} from '../../constants/data';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { DateOption, RoomTypes } from '../../types/channel-manager.types';
import { getWeekendBG } from '../../models/bulk-update.models';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['../update-rates/update-rates.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];

  dates: DateOption[];
  dateLimit: number = 15;

  restrictions: RestrictionAndValuesOption[];

  constructor(
    private fb: FormBuilder,
    private channelMangerForm: ChannelManagerFormService
  ) {}

  ngOnInit(): void {
    this.initOptions();
    this.initForm();
  }

  initOptions() {
    this.initDate(Date.now());
    this.roomTypes = this.channelMangerForm.roomDetails;
    this.getRestrictions();
  }

  getRestrictions() {
    this.restrictions = inventoryRestrictions.map((item) => {
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
    this.useForm = this.fb.group({
      roomType: [],
      date: [Date.now()],
    });

    this.addRoomTypesControl();

    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res);
    });

    this.useFormControl.roomType.valueChanges.subscribe((res: string[]) => {
      if (res.length) {
        this.roomTypes = this.channelMangerForm.roomDetails.filter((item) =>
          res.includes(item.value)
        );
      } else this.roomTypes = this.channelMangerForm.roomDetails;

      this.useForm.removeControl('roomTypes');
      this.addRoomTypesControl();
    });
  }

  /**
   * Add Room Types Control
   */
  addRoomTypesControl() {
    this.useForm.addControl('roomTypes', this.fb.array([]));
    const ratePlansControl = this.useForm.get('roomTypes') as FormArray;
    this.roomTypes.forEach((roomType, roomTypeIdx) => {
      this.useFormControl.roomTypes.push(
        this.fb.group({
          label: [roomType.label],
          value: [roomType.value],
          linked: [false],
          showChannels: [false],
          selectedRestriction: [this.restrictions[0].value],
        })
      );

      this.addRatesAndRestrictionControl(ratePlansControl, roomTypeIdx);

      this.addChannelsControl(roomType.channels, roomTypeIdx);
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
    roomTypeIdx: number
  ) {
    const roomTypeFG = this.useFormControl.roomTypes.at(
      roomTypeIdx
    ) as FormGroup;

    roomTypeFG.addControl('channels', this.fb.array([]));

    const channelControl = roomTypeFG.get('channels') as FormArray;

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

  handleSave() {
    // this.snacu
  }

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }
}
