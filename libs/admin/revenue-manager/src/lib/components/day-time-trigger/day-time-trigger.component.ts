import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { Revenue } from '../../constants/revenue-manager.const';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';

@Component({
  selector: 'hospitality-bot-day-time-trigger',
  templateUrl: './day-time-trigger.component.html',
  styleUrls: ['./day-time-trigger.component.scss'],
})
export class DayTimeTriggerComponent implements OnInit {
  @Input() dynamicPricingFG: FormGroup;
  @Output() modifyTriggerFGEvent = new EventEmitter();
  @Output() modifyLevelFGEvent = new EventEmitter();
  weeks = weeks;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

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
