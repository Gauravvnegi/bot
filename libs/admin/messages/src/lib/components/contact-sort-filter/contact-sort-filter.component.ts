import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-contact-sort-filter',
  templateUrl: './contact-sort-filter.component.html',
  styleUrls: ['./contact-sort-filter.component.scss'],
})
export class ContactSortFilterComponent implements OnInit {
  sortFilterFG: FormGroup;
  sortList = [
    { label: 'Latest', value: 'latest' },
    { label: 'Room Ascending', value: 'room-asc' },
    { label: 'Room Descending', value: 'room-desc' },
    { label: 'Phone No.', value: 'phone' },
    { label: 'Name A -> Z', value: 'name-asc' },
    { label: 'Name Z -> A', value: 'name-desc' },
  ];

  filterData = ['Unread', 'Failed', 'Tags', 'Attachments'];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.sortFilterFG = this.fb.group({
      sortBy: [[]],
      filterBy: this.fb.array(this.filterData.map((x) => false)),
    });
  }

  applyFilter() {
    const values = this.sortFilterFG.getRawValue();
    values.filterBy = this.convertFilterToValue();
    console.log(values);
  }

  setSortBy(value) {
    this.sortControl.setValue(value);
    this.sortFilterFG.markAsTouched();
  }

  convertFilterToValue() {
    return this.filterFormArray.value
      .map((x, i) => x && this.filterData[i])
      .filter((x) => !!x);
  }

  get sortControl(): FormControl {
    return this.sortFilterFG?.get('sortBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.sortFilterFG.controls.filterBy as FormArray;
  }
}
