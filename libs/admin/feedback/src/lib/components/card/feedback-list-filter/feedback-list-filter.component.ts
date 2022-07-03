import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { feedback } from '../../../constants/feedback';
import { User, UserList } from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback-list-filter',
  templateUrl: './feedback-list-filter.component.html',
  styleUrls: ['./feedback-list-filter.component.scss'],
})
export class FeedbackListFilterComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() hotelId: string;
  @Output() filterApplied = new EventEmitter();
  @Output() close = new EventEmitter();
  sortList = card.sortList;
  $subscription = new Subscription();
  filterData = { department: [] };
  globalQueries = [];
  assigneeList: User[];
  feedbackType: string;
  constructor(
    private fb: FormBuilder,
    private cardService: CardService,
    private _globalFilterService: GlobalFilterService,
    private userService: UserService,
    private _snackbarService: SnackBarService,
    private tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.listenForGlobalFilters();
    this.listenForFeedbackTypeChanged();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.feedbackType = this.getFeedbackType(
          data['filter'].value.feedback.feedbackType
        );
        this.getUserPermission();
        this.getDepartmentList();
      })
    );
  }

  /**
   * @function listenForFeedbackTypeChanged To listen the local tab change.
   */
  listenForFeedbackTypeChanged(): void {
    this.$subscription.add(
      this.tableService.$feedbackType.subscribe((response) => {
        if (this.feedbackType !== response) this.filterData.department = [];
        this.feedbackType = this.getFeedbackType(response);
        this.getUserPermission();
        this.getDepartmentList();
      })
    );
  }

  /**
   * @function getUserPermission function to get user permission details
   */
  getUserPermission() {
    this.$subscription.add(
      this.userService.getUserPermission(this.feedbackType).subscribe(
        (response) => {
          this.assigneeList = response.childUser;
          this.userService.userPermissions = response;
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getDepartmentList() {
    this.$subscription.add(
      this.cardService
        .getDepartmentList(this.hotelId, this.feedbackType)
        .subscribe((response) => {
          this.filterData.department = response;
          this.parentFG
            .get('department')
            .setValue(
              this.fb.array(this.filterData.department.map((x) => false))
            );
        })
    );
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl({}));
    this.parentFG.addControl('assignee', new FormControl([]));
    this.parentFG.addControl('department', this.fb.array([]));
  }

  applyFilter() {
    const values = this.parentFG.getRawValue();
    values.department = this.convertDepartmentFilterToValue();
    this.filterApplied.emit({
      status: true,
      data: {
        sort: values.sortBy.value,
        order: values.sortBy.order,
        department: values.department,
        assignee: values.assignee,
      },
    });
  }

  setSortBy(item) {
    this.sortControl.setValue({ value: item.value, order: item.order });
    this.parentFG.markAsTouched();
  }

  convertDepartmentFilterToValue() {
    return this.department.value
      .map((x, i) => x && this.filterData.department[i].id)
      .filter((x) => !!x);
  }

  closeFilter() {
    this.close.emit();
  }

  clearFilter() {
    this.parentFG.patchValue({
      sortBy: [],
      department: this.filterData.department.map((x) => false),
      assignee: '',
    });
  }

  setAssignee(event) {
    this.parentFG.patchValue({ assignee: event.value });
  }

  get sortControl(): FormControl {
    return this.parentFG?.get('sortBy') as FormControl;
  }

  get department(): FormArray {
    return this.parentFG.controls.department as FormArray;
  }

  getFeedbackType(type) {
    return type === feedback.types.both || '' ? feedback.types.stay : type;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
