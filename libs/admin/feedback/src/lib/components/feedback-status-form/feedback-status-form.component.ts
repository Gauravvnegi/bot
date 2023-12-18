import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

@Component({
  selector: 'hospitality-bot-feedback-status-form',
  templateUrl: './feedback-status-form.component.html',
  styleUrls: ['./feedback-status-form.component.scss'],
})
export class FeedbackStatusFormComponent implements OnInit {
  @Input() rowDataStatus;
  @Input() guestId;
  @Input() feedbackStatusFG: FormGroup;
  @Input() getDepartmentAllowed: boolean;
  @Output() statusUpdate = new EventEmitter();
  @Output() openDetail = new EventEmitter();
  type: string;
  readonly convertToTitleCas = convertToTitleCase;

  constructor() {}

  ngOnInit(): void {
    this.statusType();
  }

  statusType() {
    if (this.rowDataStatus === 'TODO') this.type = 'IN_PROGRESS';
    else if (this.rowDataStatus === 'IN_PROGRESS') this.type = 'RESOLVED';
    else this.type = this.rowDataStatus;
  }

  updateStatus() {
    const { comment } = this.feedbackStatusFG.getRawValue();
    this.statusUpdate.emit({
      statusType: this.type,
      id: this.guestId,
      comment,
    });
  }

  openDetailPage(event) {
    this.openDetail.emit(event);
  }
}
