import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ModuleNames,
  Option,
  QueryConfig,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { Accordion } from 'primeng/accordion';
import { Subscription } from 'rxjs';
import { Revenue, weeks } from '../../constants/revenue-manager.const';
import { openAccordion } from '../../models/bar-price.model';
import {
  DynamicPricingFactory,
  DynamicPricingHandler,
} from '../../models/dynamic-pricing.model';
import {
  BarPriceService,
  isDirty,
  markupValidator,
} from '../../services/bar-price.service';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import {
  ConfigCategory,
  ConfigType,
  DynamicSeasonPricingForm,
} from '../../types/dynamic-pricing.types';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

export type ControlTypes = 'season' | 'occupancy' | 'hotel-occupancy';

/**
 * @remarks - Rates input in table in not shown in UI
 */
@Component({
  selector: 'hospitality-bot-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
})
export class OccupancyComponent implements OnInit {
  @Input() seasonId: string;

  readonly weeks = weeks;
  configCategory: Option[] = [
    { label: 'Room Type', value: 'ROOM_TYPE' },
    { label: 'Hotel Type', value: 'HOTEL' },
  ];
  entityId = '';
  readonly isDirty = isDirty;

  loading = false;
  footerNote = `Instruction Goes here...`;
  dynamicPricingFG: FormGroup;

  // @Input() set dynamicPricingFG(form: FormGroup) {
  //   if (form) {
  //     this.parentForm = form;
  //     if (!this.dynamicPricingControl.occupancyFA.length) {
  //       this.initSeason();
  //       this.listenChanges();
  //     }
  //   }
  // }

  rooms: RoomTypes[];
  @ViewChild('accordion') accordion: Accordion;
  $subscription = new Subscription();

  get dynamicPricingControl() {
    return this.dynamicPricingFG?.controls as Record<
      keyof DynamicSeasonPricingForm,
      FormArray
    >;
  }

  constructor(
    private globalFilterService: GlobalFilterService,
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    public fb: FormBuilder,
    private barPriceService: BarPriceService,
    private routesConfigService: RoutesConfigService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initRoom();
  }

  initForm() {
    const data: DynamicSeasonPricingForm = {
      occupancyFA: this.fb.array([]),
    };

    this.dynamicPricingFG = this.fb.group(data);
  }

  initRoom() {
    this.loading = true;
    this.barPriceService.roomDetails.subscribe((res) => {
      if (this.barPriceService.isRoomDetailsLoaded) {
        this.rooms = res;

        if (this.seasonId) {
          this.initSeason();
          this.listenChanges();
        } else {
          this.add('season', null, true);
        }
      } else {
        this.barPriceService.loadRoomTypes(this.entityId);
      }

      this.loading = false;
    });
  }

  initSeason() {
    this.loading = true;

    this.$subscription.add(
      this.dynamicPricingService
        .getDynamicPricingList(this.getQueryConfig('OCCUPANCY'))
        .subscribe((res) => {
          /**
           * @todo Support from api using ruleId
           */

          res.configDetails = res.configDetails.filter(
            (res) => res.id === this.seasonId
          );

          this.dynamicPricingControl.occupancyFA = this.fb.array([]);

          const handler = new DynamicPricingHandler().deserialize(
            res,
            this.rooms
          );

          handler.dataList = handler.dataList.filter(
            (res) => res.id === this.seasonId
          );

          handler.dataList.forEach((item, index) => {
            handler.mapOccupancy(index, item, this);
          });
        })
    );
  }

  seasonStatusChange(status, seasonIndex: number) {
    const control = this.dynamicPricingControl.occupancyFA.at(
      seasonIndex
    ) as FormGroup;
    if (control.get('id').value) {
      this.loading = true;
      this.$subscription.add(
        this.dynamicPricingService
          .updateDynamicPricing(
            { status: status ? 'ACTIVE' : 'INACTIVE' },
            this.entityId,
            this.getQueryConfig('OCCUPANCY'),
            control.get('id').value
          )
          .subscribe(
            (res) => {
              this.snackbarService.openSnackBarAsText(
                `Season '${control.controls['name'].value}' Status Updated Successfully.`,
                '',
                { panelClass: 'success' }
              );
              DynamicPricingHandler.resetFormState(control, this.fb);
            },
            (error) => {
              this.loading = false;
            },
            this.handleFinal
          )
      );
    } else {
      control.patchValue({ status: status });
    }
  }

