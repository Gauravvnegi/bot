import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomFieldTypeOption } from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { Option } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-upgrade-room-type',
  templateUrl: './upgrade-room-type.component.html',
  styleUrls: ['./upgrade-room-type.component.scss'],
})
export class UpgradeRoomTypeComponent implements OnInit {
  useForm: FormGroup;
  entityId: string;
  queryConfig: string;

  roomTypes: RoomFieldTypeOption;
  selectedRoomType: RoomFieldTypeOption;
  ratePlans: Option[] = [];
  roomNumbers: Option[] = [];

  @Input() set roomConfig(value: RoomConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
  }

  @Output() onClose = new EventEmitter();

  constructor(private fb: FormBuilder, private formService: FormService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      roomType: [''],
      roomNumber: [''],
      ratePlan: [''],
      remarks: [''],
      amount: [''],
      chargeable: [false],
    });
  }

  roomTypeChange(event: RoomTypeResponse) {
    if (event) {
      this.selectedRoomType = this.formService.setReservationRoomType(event);
      this.listenForRoomTypeChange();
    }
  }

  listenForRoomTypeChange() {
    if (this.selectedRoomType) {
      this.ratePlans = this.selectedRoomType.ratePlans.map((item) => ({
        label: item.label,
        value: item.value,
        sellingprice: item.sellingPrice,
        isBase: item.isBase,
      }));
      let defaultPlan = this.ratePlans.find((item) => item.isBase);
      this.useForm
        .get('ratePlan')
        .patchValue(defaultPlan.value, { emitEvent: false });
      this.roomNumbers = this.selectedRoomType.rooms;
    }
  }

  handleSubmit() {}

  handleCancel() {
    this.onClose.emit();
  }
}

export type RoomConfig = {
  entityId: string;
  queryConfig: string;
  roomTypes?: RoomFieldTypeOption;
};

export type RatePlanType = {
  label: string;
  value: string;
  sellingPrice: number;
  isBase: boolean;
};
