import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { request } from '../../constants/request';

@Component({
  selector: 'hospitality-bot-request-list-filter',
  templateUrl: './request-list-filter.component.html',
  styleUrls: ['./request-list-filter.component.scss'],
})
export class RequestListFilterComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Output() filterApplied = new EventEmitter();
  sortList = request.sort;
  @Output() close = new EventEmitter();

  filterData = request.filter;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();
  }

  /**
   * @function initFG To initialize form group.
   */
  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl({}));
    this.parentFG.addControl(
      'filterBy',
      this.fb.array(this.filterData.map((x) => false))
    );
  }

  /**
   * @function applyFilter To handle filter submit.
   */
  applyFilter(): void {
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

  /**
   * @function setSortBy To set sort by control value.
   * @param item The sort data.
   */
  setSortBy(item: { value: string; order: string }): void {
    this.sortControl.setValue({ label: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  /**
   * @function convertFilterToValue To convert priority boolean array to string array.
   * @returns The selected priority.
   */
  convertFilterToValue(): string[] {
    return this.filterFormArray.value
      .map((x, i) => x && this.filterData[i])
      .filter((x) => !!x);
  }

  closeFilter() {
    this.close.emit();
  }

  clearFilter() {
    this.parentFG.patchValue({
      sortBy: [],
      filterBy: this.filterData.map((x) => false),
    });
  }

  /****************************** Getters *******************************/

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.parentFG.controls.filterBy as FormArray;
  }
}
