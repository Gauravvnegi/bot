import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Revenue, weeks } from '../../constants/revenue-manager.const';
import {
  DynamicPricingFactory,
  DynamicPricingHandler,
} from '../../models/dynamic-pricing.model';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { RoomTypes } from '../../types/bar-price.types';
import {
  ConfigType,
  DynamicPricingForm,
} from '../../types/dynamic-pricing.types';

export type ControlTypes = 'season' | 'occupancy';

@Component({
  selector: 'hospitality-bot-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
})
export class OccupancyComponent implements OnInit {
  readonly weeks = weeks;
  configCategory: Option[] = [
    { label: 'Room Type', value: 'ROOM_TYPE' },
    { label: 'Hotel Type', value: 'HOTEL' },
  ];
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
      if (!this.dynamicPricingControl.occupancyFA.length) {
        this.initSeason();
        this.listenChanges();
      }
    }
  }
  @Input() rooms: RoomTypes[];
  $subscription = new Subscription();

  get dynamicPricingFG(): FormGroup {
    return this.parentForm;
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG?.controls as Record<
      keyof DynamicPricingForm,
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
    public fb: FormBuilder
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
            handler.mapOccupancy(index, item, this);
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
      configCategory: ['ROOM_TYPE', [Validators.required]],
      roomType: [, [Validators.required]],
      removedRules: this.fb.array([]),
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

  remove(
    type: ControlTypes,
    index: number,
    form?: FormGroup,
    seasonFG?: FormGroup
  ) {
    switch (type) {
      case 'season':
        this.loading = true;
        const season = this.dynamicPricingControl.occupancyFA;
        this.$subscription.add(
          this.dynamicPricingService
            .deleteDynamicPricing(
              this.entityId,
              season.at(index).get('id').value
            )
            .subscribe(
              (res) => {
                this.snackbarService.openSnackBarAsText(
                  `Season deleted Successfully.`,
                  '',
                  { panelClass: 'success' }
                );
                season.removeAt(index);
              },
              (error) => {
                this.loading = false;
              },
              this.handleFinal
            )
        );
        break;
      case 'occupancy':
        const rule = form.get('occupancy') as FormArray;
        const ruleId = rule.at(index)?.get('id');
        if (ruleId?.value) {
          const removedFA = seasonFG?.get('removedRules') as FormArray;
          removedFA.controls.push(ruleId.value);
          removedFA.markAsDirty();
        }
        rule.removeAt(index);
        break;
    }
  }

  listenChanges() {
    this.dynamicPricingControl?.occupancyFA.controls.forEach(
      (seasonFG: FormGroup) => {
        seasonFG.patchValue({ configCategory: 'ROOM_TYPE' });
        //roomType change listening
        const roomTypeFA = seasonFG.get('roomTypes') as FormArray;
        seasonFG.get('roomType').valueChanges.subscribe((res: string[]) => {
          roomTypeFA.controls.forEach((roomType: FormGroup, index) => {
            const hasSelected = res.includes(roomType.get('roomId').value);
            roomType.patchValue(
              {
                isSelected: hasSelected,
              },
              { emitEvent: false }
            );
          });
        });

        roomTypeFA.controls.forEach((roomTypeFG: FormGroup) => {
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
