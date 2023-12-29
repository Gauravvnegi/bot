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
    { label: 'Pinned', value: 'isImportant', order: 'DESC' },
    { label: 'Muted', value: 'isMuted', order: 'DESC' },
  ];

  filterList = ['Pinned', 'Muted'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl([]));
    this.parentFG.addControl(
      'filterBy',
      this.fb.array(this.filterList.map((x) => false))
    );
  }

  applyFilter() {
    const values = this.parentFG.getRawValue();
    let data = {
      order: values.sortBy.order,
    };
    if (values.sortBy.label) data['sort'] = values?.sortBy?.label;
    if (values?.filterBy[0]) data['isImportant'] = true;
    if (values?.filterBy[1]) data['isMute'] = true;

    this.filterApplied.emit({
      status: true,
      data: data,
    });
  }

  close() {
    this.filterClosed.emit();
  }

  setSortBy(item) {
    this.sortControl.setValue({ label: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  setFilterBy(item) {
    this.filterControl.setValue({ label: item.value });
    this.parentFG.markAsTouched();
  }

  clearFilter() {
    this.parentFG.patchValue({
      sortBy: [],
      filterBy: this.filterList.map((item) => false),
    });
  }

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get filterControl(): FormControl {
    return this.parentFG?.get('filterBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.parentFG.controls.filterBy as FormArray;
  }
}
