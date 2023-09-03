import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Revenue, weeks } from '../../constants/revenue-manager.const';
import { Subscription } from 'rxjs';
import { DynamicPricingService } from '../../services/dynamic-pricing.service';
import { ConfigType } from '../../types/dynamic-pricing.types';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  DynamicPricingFactory,
  DynamicPricingHandler,
  validateConfig,
} from '../../models/dynamic-pricing.model';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent implements OnInit {
  entityId: string;

  parentFG: FormGroup;
  loading = false;
  $subscription = new Subscription();

  @Input() set dynamicPricingFG(form: FormGroup) {
    this.parentFG = form;
    if (this.dynamicPricingControl?.timeFA) {
      this.loadTriggers();
    }
  }

  @Output() modifyTriggerFGEvent = new EventEmitter();
  @Output() modifyLevelFGEvent = new EventEmitter();
  weeks = weeks;

  get dynamicPricingFG() {
    return this.parentFG;
  }

  constructor(
    private dynamicPricingService: DynamicPricingService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private globalFilter: GlobalFilterService,
    public fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilter.entityId;
  }

  modifyTriggerFG(mode = Revenue.add, index?: number): void {
    const dayTimeFormArray = this.dynamicPricingControl.timeFA;
    if (mode != Revenue.add) {
      const { type } = (dayTimeFormArray.at(index) as FormGroup).controls;
      if (type.value == 'update') {
        this.loading = true;
        this.$subscription.add(
          this.dynamicPricingService
            .deleteDynamicPricing(dayTimeFormArray.at(index).get('id').value)
            .subscribe(
              (res) => {
                this.snackbarService.openSnackBarAsText(
                  ` Day/Time Trigger deleted Successfully.`,
                  '',
                  { panelClass: 'success' }
                );
                this.loadTriggers();
              },
              (error) => {
                this.loading = false;
              },
              this.handleFinal
            )
        );
      } else {
        dayTimeFormArray.removeAt(index);
      }
    } else {
      this.modifyTriggerFGEvent.emit({ mode, index });
      this.listenChanges(
        dayTimeFormArray.at(dayTimeFormArray.controls.length - 1) as FormGroup
      );
    }
  }

  modifyLevelFG(
    triggerFG: FormGroup,
    mode = Revenue.add,
    index?: number
  ): void {
    this.modifyLevelFGEvent.emit({ triggerFG, mode, index });
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
            if (!res.configDetails.length) {
              this.modifyTriggerFG(Revenue.add);
              this.listenChanges(
                this.dynamicPricingControl.timeFA.at(0) as FormGroup
              );
            } else {
              const triggerModel = new DynamicPricingHandler().deserialize(res);
              triggerModel.dataList.forEach((item, index) => {
                triggerModel.mapDayTimeTrigger(index, item, this);
              });
            }
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  triggerStatusChange(event: boolean, triggerFG: FormGroup) {
    const { id } = triggerFG.controls;
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
                'Status Updated Successfully',
                '',
                { panelClass: 'success' }
              );
              this.loadTriggers();
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
    const { hotelConfig } = form.controls;
    const levelsFA = hotelConfig as FormArray;
    const resetSeconds = (
      value: number,
      control: AbstractControl,
      isEmit = true
    ) => {
      const newTime = new Date(value);
      newTime.setSeconds(0);
      control.patchValue(newTime.getTime(), isEmit && { emitEvent: false });
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
            `Day/Time Trigger ${
              form.get('type').value === 'add' ? 'Created ' : 'Updated '
            } Successfully.`,
            '',
            { panelClass: 'success' }
          );
          this.loadTriggers();
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
