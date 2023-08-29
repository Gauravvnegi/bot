import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
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
    if (mode != Revenue.add) {
      const dayTimeFormArray = this.dynamicPricingControl.timeFA;
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
    let customError = { startLessthanEnd: true };
    levelsFA.controls.forEach((levelFG: FormGroup) => {
      const { start, end, fromTime, toTime } = levelFG.controls;
      start.valueChanges.subscribe((res) => {
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      end.valueChanges.subscribe((res) => {
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      fromTime.valueChanges.subscribe((res) => {
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      toTime.valueChanges.subscribe((res) => {
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });
    });
  }

  /**
   *
   * @param formArray should be the Array of the configuration
   * @returns configuration is valid or not
   */
  static validateConfiguration(formArray: FormArray): boolean | null {
    let collide = null;
    formArray.controls.forEach((form: FormGroup, index) => {
      if (!collide) {
        const { start, end, fromTime, toTime } = form.controls;
        let timeCollide = false;
        let occupancyCollide = false;
        collide = formArray.controls.find((item: FormGroup, itemIndex) => {
          const innerFromTimeValue = +item.get('fromTime').value;
          const innerStartValue = +item.get('start').value;
          if (itemIndex != index) {
            timeCollide =
              +fromTime.value < innerFromTimeValue &&
              +toTime.value > innerFromTimeValue;

            if (timeCollide) {
              occupancyCollide =
                +start.value < innerStartValue && +end.value > innerStartValue;
            }
          }
          return timeCollide || occupancyCollide;
        });
      }
    });

    if (collide) {
      const { start, end, fromTime, toTime } = collide.controls;
      start.setErrors({ collide: true });
      end.setErrors({ collide: true });
      fromTime.setErrors({ collide: true });
      toTime.setErrors({ collide: true });
      start.markAllAsTouched();
      end.markAllAsTouched();
      fromTime.markAllAsTouched();
      toTime.markAllAsTouched();
    } else {
      formArray.controls.forEach((form: FormGroup) => {
        const { start, end, fromTime, toTime } = form.controls;
        start.markAsUntouched();
        end.markAsUntouched();
        fromTime.markAsUntouched();
        toTime.markAsUntouched();
      });
    }
    return collide ? true : false;
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
