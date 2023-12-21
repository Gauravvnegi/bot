import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';

@Component({
  selector: 'hospitality-bot-exception',
  templateUrl: './exception.component.html',
  styleUrls: ['./exception.component.scss'],
})
/**
 * @remarks To be discarded
 */
export class ExceptionComponent {
  startMinDate = new Date();
  endMinDate = new Date();
  startMaxDate: Date;
  endMaxDate: Date;
  weeks = weeks;
  @Input() parentFG: FormGroup;
  @Input() price: number;
  @Output() removeAction = new EventEmitter();
  removeException() {
    this.removeAction.emit();
  }

  ngOnInit() {
    this.parentFG.get('fromDate')?.valueChanges.subscribe((res) => {
      if (this.parentFG.value.toDate < res)
        this.parentFG.patchValue({ toDate: '' }, { emitEvent: false });
      this.endMinDate = new Date(res);
    });

    this.parentFG.get('toDate')?.valueChanges.subscribe((res) => {
      this.startMaxDate = new Date(res);
      if (this.parentFG.value.fromDate > res)
        this.parentFG.patchValue({ fromDate: '' }, { emitEvent: false });
    });
  }
}
