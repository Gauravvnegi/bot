import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoomTypeOption } from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import {
  EntitySubType,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { Subscription } from 'rxjs';
import { RoomUpgradeType } from '../../types/response.type';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-upgrade-room-type',
  templateUrl: './upgrade-room-type.component.html',
  styleUrls: ['./upgrade-room-type.component.scss'],
})
export class UpgradeRoomTypeComponent implements OnInit {
  entityId: string;
  queryConfig: string;
  reservationId: string;
  effectiveDate: number;

  chargedAmount: number;
  selectedRoomType: RoomTypeOption;
  ratePlans: (Option & { isBase: boolean })[] = [];
  $subscription = new Subscription();

  @Input() set roomConfig(value: RoomConfig) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
    value.effectiveDate &&
      this.formService.roomUpgradeForm &&
      this.inputControls.effectiveDate.patchValue(value.effectiveDate);
  }

  @Output() onClose = new EventEmitter<RoomUpgradeType>();

  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenForFormChanges();
  }

  initForm() {
    this.formService.roomUpgradeForm = this.fb.group({
      roomTypeId: ['', [Validators.required]],
      roomNumber: ['', [Validators.required]],
      ratePlanId: [''],
      remarks: [''],
      chargedAmount: [0],
      chargeable: [false],
      effectiveDate: [0],
      roomNumberOptions: [[]],
      ratePlanOptions: [[]],
    });
    this.inputControls.effectiveDate.patchValue(
      this.effectiveDate ? this.effectiveDate : Date.now()
    );
  }

  getConfig(): QueryConfig {
    const config = {
      params: this.manageReservationService.makeQueryParams([
        {
          type: EntitySubType.ROOM_TYPE,
          roomTypeId: this.selectedRoomType.value,
          ratePlanId: this.inputControls.ratePlanId.value,
          roomNumber: this.inputControls.roomNumber.value,
          effectiveDate: this.formService.effectiveDate,
        },
      ]),
    };
    return config;
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
        isBase: item.isBase,
      }));
      let defaultPlan = this.ratePlans.find((item) => item.isBase);
      this.formService.roomUpgradeForm.patchValue(
        {
          ratePlanOptions: this.ratePlans,
          roomNumberOptions: this.selectedRoomType.rooms,
          ratePlanId: defaultPlan.value,
        },
        { emitEvent: false }
      );
    }
  }

  getUpgradedRoomTypeData() {
    if (this.inputControls.roomNumber.valid)
      this.$subscription.add(
        this.manageReservationService
          .getRoomTypeToUpgrade(this.reservationId, this.getConfig())
          .subscribe((res: RoomUpgradeType) => {
            if (res) {
              this.chargedAmount = res.chargedAmount;
              this.inputControls.chargedAmount.patchValue(this.chargedAmount);
            }
          })
      );
  }

  listenForFormChanges() {
    this.inputControls.ratePlanId.valueChanges.subscribe((res) => {
      if (res) this.getUpgradedRoomTypeData();
    });
    this.inputControls.roomNumber.valueChanges.subscribe((res) => {
      if (res) this.getUpgradedRoomTypeData();
    });
    this.inputControls.chargeable.valueChanges.subscribe((res) => {
      if (res && this.chargedAmount)
        this.inputControls.chargedAmount.patchValue(this.chargedAmount);
    });
  }

  handleSubmit() {
    if (this.formService.roomUpgradeForm.invalid) {
      this.formService.roomUpgradeForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    const data = this.formService.roomUpgradeForm.getRawValue() as RoomUpgradeType;
    this.$subscription.add(
      this.manageReservationService
        .upgradeRoomType(this.reservationId, data)
        .subscribe((res) => {
          this.handleSuccess(res);
        })
    );
  }

  handleSuccess = (res: RoomUpgradeType) => {
    this.snackbarService.openSnackBarAsText(
      `Room Type Upgraded Successfully`,
      '',
      { panelClass: 'success' }
    );
    this.formService.roomUpgradeForm.reset();
    this.onClose.emit(res);
  };

  handleCancel() {
    this.formService.roomUpgradeForm.reset();
    this.onClose.emit(null);
  }

  ngOnDestroy() {
    this.formService.roomUpgradeForm.reset();
  }

  get inputControls() {
    return this.formService.roomUpgradeForm.controls as Record<
      keyof RoomUpgradeType,
      AbstractControl
    >;
  }
}

export type RoomConfig = {
  entityId: string;
  queryConfig: string;
  reservationId: string;
  effectiveDate: number;
};
