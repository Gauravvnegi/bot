import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { feedback } from '../../../constants/feedback';
import { User } from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback-list-filter',
  templateUrl: './feedback-list-filter.component.html',
  styleUrls: ['./feedback-list-filter.component.scss'],
})
export class FeedbackListFilterComponent implements OnInit, OnDestroy {
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
    private globalFilterService: GlobalFilterService,
    private userService: UserService,
    private snackbarService: SnackBarService,
    private tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.listenForFeedbackTypeChanged();
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
      this.userService
        .getUserPermission(
          this.feedbackType === '' ? feedback.types.stay : this.feedbackType
        )
        .subscribe(
          (response) => {
            this.assigneeList = response.childUser;
            this.userService.userPermissions = response;
          }
        )
    );
  }

  getDepartmentList() {
    this.$subscription.add(
      this.cardService
        .getDepartmentList(
          this.hotelId,
          this.feedbackType === '' ? feedback.types.stay : this.feedbackType
        )
        .subscribe((response) => {
          this.addDepartmentControls(response);
          this.filterData.department = response;
        })
    );
  }

  addDepartmentControls(response) {
    if (this.parentFG.get('department')) {
      this.parentFG.patchValue({ department: response.map((key) => false) });
    } else
      this.parentFG.addControl(
        'department',
        this.fb.array(response.map((key) => false))
      );
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl({}));
    this.parentFG.addControl('assignee', new FormControl([]));
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
      .map((x, i) => x && this.filterData.department[i].entity)
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