  add(
    type: ControlTypes,
    form?: FormGroup | FormArray,
    onClickAddition?: boolean
  ) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.push(this.seasonFG);
        this.listenChanges();
        if (onClickAddition) {
          setTimeout(() => {
            openAccordion({
              accordion: this.accordion,
              index: this.dynamicPricingControl.occupancyFA.controls.length - 1,
              isScrollToTop: true,
            });
          });
        }
        break;
      case 'occupancy':
        const { roomStrikeAmount, occupancy } = (form as FormGroup).controls;
        const rulesFA = occupancy as FormArray;
        rulesFA.push(this.seasonOccupancyFG);
        this.listenOccupancy(rulesFA, roomStrikeAmount.value);
        break;
      case 'hotel-occupancy':
        onClickAddition && form.markAsDirty();
        (form as FormArray).controls.push(this.seasonOccupancyFG);
        this.listenOccupancy(form as FormArray);
        break;
    }
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
      basePrice: [this.rooms.find((item) => item.isBase)?.price],
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
        roomStrikeAmount: [
          room.pricingDetails.base +
            room.ratePlans.find((item) => item.isBase)?.variablePrice ?? 0,
        ],
        roomCount: [room?.roomCount ?? 0],
        occupancy: this.fb.array([this.seasonOccupancyFG]),
      })
    );
  }

  get seasonOccupancyFG(): FormGroup {
    const levelFG = this.fb.group({
      id: [],
      basePrice: [this.rooms.find((item) => item.isBase)?.price],
      start: [
        { value: 0, disabled: true },
        [Validators.min(0), Validators.required],
      ],
      end: [1, [Validators.min(0), Validators.required]],
      discount: [, [Validators.min(0), Validators.required]],
      isMarkup: [true],
      rate: [, [Validators.min(0), Validators.required]],
    });

    markupValidator(levelFG);
    return levelFG;
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
        const { name, id, type } = (season.at(index) as FormGroup).controls;
        if (type.value === 'update') {
          let dialogRef: DynamicDialogRef;
          const modalData: Partial<ModalComponent> = {
            heading: 'Remove Season',
            descriptions: [
              'Do you want to remove this season.',
              'Are you Sure?',
            ],
            actions: [
              {
                label: 'No',
                onClick: () => dialogRef.close(),
                variant: 'outlined',
              },
              {
                label: 'Yes',
                onClick: () => {
                  this.$subscription.add(
                    this.dynamicPricingService
                      .deleteDynamicPricing(id.value)
                      .subscribe(
                        (res) => {
                          this.snackbarService.openSnackBarAsText(
                            `Season '${name.value}' deleted Successfully.`,
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
                  dialogRef.close();
                },
                variant: 'contained',
              },
            ],
          };
          dialogRef = openModal({
            config: {
              styleClass: 'confirm-dialog',
              data: modalData,
            },
            component: ModalComponent,
            dialogService: this.dialogService,
          });
        } else {
          season.removeAt(index);
        }
        break;
      case 'occupancy':
        const rule = form.get('occupancy') as FormArray;
        var ruleId = rule.at(index)?.get('id');
        if (ruleId?.value) {
          saveRule(seasonFG, ruleId.value);
        }
        rule.removeAt(index);
        this.applyRulesConstraint(rule, index == 0 ? 'first' : null);
        break;
      case 'hotel-occupancy':
        const control = form.get('hotelConfig') as FormArray;
        var ruleId = control.at(index)?.get('id');
        if (ruleId?.value) {
          saveRule(form, ruleId.value);
        }
        control.removeAt(index);
        this.applyRulesConstraint(control, index == 0 ? 'first' : null);
        break;
    }
  }

  listenChanges() {
    this.dynamicPricingControl?.occupancyFA.controls.forEach(
      (seasonFG: FormGroup) => {
        const roomTypeControl = seasonFG.get('roomType');
        const configCategoryFG = seasonFG.get('configCategory');
        configCategoryFG.valueChanges.subscribe((res: ConfigCategory) => {
          if (res) {
            res == 'HOTEL'
              ? roomTypeControl.disable()
              : roomTypeControl.enable();
          }
        });
        const hotelConfigFA = seasonFG.get('hotelConfig') as FormArray;
        hotelConfigFA.controls.forEach((rule: FormGroup, index) => {
          this.ruleSubscription(rule);
        });

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
            //occupancy change listening
            const { roomStrikeAmount } = roomTypeFG.controls;
            const occupancyFA = roomTypeFG.get('occupancy') as FormArray;
            occupancyFA.controls.forEach((occupancyFG: FormGroup, index) => {
              this.ruleSubscription(occupancyFG, null, roomStrikeAmount.value);
            });
          });
        }
      }
    );
  }

  ruleSubscription = (
    ruleFG: FormGroup,
    pointer?: { previous: FormGroup; next: FormGroup },
    baseAmount?: number
  ) => {
    const { discount, rate, start, end, basePrice, isMarkup } = ruleFG.controls;
    if (!baseAmount) {
      baseAmount = +basePrice.value;
    }

    const updateRate = () => {
      const percentageValue = parseInt(discount.value);
      const totalRate =
        ((isMarkup.value ? percentageValue : -percentageValue) * baseAmount) /
          100 +
        baseAmount;
      rate.patchValue(Math.floor(totalRate), { emitEvent: false });
    };

    isMarkup.valueChanges.subscribe(updateRate);
    discount.valueChanges.subscribe(updateRate);

    rate.valueChanges.subscribe((rate) => {
      const totalDiscount = ((parseInt(rate) - baseAmount) / baseAmount) * 100;
      isMarkup.patchValue(totalDiscount > 0, { emitEvent: false });
      discount.patchValue(Math.floor(Math.abs(totalDiscount)), {
        emitEvent: false,
      });
    });

    end.valueChanges.subscribe((endValue) => {
      const currentCondition = start.value && +start.value > end.value;
      this.setErrors([start, end], currentCondition);
      if (pointer?.next) {
        const { start: nextStart, end: nextEnd } = pointer.next.controls;
        nextStart.patchValue(+end.value + 1, { emitEvent: false });
        const nextCondition =
          nextStart.value && +nextStart.value > nextEnd.value;
        this.setErrors([nextStart, nextEnd], nextCondition);
      }
    });

    if (pointer?.previous && !pointer?.next) {
      const { end: prevEnd } = pointer.previous.controls;
      start.patchValue(+prevEnd.value + 1, { emitEvent: false });
      end.patchValue(+prevEnd.value + 2, { emitEvent: false });
    }
  };

  listenOccupancy(rulesFA: FormArray, strikeAmount?: number) {
    let previousRule: FormGroup;
    rulesFA.controls.forEach((rule: FormGroup, index: number) => {
      const nextRule = rulesFA.at(index + 1) as FormGroup;
      this.ruleSubscription(
        rule,
        { previous: previousRule, next: nextRule },
        strikeAmount
      );
      previousRule = rule;
    });
  }

  applyRulesConstraint(rules: FormArray, deleteFrom?: 'first') {
    if (deleteFrom && deleteFrom === 'first') {
      rules.at(0)?.get('start').patchValue(0, {
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
      }
      this.setErrors([start, end], +start.value > +end.value);
      acc = curr;
      return curr;
    });
  }

  navigateToMain() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.DYNAMIC_PRICING,
    });
  }

  handleSave(form: FormGroup) {
    if (!this.dynamicPricingService.occupancyValidate(form)) {
      form.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
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
            `Season '${form.get('name').value}' ${
              form.get('type').value === 'add' ? 'Created ' : 'Updated '
            } Successfully.`,
            '',
            { panelClass: 'success' }
          );
          // DynamicPricingHandler.resetFormState(form, this.fb, res);
          this.navigateToMain();
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  setErrors([...list], condition: boolean) {
    list.forEach((item: AbstractControl) => {
      item.setErrors(
        condition
          ? { min: true }
          : item.value != '0' && item.value == '' && !item.value
          ? { required: true }
          : null
      );
      item.markAsTouched();
    });
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
