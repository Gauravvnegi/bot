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
import { dayTimeResponse } from '../../constants/response.const';
import { DynamicPricingHandler } from '../../models/dynamic-pricing.model';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent {
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
    public fb: FormBuilder
  ) {}

  modifyTriggerFG(mode = Revenue.add, index?: number): void {
    this.modifyTriggerFGEvent.emit({ mode, index });
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
            res = dayTimeResponse; // remove after original data come
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

  triggerStatusChange($event, index) {
    console.log('hii');
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
    levelsFA.controls.forEach((levelFG: FormGroup) => {
      const { start, end, fromTime, toTime } = levelFG.controls;
      let customError = { min: 'Start should be < End.' };
      start.valueChanges.subscribe((res) => {
        this.errorValidate(start, end, customError, 'first');
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      end.valueChanges.subscribe((res) => {
        customError = { min: 'End Should be > Start' };
        this.errorValidate(start, end, customError, 'second');
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      fromTime.valueChanges.subscribe((res) => {
        customError = { min: 'From Time should be < To Time' };
        this.errorValidate(fromTime, toTime, customError, 'first');
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });

      toTime.valueChanges.subscribe((res) => {
        customError = { min: 'To Time should be > From Time' };
        this.errorValidate(fromTime, toTime, customError, 'second');
        DayTimeTriggerComponent.validateConfiguration(levelsFA);
      });
    });
  }

  /**
   *
   * @param first control
   * @param second control
   * @param customError message of the error
   * @param applyError in which side we want to apply error
   */
  errorValidate(
    first: AbstractControl,
    second: AbstractControl,
    customError: { min: string },
    applyError: 'first' | 'second'
  ) {
    const condition = +first.value > +second.value;
    if (applyError == 'first') {
      first.setErrors(condition ? customError : null);
      second.setErrors(condition && null);
    } else {
      first.setErrors(condition && null);
      second.setErrors(condition ? customError : null);
    }

    first.markAllAsTouched();
    second.markAllAsTouched();

    if (!condition) {
      first.markAsUntouched();
      second.markAsUntouched();
    }
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
    console.log(form);
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
