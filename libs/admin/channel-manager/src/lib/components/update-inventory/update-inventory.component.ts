import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { daysOfWeek, Option } from '@hospitality-bot/admin/shared';
import { channels, roomTypeData } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['./update-inventory.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  useForm: FormGroup;
  roomTypes: Option[] = [];
  channels: Option[] = [];

  dates: DateOption[];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.initOptions();
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [''],
      date: [Date.now()],
      willBeChanged: [''],
    });

    this.useFormControl.date.valueChanges.subscribe((res) => {
      this.initDate(res);
    });
  }

  get useFormControl() {
    return this.useForm.controls as Record<keyof UseForm, AbstractControl>;
  }

  initOptions() {
    this.initDate(Date.now());

    this.roomTypes = roomTypeData;
    this.channels = channels;
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

  handleChannelVisibility(roomTypeIdx: number, ratePlanIdx: number) {
    const { ratePlans } = this.roomTypes[roomTypeIdx];
    ratePlans[ratePlanIdx].isChannelVisible = !ratePlans[ratePlanIdx]
      .isChannelVisible;
  }
}

export type UseForm = {
  roomType: string[];
  date: Date;
};

export type DateOption = { day: string; date: number };
