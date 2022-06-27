import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

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
  constructor() {}

  ngOnInit(): void {
    this.statusType();
  }

  statusType() {
    if (this.rowDataStatus == 'TODO') this.type = 'INPROGRESS';
    else if (this.rowDataStatus === 'INPROGRESS') this.type = 'RESOLVED';
    else this.type = this.rowDataStatus;
  }

  updateStatus() {
    this.statusUpdate.emit({ statusType: this.type, id: this.guestId });
  }

  openDetailPage(event) {
    this.openDetail.emit(event);
  }
}
