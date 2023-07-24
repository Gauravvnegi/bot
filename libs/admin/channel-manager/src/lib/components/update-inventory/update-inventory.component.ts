import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  QueryConfig,
  daysOfWeek,
} from '@hospitality-bot/admin/shared';
import {
  inventoryRestrictions,
  RestrictionAndValuesOption,
  restrictionsRecord,
} from '../../constants/data';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { DateOption, RoomTypes } from '../../types/channel-manager.types';
import { getWeekendBG } from '../../models/bulk-update.models';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ChannelManagerService } from '../../services/channel-manager.service';
import * as moment from 'moment';
import { UpdateInventory } from '../../models/channel-manager.model';

@Component({
  selector: 'hospitality-bot-update-inventory',
  templateUrl: './update-inventory.component.html',
  styleUrls: ['../update-rates/update-rates.component.scss'],
})
export class UpdateInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  useForm: FormGroup;
  roomTypes: RoomTypes[] = [];
  allRoomTypes: RoomTypes[] = [];
  dates: DateOption[];
  dateLimit: number = 15;
  restrictions: RestrictionAndValuesOption[];
  entityId: string;

  loading = false;
  loadingError = false;
  isRoomsEmpty = false;
  $subscription = new Subscription();

  perDayRoomAvailability = new Map<number, any>();
  inventoryRoomDetails: Map<any, any[]>;
  currentDate = new Date();

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
    this.currentDate.setHours(0, 0, 0, 0);
    this.useForm = this.fb.group({
      roomType: [],
      date: [this.currentDate.getTime()],
    });
    this.addRoomsControl();
  }

  addRoomsControl() {
    this.addRoomTypesControl();
    this.listenChanges();
    this.getInventory();
  }

  /**
   * Add Room Types Control & setting data for edit view
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
          selectedRestriction: [
            this.restrictions && this.restrictions[0].value,
          ],
        })
      );

      this.addRatesAndRestrictionControl(ratePlansControl, roomTypeIdx);

      this.addChannelsControl(roomType.channels, roomTypeIdx);
    });
    this.setRoomDetails();
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
    roomTypeIdx: number
  ) {
    const roomTypeFG = this.useFormControl.roomTypes.at(
      roomTypeIdx
    ) as FormGroup;

    roomTypeFG.addControl('channels', this.fb.array([]));

    const channelControl = roomTypeFG.get('channels') as FormArray;

    channels?.forEach((channel, channelIdx) => {
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
      this.getInventory(selectedDate);
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

  getWeekendBG(day: string, isOccupancy = false) {
    return getWeekendBG(day, isOccupancy);
  }

  getInventory(selectedDate = this.useForm.value.date) {
    this.loading = true;
    this.$subscription.add(
      this.channelManagerService
        .getChannelManagerDetails(
          this.entityId,
          this.getQueryConfig(selectedDate)
        )
        .subscribe(
          (res) => {
            const data = new UpdateInventory().deserialize(res.roomType);
            this.perDayRoomAvailability = data.perDayRoomAvailability;
            this.inventoryRoomDetails = data.inventoryRoomDetails;
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

  setRoomDetails(selectedDate?: number) {
    const { fromDate } = this.getFromAndToDateEpoch(
      selectedDate ? selectedDate : this.useForm.controls['date'].value
    );
    let currentDate = new Date(fromDate);

    if (this.inventoryRoomDetails) {
      for (let control of (this.useForm.get('roomTypes') as FormArray)
        .controls) {
        const availabilityControl = (control as FormArray).controls[
          'availability'
        ]?.controls as FormArray;

        for (
          let controlIndex = 0;
          controlIndex < availabilityControl?.length;
          controlIndex++
        ) {
          const roomId = (control as FormArray).controls['value'].value;
          const room = this.inventoryRoomDetails[roomId];

          const selectedDateRoom = room?.find(
            (item) => item.date === currentDate.getTime()
          );

          const formGroup = availabilityControl[controlIndex] as FormGroup;
          const availableRoom = selectedDateRoom?.availableRoom ?? undefined;

          formGroup.controls['value'].patchValue(availableRoom, {
            emitEvent: false,
          });

          currentDate.setDate(currentDate.getDate() + 1);
        }
        currentDate = new Date(fromDate);
      }
    }
  }

  handleSave() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    this.loading = true;
    const { fromDate } = this.getFromAndToDateEpoch(
      this.useForm.controls['date'].value
    );
    const data = UpdateInventory.buildRequestData(
      this.useForm.getRawValue(),
      fromDate
    );

    this.$subscription.add(
      this.channelManagerService
        .updateChannelManager(
          { updates: data },
          this.entityId,
          this.getQueryConfig()
        )
        .subscribe(
          (res) => {
            this.getInventory();
            this.snackbarService.openSnackBarAsText(
              'Inventory Update successfully',
              '',
              { panelClass: 'success' }
            );
            this.loading = false;
          },
          (error) => {
            this.useForm.controls['date'].patchValue(this.currentDate, {
              emitEvent: false,
            });
            this.setRoomDetails();
            this.loading = false;
          },
          this.handleFinal
        )
    );
    this.loading = true;
  }

  handleFinal() {
    this.loading = false;
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
          inventoryUpdateType: 'INVENTORY',
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

  getAvailability(nextDate, type: 'qty' | 'occupy') {
    const date = new Date(this.useForm.controls['date'].value);
    date.setDate(date.getDate() + nextDate);
    const availability = this.perDayRoomAvailability[date.getTime()];

    const data = availability
      ? availability[type === 'qty' ? 'roomAvailable' : 'occupancy']
      : 0;

    return data === 'NaN' ? 0 : data;
  }
}
