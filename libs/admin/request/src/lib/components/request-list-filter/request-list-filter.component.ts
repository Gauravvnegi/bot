import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { request } from '../../constants/request';
import { Option, UserService } from '@hospitality-bot/admin/shared';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';

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
  assignedToList: Option[] = [];
  @Output() close = new EventEmitter();
  entityId: string;

  useForm: FormGroup;

  listData = request.listBy;
  constructor(
    private fb: FormBuilder,
    private _managePermissionService: ManagePermissionService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.entityId = this._userService.getentityId();
    this.getAssignedToList();

    this.useForm = this.fb.group({
      sortBy: new FormControl({}),
      filterBy: this.fb.array(this.filterData.map((x) => false)),
      assignedTo: [''],
    });
  }

  getAssignedToList() {
    this._managePermissionService
      .getAllUsers(this.entityId, {
        params: '?status=true&mention=true',
      })
      .subscribe((data) => {
        this.assignedToList = data.users.map((item) => ({
          label: `${item.firstName} ${item.lastName}`,
          value: item.id,
        }));
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
        assignedTo: values.assignedTo,
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
