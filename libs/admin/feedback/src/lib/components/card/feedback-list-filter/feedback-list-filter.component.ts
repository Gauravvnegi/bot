import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-feedback-list-filter',
  templateUrl: './feedback-list-filter.component.html',
  styleUrls: ['./feedback-list-filter.component.scss'],
})
export class FeedbackListFilterComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Output() filterApplied = new EventEmitter();
  @Output() close = new EventEmitter();
  sortList = [
    { label: 'Latest', value: '', order: '' },
    { label: 'Room Ascending', value: 'roomNo', order: 'ASC' },
    { label: 'Room Descending', value: 'roomNo', order: 'DESC' },
    { label: 'Function Code', value: 'itemCode', order: 'ASC' },
    // { label: 'SLA Low -> High', value: 'sla', order: 'ASC' },
  ];

  filterData = { status: ['ASAP', 'High', 'Medium'], department: [] };
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl([]));
    this.parentFG.addControl(
      'filterByStatus',
      this.fb.array(this.filterData.status.map((x) => false))
    );
  }

  applyFilter() {
    const values = this.parentFG.getRawValue();
    values.filterBy = this.convertFilterToValue();
    this.filterApplied.emit({
      status: true,
      data: {
        sort: values.sortBy.label,
        order: values.sortBy.order,
        priorityType: values.filterBy,
      },
    });
  }

  setSortBy(item) {
    this.sortControl.setValue({ label: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  convertFilterToValue() {
    return this.filterFormArray.value
      .map((x, i) => x && this.filterData.status[i])
      .filter((x) => !!x);
  }

  closeFilter() {
    this.close.emit();
  }

  clearFilter() {
    this.parentFG.patchValue({
      sortBy: [],
      filterBy: this.filterData.status.map((x) => false),
    });
  }

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.parentFG.controls.filterBy as FormArray;
  }
}
