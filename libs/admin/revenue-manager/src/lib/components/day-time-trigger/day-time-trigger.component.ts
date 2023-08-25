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

  listenChanges(form: FormGroup) {
    const { hotelConfig } = form.controls;
    const levelsFA = hotelConfig as FormArray;
    levelsFA.controls.forEach((levelFG: FormGroup) => {
      const { start, end, fromTime, toTime } = levelFG.controls;
      let customError = { min: 'Start should be < End.' };
      start.valueChanges.subscribe((res) => {
        this.errorValidate(start, end, customError, 'first');
        this.validateConfiguration(levelsFA);
      });

      end.valueChanges.subscribe((res) => {
        customError = { min: 'End Should be > Start' };
        this.errorValidate(start, end, customError, 'second');
        this.validateConfiguration(levelsFA);
      });

      fromTime.valueChanges.subscribe((res) => {
        customError = { min: 'From Time should be < To Time' };
        this.errorValidate(fromTime, toTime, customError, 'first');
        this.validateConfiguration(levelsFA);
      });

      toTime.valueChanges.subscribe((res) => {
        customError = { min: 'To Time should be > From Time' };
        this.errorValidate(fromTime, toTime, customError, 'second');
        this.validateConfiguration(levelsFA);
      });
    });
  }

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

  validateConfiguration(formArray: FormArray) {
    // TODO: Check all edge cases
    console.log('validating...');
    formArray.controls.forEach((form: FormGroup, index) => {
      const { start, end, fromTime, toTime } = form.controls;
      let timeCollide = false;
      let occupancyCollide = false;
      const collide = formArray.controls.find((item: FormGroup, itemIndex) => {
        const innerFromTimeValue = +item.get('fromTime').value;
        const innerStartValue = +item.get('start').value;
        if (itemIndex != index) {
          timeCollide =
            +fromTime.value < innerFromTimeValue &&
            +toTime.value > innerFromTimeValue;

          occupancyCollide =
            +start.value > innerStartValue && +end.value < innerStartValue;
        }

        return timeCollide || occupancyCollide;
      });

      if (collide) {
        start.markAllAsTouched();
        end.markAllAsTouched();
        fromTime.markAllAsTouched();
        toTime.markAllAsTouched();
      }
    });
  }

  handleSave(form: FormGroup) {
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
