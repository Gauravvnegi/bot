import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CategoryFormValue } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  useForm: FormGroup;

  @Input() hotelId: string;
  @Output() onSave = new EventEmitter<CategoryFormValue>();

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useForm = this.fb.group({
      name: ['', Validators.required],
      active: [true, Validators.required],
      imageUrl: [''],
      description: ['', Validators.required],
    });
  }

  create() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    this.onSave.emit(this.useForm.getRawValue());
  }
}
