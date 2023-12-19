import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Revenue, weeks } from '../../constants/revenue-manager.const';
import { Subscription } from 'rxjs';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import {
  ConfigType,
  DynamicDayTriggerPricingForm,
} from '../../types/dynamic-pricing.types';
import {
  AdminUtilityService,
  ModuleNames,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  DynamicPricingFactory,
  DynamicPricingHandler,
  validateConfig,
} from '../../models/dynamic-pricing.model';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { Accordion } from 'primeng/accordion';
import { isDirty } from '../../services/bar-price.service';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent implements OnInit {
  readonly isDirty = isDirty;
  entityId: string;

  loading = false;
  $subscription = new Subscription();
  @ViewChild('accordion') accordion: Accordion;

  dynamicPricingFG: FormGroup;

  // @Output() modifyTriggerFGEvent = new EventEmitter();
  // @Output() modifyLevelFGEvent = new EventEmitter();
  weeks = weeks;

  @Input() triggerId: string;

  constructor(
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private globalFilter: GlobalFilterService,
    public fb: FormBuilder,
    private modalService: ModalService,
    private routesConfigService: RoutesConfigService
  ) {}

  initForm() {
    const data: DynamicDayTriggerPricingForm = {
      timeFA: this.fb.array([]),
    };

    this.dynamicPricingFG = this.fb.group(data);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
    this.initForm();
    if (this.triggerId) {
      this.loadTriggers();
    } else {
      // this.modifyTriggerFG(Revenue.add);
      this.modifyTriggerFG(Revenue.add, null, true);
      this.listenChanges(this.dynamicPricingControl.timeFA.at(0) as FormGroup);
    }
  }

  modifyTriggerFG(
    mode = Revenue.add,
    index?: number,
    createOnClick?: boolean
  ): void {
    const dayTimeFormArray = this.dynamicPricingControl.timeFA;
    if (mode != Revenue.add) {
      const triggerFG = dayTimeFormArray.at(index) as FormGroup;
      const { type } = triggerFG.controls;
      if (type.value == 'update') {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        const togglePopupCompRef = this.modalService.openDialog(
          ModalComponent,
          dialogConfig
        );
        togglePopupCompRef.componentInstance.content = {
          heading: 'Remove Trigger',
          description: ['Do you want to remove this trigger.', 'Are you Sure?'],
        };
        togglePopupCompRef.componentInstance.actions = [
          {
            label: 'No',
            onClick: () => this.modalService.close(),
            variant: 'outlined',
          },
          {
            label: 'Yes',
            onClick: () => {
              this.loading = true;
              this.$subscription.add(
                this.dynamicPricingService
                  .deleteDynamicPricing(triggerFG.get('id').value)
                  .subscribe(
                    (res) => {
                      this.snackbarService.openSnackBarAsText(
                        `Trigger '${
                          triggerFG.get('name').value
                        }' deleted Successfully.`,
                        '',
                        { panelClass: 'success' }
                      );
                      // dayTimeFormArray.removeAt(index);
                      this.routesConfigService.navigate({
                        subModuleName: ModuleNames.DYNAMIC_PRICING,
                      });
                    },
                    (error) => {
                      this.loading = false;
                    },
                    this.handleFinal
                  )
              );
              this.modalService.close();
            },
            variant: 'contained',
          },
        ];
        togglePopupCompRef.componentInstance.onClose.subscribe(() => {
          this.modalService.close();
        });
      } else {
        dayTimeFormArray.removeAt(index);
      }
    } else {
      // this.modifyTriggerFGEvent.emit({ mode, index });
      if (mode == Revenue.add) {
        this.dynamicPricingControl.timeFA.controls.push(this.getTriggerFG());
      }
      this.listenChanges(
        dayTimeFormArray.at(dayTimeFormArray.controls.length - 1) as FormGroup
      );
    }
  }

  getTriggerFG(data?: any): FormGroup {
    const triggerFG = this.fb.group({
      id: [],
      hotelId: [this.entityId],
      name: ['', [Validators.required]],
      fromDate: ['', [Validators.required]],
      toDate: ['', [Validators.required]],
      type: ['add'],
      removedRules: this.fb.array([]),
      selectedDays: [, [Validators.required]],
      configCategory: ['HOTEL'],
      hotelConfig: this.fb.array([this.getLevelFG()]),
      status: [true, [Validators.required]],
    });
    if (data) triggerFG.patchValue(data);
    return triggerFG;
  }

  getLevelFG(): FormGroup {
    return this.fb.group(
      {
        id: [],
        fromTime: ['', [Validators.required]],
        toTime: ['', [Validators.required]],
        start: ['', [Validators.min(1), Validators.required]],
        end: ['', [Validators.min(1), Validators.required]],
        discount: ['', [Validators.required]],
      },
      { validators: this.dynamicPricingService.triggerLevelValidator }
    );
  }

  modifyLevelFG(
    triggerFG: FormGroup,
    mode = Revenue.add,
    index?: number
  ): void {
    // this.modifyLevelFGEvent.emit({ triggerFG, mode, index });
    const levelFA = triggerFG?.get('hotelConfig') as FormArray;
    if (mode == Revenue.add) {
      levelFA.controls.push(this.getLevelFG());
    } else {
      const levelRemoveId = levelFA.at(index).value.id;
      if (levelRemoveId) {
        const removedRule = triggerFG.get('removedRules') as FormArray;
        removedRule.controls.push(levelRemoveId);
        removedRule.markAsDirty();
      }
      levelFA.removeAt(index);
    }
    levelFA.markAsDirty();
    this.listenChanges(triggerFG);
  }

  loadTriggers() {
    this.loading = true;
    this.$subscription.add(
      this.dynamicPricingService
        .getDynamicPricingList(this.getQueryConfig('DAY_TIME_TRIGGER'))
        .subscribe(
          (res) => {
            this.dynamicPricingControl.timeFA = this.fb.array([]);

            /**
             * @todo handle by id api call
             */
            res.configDetails = res.configDetails.filter(
              (res) => res.id === this.triggerId
            );
            const triggerModel = new DynamicPricingHandler().deserialize(res);
            triggerModel.dataList.forEach((item, index) => {
              triggerModel.mapDayTimeTrigger(index, item, this);
            });
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  triggerStatusChange(event: boolean, triggerFG: FormGroup) {
    const { id, name } = triggerFG.controls;
    if (id.value) {
      this.loading = true;
      this.$subscription.add(
        this.dynamicPricingService
          .updateDynamicPricing(
            { status: event ? 'ACTIVE' : 'INACTIVE' },
            this.entityId,
            this.getQueryConfig('DAY_TIME_TRIGGER'),
            id.value
          )
          .subscribe(
            (res) => {
              this.snackbarService.openSnackBarAsText(
                `Trigger '${name.value}' Status Updated Successfully`,
                '',
                { panelClass: 'success' }
              );
              DynamicPricingHandler.resetFormState(triggerFG, this.fb);
            },
            (error) => {
              this.loading = false;
            },
            this.handleFinal
          )
      );
    } else {
      triggerFG.patchValue({ status: event });
    }
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG?.controls as Record<
      'timeFA',
      AbstractControl
    > & {
      timeFA: FormArray;
    };
  }

  /**
   *
   * @param form of Perticular the Day Time Trigger
   */
  listenChanges(form: FormGroup) {
    const { hotelConfig, fromDate, toDate } = form.controls;
    const resetHMS = (control: AbstractControl, value: number) => {
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      control.patchValue(selectedDate.getTime(), { emitEvent: false });
    };

    fromDate.valueChanges.subscribe((res) => {
      resetHMS(fromDate, +res);
    });

    toDate.valueChanges.subscribe((res) => {
      resetHMS(toDate, +res);
    });

    const levelsFA = hotelConfig as FormArray;
    const resetSeconds = (
      value: number,
      control: AbstractControl,
      isEmit = true
    ) => {
      const newTime = new Date(value);
      newTime.setSeconds(0);
      control.patchValue(
        newTime.getTime() % (24 * 60 * 60 * 1000),
        isEmit && { emitEvent: false }
      );
      control.markAsDirty();
    };
    levelsFA.controls.forEach((levelFG: FormGroup) => {
      const { start, end, fromTime, toTime } = levelFG.controls;
      start.valueChanges.subscribe((res) => {
        validateConfig(levelsFA);
      });

      end.valueChanges.subscribe((res) => {
        validateConfig(levelsFA);
      });

      fromTime.valueChanges.subscribe((res) => {
        resetSeconds(+res, fromTime);
        resetSeconds(+res + 60 * 60 * 1000, toTime, false);
        validateConfig(levelsFA);
      });

      toTime.valueChanges.subscribe((res) => {
        resetSeconds(+res, toTime);
        validateConfig(levelsFA);
      });
    });
  }

  handleSave(form: FormGroup) {
    if (!this.dynamicPricingService.triggerValidate(form)) {
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
      'DAY_TIME_TRIGGER',
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
      this.getQueryConfig('DAY_TIME_TRIGGER'),
      id.value,
    ];

    this.$subscription.add(
      request(...requestParams).subscribe(
        (res) => {
          this.snackbarService.openSnackBarAsText(
            `Trigger '${
              form.get('type').value === 'add' ? 'Created ' : 'Updated '
            }' Successfully.`,
            '',
            { panelClass: 'success' }
          );
          DynamicPricingHandler.resetFormState(form, this.fb, res);
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
