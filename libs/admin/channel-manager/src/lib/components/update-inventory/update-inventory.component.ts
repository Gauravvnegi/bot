import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { daysOfWeek, Option } from '@hospitality-bot/admin/shared';
import { roomTypeData } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  useForm: FormGroup;
  roomTypes: {
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
  }[] = [];

  dates: DateOption[];

  restriction = [
    {
      label: 'rates',
      value: 'rates',
    },
    {
      label: 'availability',
      value: 'availability',
    },
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
    console.log(this.useFormControl.roomTypes.controls);
    return this.useFormControl.roomTypes.controls;
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
  }

  addRoomTypesControl() {
    this.useForm.addControl('roomTypes', this.fb.array([]));
    this.roomTypes.forEach((roomType) => {
      this.useFormControl.roomTypes.push(
        this.fb.group({
          label: roomType.label,
          ratePlans: this.fb.array(
            roomType.ratePlans.map((ratePlan) =>
              this.fb.group({
                type: [ratePlan.type],
                label: [ratePlan.label],
                rates: this.fb.array(
                  this.dates.map((item) =>
                    this.fb.group({
                      value: [''],
                    })
                  )
                ),
                linked: [false],
                showChannels: [true],
                channels: this.fb.array(
                  ratePlan.channels.map((channel) =>
                    this.fb.group({
                      rates: this.fb.array(
                        this.dates.map((item) =>
                          this.fb.group({
                            value: [''],
                          })
                        )
                      ),
                      linked: [true],
                      label: channel.label,
                    })
                  )
                ),
              })
            )
          ),
        })
      );
    });
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

  initDate(startDate: number, limit = 25) {
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
  roomTypes: { rates: []; ratePlans: [][] }[];
};

export type DateOption = { day: string; date: number };
