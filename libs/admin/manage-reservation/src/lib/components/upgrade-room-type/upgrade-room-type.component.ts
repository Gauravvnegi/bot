import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { RoomTypeOption } from '../../constants/reservation';
import { FormService } from '../../services/form.service';
import { RoomTypeResponse } from 'libs/admin/room/src/lib/types/service-response';
import { EntitySubType, QueryConfig } from '@hospitality-bot/admin/shared';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { Subscription } from 'rxjs';
import { RoomUpgradeType } from '../../types/response.type';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ReservationRatePlan } from 'libs/admin/room/src/lib/constant/form';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  toDate: number;

  roomUpgradeForm: FormGroup;

  chargedAmount: number;
  selectedRoomType: RoomTypeOption;
  ratePlans: ReservationRatePlan[] = [];
  $subscription = new Subscription();
  constructor(
    private fb: FormBuilder,
    public formService: FormService,
    private manageReservationService: ManageReservationService,
    private snackbarService: SnackBarService,
    public dialogConfig: DynamicDialogConfig, //generic not supported yet,
    public dialogRef: DynamicDialogRef
  ) {
    const data = dialogConfig.data as RoomConfig;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {
    this.initForm();
    this.listenForFormChanges();
  }

  initForm() {
    this.roomUpgradeForm = this.fb.group({
      roomTypeId: ['', [Validators.required]],
      roomNumber: ['', [Validators.required]],
      ratePlanId: [''],
      remarks: [''],
      chargedAmount: [0],
      chargeable: [false],
      effectiveDate: [0],
      rooms: [[]],
      ratePlans: [[]],
    });
    this.inputControls.effectiveDate.patchValue(this.effectiveDate);
  }

  getConfig(): QueryConfig {
    const config = {
      params: this.manageReservationService.makeQueryParams([
        {
          type: EntitySubType.ROOM_TYPE,
          roomTypeId: this.selectedRoomType.value,
          ratePlanId: this.inputControls.ratePlanId.value,
          roomNumber: this.inputControls.roomNumber.value,
          effectiveDate: this.effectiveDate,
        },
      ]),
    };
    return config;
  }

  getUpgradeRoomTypeConfig() {
    const queries = {
      type: EntitySubType.ROOM_TYPE,
      createBooking: true,
      roomTypeStatus: true,
      roomUpgrade: true,
      fromDate: this.effectiveDate,
      toDate: this.toDate,
      reservationId: this.reservationId,
    };

    return queries;
  }

  roomTypeChange(event: RoomTypeResponse) {
    if (event) {
      this.selectedRoomType = this.formService.setReservationRoomType(event);
      this.listenForRoomTypeChange();
    }
  }

  listenForRoomTypeChange() {
    if (this.selectedRoomType) {
      this.ratePlans = this.selectedRoomType.ratePlans;
      let defaultPlan = this.ratePlans.find((item) => item.isBase);
      this.roomUpgradeForm.patchValue(
        {
          ratePlans: this.ratePlans,
          rooms: this.selectedRoomType.rooms,
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
    if (this.roomUpgradeForm.invalid) {
      this.roomUpgradeForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    const data = this.roomUpgradeForm.getRawValue() as RoomUpgradeType;
    this.$subscription.add(
      this.manageReservationService
        .upgradeRoomType(this.reservationId, data)
        .subscribe((res) => {
          this.handleSuccess(res);
        })
    );
  }

  handleSuccess = (res: RoomUpgradeClose) => {
    this.snackbarService.openSnackBarAsText(
      `Room Type Upgraded Successfully`,
      '',
      { panelClass: 'success' }
    );
    this.handleDialogClose(res);
  };

  handleDialogClose(res: RoomUpgradeClose) {
    this.dialogRef.close(res);
  }

  get inputControls() {
    return this.roomUpgradeForm.controls as Record<
      keyof RoomUpgradeType,
      AbstractControl
    >;
  }
}

export type RoomConfig = {
  entityId: string;
  reservationId: string;
  effectiveDate: number;
  toDate: number;
};

export type RoomUpgradeClose = RoomUpgradeType & { roomTypeLabel: string };
