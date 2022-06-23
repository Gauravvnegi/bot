import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-list-filter',
  templateUrl: './feedback-list-filter.component.html',
  styleUrls: ['./feedback-list-filter.component.scss'],
})
export class FeedbackListFilterComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() hotelId: string;
  @Input() userList;
  @Output() filterApplied = new EventEmitter();
  @Output() close = new EventEmitter();
  sortList = card.sortList;
  $subscription = new Subscription();
  filterData = { department: [] };
  constructor(private fb: FormBuilder, private cardService: CardService) {}

  ngOnInit(): void {
    this.getDepartmentList();
  }

  getDepartmentList() {
    this.$subscription.add(
      this.cardService.getDepartmentList(this.hotelId).subscribe((response) => {
        this.filterData.department = response;
        this.initFG();
      })
    );
  }

  initFG(): void {
    this.parentFG.addControl('sortBy', new FormControl({}));
    this.parentFG.addControl('assignee', new FormControl(''));
    this.parentFG.addControl(
      'department',
      this.fb.array(this.filterData.department.map((x) => false))
    );
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
