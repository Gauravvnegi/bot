import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { daysOfWeek, Option } from '@hospitality-bot/admin/shared';
import { ratesRestriction, roomTypeData } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];

  dates: DateOption[];
  dateLimit: number = 15;

  restriction = [
    {
      label: 'Rates',
      value: 'rates',
    },
    ...ratesRestriction
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initOptions();

    //form will only be after dates and

    this.initForm();
  }

  initOptions() {
    this.initDate(Date.now());
    this.initRoomTypes();
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

    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });

    // this.useForm.valueChanges.subscribe((res) => {
    //   console.log(res);
    // });
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
      this.addRatesPlanControls(roomType.ratePlans, roomTypeIdx);
    });
  }

  /**
   * Add Rates plan control to room type control
   * @param ratePlans rate plans array
   * @param roomTypeIdx selected room type index
   */
  addRatesPlanControls(ratePlans: RoomTypes['ratePlans'], roomTypeIdx: number) {
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
          rates: this.getValuesArrayControl(),
          linked: [false],
          showChannels: [true],
        })
      );

      const ratesFA = ratePlansControl
        .at(ratePlanIdx)
        .get('rates') as FormArray;

      ratesFA.controls.forEach((rateControl) => {
        rateControl.valueChanges.subscribe((res) => {
          const linkedValue = ratePlansControl.at(ratePlanIdx).get('linked')
            .value;

          if (linkedValue) {
            ratesFA.patchValue(this.getArray(res), { emitEvent: false });
          }
        });
      });

      this.addChannelsControl(ratePlan.channels, roomTypeIdx, ratePlanIdx);
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
          rates: this.getValuesArrayControl(),
        })
      );

      const ratesFA = channelControl.at(channelIdx).get('rates') as FormArray;

      ratesFA.controls.forEach((rateControl) => {
        rateControl.valueChanges.subscribe((res) => {
          const linkedValue = channelControl.at(channelIdx).get('linked')
            .value;

          if (linkedValue) {
            ratesFA.patchValue(this.getArray(res), { emitEvent: false });
          }
        });
      });
    });
  }

  /**
   * Return value controls form array
   * @returns FormArray
   */
  getValuesArrayControl() {
    return this.fb.array(
      this.dates.map((item) => this.fb.group({ value: [''] }))
    );
  }

  get useFormControl() {
    return this.useForm.controls as Record<
      'roomType' | 'date',
      AbstractControl
    > & {
      roomTypes: FormArray;
    };
  }

  initRatesControl() {
    const da = {
      roomType: [
        {
          rates: [200, 100, 200],
          ratePlan: [
            [200, 100, 200],
            [100, 123, 200],
          ],
        },
      ],
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

  handleLink(roomTypeIdx: number, ratePlanIdx: number) {
    debugger;
  }
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
