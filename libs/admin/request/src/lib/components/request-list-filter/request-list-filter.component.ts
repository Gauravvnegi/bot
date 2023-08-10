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
  filterData = request.filter;
  @Output() close = new EventEmitter();

  useForm: FormGroup;

  listData = request.listBy;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initFG();

    this.useForm = this.fb.group({
      sortBy: new FormControl({}),
      filterBy: this.fb.array(this.filterData.map((x) => false)),
      listType: new FormControl({}),
    });
  }

  /**
   * @function initFG To initialize form group.
   */
  initFG(): void {
    // this.parentFG.addControl('sortBy', new FormControl({}));
    // this.parentFG.addControl(
    //   'filterBy',
    //   this.fb.array(this.filterData.map((x) => false))
    // );
  }

  /**
   * @function applyFilter To handle filter submit.
   */
  applyFilter(): void {
    const values = this.useForm.getRawValue();
    values.filterBy = this.convertFilterToValue();
    this.filterApplied.emit({
      status: true,
      data: {
        sort: values.sortBy.label,
        order: values.sortBy.order,
        priorityType: values.filterBy,
        entityType: values.listType.label,
      },
    });
  }

  setListBy(item: { value: string; order: string }): void {
    this.listControl.setValue(
      {
        label: item.value,
        order: item.order,
      },
      { emitEvent: false }
    );
  }

  /**
   * @function setSortBy To set sort by control value.
   * @param item The sort data.
   */
  setSortBy(item: { value: string; order: string }): void {
    this.sortControl.setValue(
      { label: item.value, order: item.order },
      { emitEvent: false }
    );
    // this.parentFG.markAsTouched();
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
    const value = {
      sortBy: [],
      filterBy: this.filterData.map((x) => false),
    };
    // this.parentFG.patchValue(value);
    this.useForm.patchValue(value);

    this.applyFilter();
  }

  /****************************** Getters *******************************/

  get sortControl(): FormControl {
    return this.useForm?.get('sortBy') as FormControl;
  }

  get listControl(): FormControl {
    return this.useForm?.get('listType') as FormControl;
  }

  get filterFormArray(): FormArray {
    return this.useForm.controls.filterBy as FormArray;
  }
}
