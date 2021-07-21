import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-contact-sort-filter',
  templateUrl: './contact-sort-filter.component.html',
  styleUrls: ['./contact-sort-filter.component.scss'],
})
export class ContactSortFilterComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Output() filterApplied = new EventEmitter();
  sortList = [
    { label: 'Room Ascending', value: 'roomNo', order: 'ASC' },
    { label: 'Room Descending', value: 'roomNo', order: 'DESC' },
    { label: 'Name A -> Z', value: 'guestName', order: 'ASC' },
    { label: 'Name Z -> A', value: 'guestName', order: 'DESC' },
  ];

  filterData = ['Unread', 'Failed', 'Tags', 'Attachments'];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl([]));
    this.parentFG.addControl(
      'filterBy',
      this.fb.array(this.filterData.map((x) => false))
    );
  }

  applyFilter() {
    const values = this.parentFG.getRawValue();
    values.filterBy = this.convertFilterToValue();
    this.filterApplied.emit({
      status: true,
      data: { sort: values.sortBy.label, order: values.sortBy.order },
    });
  }

  setSortBy(item) {
    this.sortControl.setValue({ label: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  convertFilterToValue() {
    return this.filterFormArray.value
      .map((x, i) => x && this.filterData[i])
      .filter((x) => !!x);
  }

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.parentFG.controls.filterBy as FormArray;
  }
}
