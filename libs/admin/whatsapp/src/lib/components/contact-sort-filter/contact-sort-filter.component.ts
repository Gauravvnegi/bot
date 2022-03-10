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
  @Output() filterClosed = new EventEmitter();
  sortList = [
    { label: 'Room Ascending', value: 'roomNo', order: 'ASC' },
    { label: 'Room Descending', value: 'roomNo', order: 'DESC' },
    { label: 'Name A -> Z', value: 'guestName', order: 'ASC' },
    { label: 'Name Z -> A', value: 'guestName', order: 'DESC' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl([]));
  }

  applyFilter() {
    const values = this.parentFG.getRawValue();
    this.filterApplied.emit({
      status: true,
      data: { sort: values.sortBy.label, order: values.sortBy.order },
    });
  }

  close() {
    this.filterClosed.emit();
  }

  setSortBy(item) {
    this.sortControl.setValue({ label: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  clearFilter() {
    this.parentFG.patchValue({ sortBy: [] });
  }

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.parentFG.controls.filterBy as FormArray;
  }
}
