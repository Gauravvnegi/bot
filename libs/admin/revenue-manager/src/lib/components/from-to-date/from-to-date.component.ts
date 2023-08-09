import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-from-to-date',
  templateUrl: './from-to-date.component.html',
  styleUrls: ['./from-to-date.component.scss'],
})
export class FromToDateComponent implements OnInit {
  startMinDate = new Date();
  endMinDate = new Date();
  startMaxDate: Date;
  endMaxDate: Date;
  @Input() parentFG: FormGroup;

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
