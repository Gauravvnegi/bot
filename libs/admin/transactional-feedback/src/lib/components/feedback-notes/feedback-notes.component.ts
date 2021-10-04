import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { Feedback, Notes } from '../../data-models/feedback-datatable.model';

@Component({
  selector: 'hospitality-bot-feedback-notes',
  templateUrl: './feedback-notes.component.html',
  styleUrls: ['./feedback-notes.component.scss'],
})
export class FeedbackNotesComponent implements OnInit {
  @Input() feedback: Feedback;
  @Input() notes: Notes;
  @Input() timezone: string;
  @Output() onNotesClosed = new EventEmitter();
  viewOnly = false;
  notesFG: FormGroup;
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initFG();
  }

  initFG() {
    this.notesFG = this.fb.group({
      notes: [this.notes?.remarks || '', Validators.required],
    });
    if (this.notes?.remarks) {
      this.viewOnly = true;
      this.remarks?.disable();
    }
  }

  closeNotes() {
    this.onNotesClosed.emit({ status: false });
  }

  openEditForm() {
    this.viewOnly = false;
    this.remarks?.enable();
  }

  submit() {
    if (this.notesFG.invalid) {
      this.snackbarService.openSnackBarAsText('Please add remarks.');
      return;
    }
    this.onNotesClosed.emit({
      status: true,
      data: this.notesFG.getRawValue(),
      id: this.feedback.id,
    });
  }

  get remarks() {
    return this.notesFG.get('notes') as FormControl;
  }
}
