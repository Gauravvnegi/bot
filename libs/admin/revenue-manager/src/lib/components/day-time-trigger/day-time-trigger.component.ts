import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';
import { Revenue } from '../../constants/revenue-manager.const';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent {
  @Input() dynamicPricingFG: FormGroup;
  @Output() modifyTriggerFGEvent = new EventEmitter();
  @Output() modifyLevelFGEvent = new EventEmitter();
  weeks = weeks;

  modifyTriggerFG(mode = Revenue.add, index?: number): void {
    this.modifyTriggerFGEvent.emit({ mode, index });
  }

  modifyLevelFG(
    triggerFG: FormGroup,
    mode = Revenue.add,
    index?: number
  ): void {
    this.modifyLevelFGEvent.emit({ triggerFG, mode, index });
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG.controls as Record<
      'timeFA',
      AbstractControl
    > & {
      timeFA: FormArray;
    };
  }
}
