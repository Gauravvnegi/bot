import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  DynamicPricingFactory,
  DynamicPricingHandler,
} from '../../models/dynamic-pricing.model';
import { Revenue, weeks } from '../../constants/revenue-manager.const';
import {
  ConfigCategory,
  ConfigType,
  ModeType,
} from '../../types/dynamic-pricing.types';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { Subscription } from 'rxjs';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypes } from '../../types/bar-price.types';

export type ControlTypes = 'season' | 'occupancy';

@Component({
  selector: 'hospitality-bot-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
})
export class OccupancyComponent implements OnInit {
  readonly weeks = weeks;
  entityId = '';

  loading = false;
  footerNote = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Error eos
  alias consequuntur necessitatibus dolore, fugit eligendi, exercitationem
  quia iste nemo nulla eveniet, doloribus sit vero? Laboriosam inventore
  deleniti autem illum!`;
  private parentForm: FormGroup;

  @Input() set dynamicPricingFG(form: FormGroup) {
    if (form) {
      this.parentForm = form;
      this.initSeason();
      this.listenChanges();
    }
  }
  @Input() rooms: RoomTypes[];
  $subscription = new Subscription();

  get dynamicPricingFG(): FormGroup {
    return this.parentForm;
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG?.controls as Record<
      'occupancyFA',
      AbstractControl
    > & {
      occupancyFA: FormArray;
    };
  }

  constructor(
    private globalFilterService: GlobalFilterService,
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
  }

  initSeason() {
    this.loading = true;
    this.$subscription.add(
      this.dynamicPricingService.getOccupancyList().subscribe((res) => {
        if (!res.configDetails.length) {
          this.add('season');
        } else {
          const handler = new DynamicPricingHandler().deserialize(
            res,
            this.rooms
          );
          handler.dataList.forEach((item, index) => {
            this.add('season');
            const season = this.dynamicPricingControl.occupancyFA.at(
              index
            ) as FormGroup;
            handler.mapOccupancy(season, item);
          });
        }
      })
    );
  }

  seasonStatusChange(status, seasonIndex: number) {
    const control = this.dynamicPricingControl.occupancyFA.at(seasonIndex);
    control.patchValue({ status: status });
    control.get('status').markAsDirty();
  }

  add(type: ControlTypes, formGroup?: FormGroup) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.push(this.seasonFG);
        break;
      case 'occupancy':
        (formGroup?.get('occupancy') as FormArray).push(this.seasonOccupancyFG);
        break;
    }
    this.listenChanges();
  }

  get seasonFG() {
    return this.fb.group({
      status: [true],
      id: [''],
      type: ['add'], // it should be ModeType -> 'add'|'update'
      name: [, [Validators.required]],
      fromDate: [, [Validators.required]],
      toDate: [, [Validators.required]],
      configCategory: ['ROOM_TYPE'],
      roomType: [, [Validators.required]],
      selectedDays: [, [Validators.required]],
      roomTypes: this.fb.array(this.getRoomTypesFA()),
    });
  }

  getRoomTypesFA() {
    return this.rooms.map((room) =>
      this.fb.group({
        isSelected: [true],
        roomId: [room.value],
        roomName: [room.label],
        basePrice: [room.price],
        occupancy: this.fb.array([this.seasonOccupancyFG]),
      })
    );
  }

  get seasonOccupancyFG(): FormGroup {
    return this.fb.group({
      id: [],
      start: [, [Validators.min(0), Validators.required]],
      end: [, [Validators.min(0), Validators.required]],
      discount: [, [Validators.min(-100), Validators.required]],
      rate: [, [Validators.min(0), Validators.required]],
    });
  }

  remove(type: ControlTypes, index: number, roomType?: FormGroup) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.removeAt(index);
        break;
      case 'occupancy':
        (roomType.get('occupancy') as FormArray).removeAt(index);
        break;
    }
  }

  listenChanges() {
    this.dynamicPricingControl?.occupancyFA.controls.forEach(
      (seasonFG: FormGroup) => {
        //roomType change listening
        const roomTypeFG = seasonFG.get('roomTypes') as FormArray;
        seasonFG.get('roomType').valueChanges.subscribe((res: string[]) => {
          roomTypeFG.controls.forEach((roomType: FormGroup, index) => {
            roomType.patchValue(
              {
                isSelected: res.includes(roomType.get('roomId').value),
              },
              { emitEvent: false }
            );
          });
        });

        roomTypeFG.controls.forEach((roomTypeFG: FormGroup) => {
          const basePrice = roomTypeFG.get('basePrice').value;
          //occupancy change listening
          (roomTypeFG.get('occupancy') as FormArray).controls.forEach(
            (occupancyFG: FormGroup) => {
              occupancyFG
                .get('discount')
                .valueChanges.subscribe((percentage) => {
                  const rate =
                    (parseInt(percentage) * basePrice) / 100 + basePrice;
                  occupancyFG.patchValue(
                    {
                      rate: rate.toFixed(2),
                    },
                    { emitEvent: false }
                  );
                });

              occupancyFG.get('rate').valueChanges.subscribe((rate) => {
                const discount =
                  ((parseInt(rate) - basePrice) / basePrice) * 100;
                occupancyFG.patchValue(
                  {
                    discount: discount.toFixed(2),
                  },
                  { emitEvent: false }
                );
              });

              const { start, end } = occupancyFG.controls;
              start.valueChanges.subscribe((startValue) => {
                const condition = end.value && +startValue > end.value;
                const customError = { min: 'Start should be less than End.' };
                start.setErrors(condition ? customError : null);
                end.setErrors(condition && null);
              });

              end.valueChanges.subscribe((endValue) => {
                const condition = start.value && +endValue < start.value;
                const customError = {
                  min: 'End should be greater than Start.',
                };
                end.setErrors(condition ? customError : null);
                start.setErrors(condition && null);
              });
            }
          );
        });
      }
    );
  }

  selectedRoomIndex(seasonIndex: number): number {
    const roomId = this.dynamicPricingControl.occupancyFA
      .at(seasonIndex)
      .get('roomType').value[0];
    return this.rooms.findIndex((item) => item.value === roomId);
  }

  handleSave(form: FormGroup) {
    const {
      status,
      invalidList,
    } = this.dynamicPricingService.occupancyValidate(form);
    if (!status) {
      form.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    this.loading = true;
    const { id, type } = form.controls;
    const requestedData = DynamicPricingFactory.buildRequest(
      form,
      'OCCUPANCY',
      form.get('type').value
    );

    if (!Object.keys(requestedData).length) {
      this.snackbarService.openSnackBarAsText(
        'Please make changes for the new updates.'
      );
      return;
    }

    const requestFunction =
      Revenue[type.value] === Revenue['add']
        ? this.dynamicPricingService.createDynamicPricing
        : this.dynamicPricingService.updateDynamicPricing;
    const request = requestFunction.bind(this.dynamicPricingService);
    const requestParams = [
      requestedData,
      this.entityId,
      this.getQueryConfig('OCCUPANCY'),
      id.value,
    ];

    this.$subscription.add(
      request(...requestParams).subscribe(
        (res) => {
          this.snackbarService.openSnackBarAsText(
            `Season ${
              form.get('type').value === 'add' ? 'Created ' : 'Updated '
            } Successfully.`,
            '',
            { panelClass: 'success' }
          );
          console.log(res);
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  getQueryConfig(type: ConfigType): QueryConfig {
    return {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: type,
        },
      ]),
    };
  }

  handleFinal() {
    this.loading = false;
  }
}
