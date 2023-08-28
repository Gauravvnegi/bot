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
import {
  ConfigCategory,
  ConfigType,
  DynamicPricingForm,
} from '../../types/dynamic-pricing.types';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';

export type ControlTypes = 'season' | 'occupancy' | 'hotel-occupancy';

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
      this.dynamicPricingService
        .getDynamicPricingList(this.getQueryConfig('OCCUPANCY'))
        .subscribe((res) => {
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

  add(type: ControlTypes, form?: FormGroup | FormArray) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.push(this.seasonFG);
        break;
      case 'occupancy':
        (form?.get('occupancy') as FormArray).push(this.seasonOccupancyFG);
        break;
      case 'hotel-occupancy':
        (form as FormArray).controls.push(this.seasonOccupancyFG);
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
      hotelConfig: this.fb.array([this.seasonOccupancyFG]),
      hotelId: [this.entityId],
      basePrice: [],
      roomCount: [this.rooms.find((item) => item.isBase)?.roomCount ?? 0],
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
        basePrice: [room?.price ?? 0],
        roomCount: [room?.roomCount ?? 0],
        occupancy: this.fb.array([this.seasonOccupancyFG]),
      })
    );
  }

  get seasonOccupancyFG(): FormGroup {
    return this.fb.group({
      id: [],
      start: [1, [Validators.min(0), Validators.required]],
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
    const saveRule = (formGroup: FormGroup, ruleId) => {
      const removedFA = formGroup.get('removedRules') as FormArray;
      removedFA.controls.push(ruleId);
      removedFA.markAsDirty();
    };

    switch (type) {
      case 'season':
        this.loading = true;
        const season = this.dynamicPricingControl.occupancyFA;
        this.$subscription.add(
          this.dynamicPricingService
            .deleteDynamicPricing(season.at(index).get('id').value)
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
        var ruleId = rule.at(index)?.get('id');
        if (ruleId?.value) {
          saveRule(seasonFG, ruleId.value);
        }
        rule.removeAt(index);
        this.applyRulesConstraint(
          rule,
          +form.get('roomCount').value,
          index == 0 ? 'first' : index == rule.controls.length ? 'last' : null
        );
        break;
      case 'hotel-occupancy':
        const control = form.get('hotelConfig') as FormArray;
        var ruleId = control.at(index)?.get('id');
        if (ruleId?.value) {
          saveRule(form, ruleId.value);
        }
        control.removeAt(index);
        this.applyRulesConstraint(
          control,
          +form.get('roomCount').value,
          index == 0
            ? 'first'
            : index == control.controls.length
            ? 'last'
            : null
        );
        break;
    }
  }

  listenChanges() {
    this.dynamicPricingControl?.occupancyFA.controls.forEach(
      (seasonFG: FormGroup) => {
        const roomTypeControl = seasonFG.get('roomType');
        const configCategoryFG = seasonFG.get('configCategory');
        const ruleSubscription = (
          ruleFA: FormArray,
          index: number,
          basePrice: number,
          roomCount: number
        ) => {
          const form = ruleFA.at(index) as FormGroup;
          const { discount, rate, start, end } = form.controls;
          discount.valueChanges.subscribe((percentage) => {
            const rate = (parseInt(percentage) * basePrice) / 100 + basePrice;
            form.patchValue(
              {
                rate: rate.toFixed(2),
              },
              { emitEvent: false }
            );
          });

          rate.valueChanges.subscribe((rate) => {
            const discount = ((parseInt(rate) - basePrice) / basePrice) * 100;
            form.patchValue(
              {
                discount: discount.toFixed(2),
              },
              { emitEvent: false }
            );
          });

          start.valueChanges.subscribe((startValue) => {
            const condition = end.value && +startValue > end.value;
            const customError = { min: 'Start should be <= End.' };
            start.setErrors(condition ? customError : null);
            end.setErrors(condition && null);
          });

          end.valueChanges.subscribe((endValue) => {
            const condition = start.value && +endValue < start.value;
            const customError = {
              min: 'End should be >= Start.',
            };
            end.setErrors(condition ? customError : null);
            start.setErrors(condition && null);
            this.applyRulesConstraint(ruleFA, roomCount);
          });

          // Restriction
          start.disable();
          if (index === ruleFA.controls.length - 1) {
            end.patchValue(roomCount, { emitEvent: false });
          }
        };
        configCategoryFG.valueChanges.subscribe((res: ConfigCategory) => {
          if (res) {
            res == 'HOTEL'
              ? roomTypeControl.disable()
              : roomTypeControl.enable();
          }
        });
        const hotelConfigFA = seasonFG.get('hotelConfig') as FormArray;
        hotelConfigFA.controls.forEach((rule: FormGroup, index) => {
          ruleSubscription(
            hotelConfigFA,
            index,
            +seasonFG.get('basePrice').value,
            +seasonFG.get('roomCount').value
          );
        });
        this.applyRulesConstraint(
          hotelConfigFA,
          +seasonFG.get('roomCount').value
        );

        if (configCategoryFG.value == 'ROOM_TYPE') {
          //roomType change listening
          const roomTypeFA = seasonFG.get('roomTypes') as FormArray;
          roomTypeControl.valueChanges.subscribe((res: string[]) => {
            roomTypeFA.controls.forEach((roomType: FormGroup, index) => {
              const hasSelected = res?.includes(roomType.get('roomId').value);
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
            const roomCount = roomTypeFG.get('roomCount').value;
            //occupancy change listening
            const occupancyFA = roomTypeFG.get('occupancy') as FormArray;
            occupancyFA.controls.forEach((occupancyFG: FormGroup, index) => {
              ruleSubscription(occupancyFA, index, basePrice, roomCount);
            });
            this.applyRulesConstraint(occupancyFA, roomCount);
          });
        }
      }
    );
  }

  applyRulesConstraint(
    rules: FormArray,
    roomCount: number,
    deleteFrom?: 'first' | 'mid' | 'last'
  ) {
    if (deleteFrom && deleteFrom === 'first') {
      rules.at(0)?.get('start').patchValue(1, {
        emitEvent: false,
      });
      return;
    }

    if (deleteFrom && deleteFrom == 'last') {
      rules
        .at(rules.controls.length - 1)
        ?.get('end')
        .patchValue(roomCount, {
          emitEvent: false,
        });
      return;
    }
    rules.controls.reduce((acc: FormGroup, curr: FormGroup, index) => {
      const { start, end } = curr.controls;
      if (acc) {
        start.patchValue(+acc.get('end').value + 1, {
          emitEvent: false,
        });
        start.markAsDirty();
      }

      // Validation
      if (+start.value > +end.value) {
        const customError = { min: 'Start should be <= End.' };
        start.setErrors(+start.value > +end.value ? customError : null);
        end.setErrors(+start.value > +end.value && null);
        start.markAllAsTouched();
        end.markAllAsTouched();
      } else {
        start.markAsUntouched();
        end.markAsUntouched();
      }
      acc = curr;
      return curr;
    });
  }

  selectedRoomIndex(seasonIndex: number): number {
    const roomId = this.dynamicPricingControl.occupancyFA
      .at(seasonIndex)
      .get('roomType').value[0];
    return this.rooms.findIndex((item) => item.value === roomId);
  }

  handleSave(form: FormGroup) {
    if (!this.dynamicPricingService.occupancyValidate(form)) {
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
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  isDisableAddNewRule(ruleFA: FormArray, roomCountFG: FormGroup): boolean {
    const isRulesValid = () => {
      return ruleFA.controls.every(
        (item: FormGroup) => +item.get('start').value <= +item.get('end').value
      );
    };
    const end = +ruleFA.at(ruleFA.controls.length - 1).value.end;
    return end >= +roomCountFG.value || !isRulesValid();
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
