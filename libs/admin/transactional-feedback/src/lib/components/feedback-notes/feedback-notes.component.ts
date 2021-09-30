import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { Feedback, Remark } from '../../data-models/feedback-datatable.model';

@Component({
  selector: 'hospitality-bot-feedback-notes',
  templateUrl: './feedback-notes.component.html',
  styleUrls: ['./feedback-notes.component.scss'],
})
export class FeedbackNotesComponent implements OnInit {
  @Input() feedback: Feedback;
  @Input() remark: Remark;
  @Input() timezone: string;
  @Output() onNotesClosed = new EventEmitter();
  viewOnly = false;
  remarkFG: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initFG();
    if (this.remark.id) {
      this.viewOnly = true;
      this.remarkFG.get('remarks')?.disable();
    }
  }

  initFG() {
    this.remarkFG = this.fb.group({
      remarks: [this.remark.remarks || '', Validators.required],
    });
  }

  closeNotes() {
    this.onNotesClosed.emit({ status: false });
  }

  openEditForm() {
    this.viewOnly = false;
    this.remarkFG.get('remarks')?.enable();
  }

  submit() {
    if (this.remarkFG.invalid) {
      this.snackbarService.openSnackBarAsText('Please add remarks.');
      return;
    }
    this.onNotesClosed.emit({
      status: true,
      data: this.remarkFG.getRawValue(),
      id: this.feedback.id,
    });
  }
}
