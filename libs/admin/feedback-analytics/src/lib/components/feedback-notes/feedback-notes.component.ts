import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackBarService } from 'libs/shared/material/src';
import { feedback } from '../../constants/feedback';

@Component({
  selector: 'hospitality-bot-feedback-notes',
  templateUrl: './feedback-notes.component.html',
  styleUrls: ['./feedback-notes.component.scss'],
})
export class FeedbackNotesComponent implements OnInit {
  @Output() onNotesClosed = new EventEmitter();
  statusOptions = [
    { label: 'In-Progress', value: 'INPROGRESS' },
    { label: 'Closed', value: 'CLOSED' },
  ];
  notesFG: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG() {
    this.notesFG = this.fb.group({
      notes: [this.data?.feedback?.notes?.remarks || '', Validators.required],
      status: [this.data?.feedback?.status, Validators.required],
    });
  }

  closeNotes() {
    this.onNotesClosed.emit({ status: false });
  }

  openEditForm() {
    this.remarks?.enable();
  }

  submit() {
    if (this.notesFG.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.validation.notes_remarks',
          priorityMessage: 'Invalid form.',
        })
        .subscribe();
      return;
    }
    this.onNotesClosed.emit({
      status: true,
      data: this.notesFG.getRawValue(),
      id: this.data.feedback.id,
    });
  }

  get remarks() {
    return this.notesFG.get('notes') as FormControl;
  }

  get feedbackConfig() {
    return feedback;
  }
}
