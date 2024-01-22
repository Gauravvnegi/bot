import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tableList } from '../../constants/guest-list.const';
import { BookingDetailService, Option } from '@hospitality-bot/admin/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-add-guest-list',
  templateUrl: './add-guest-list.component.html',
  styleUrls: ['./add-guest-list.component.scss'],
})
export class AddGuestListComponent implements OnInit {
  readonly tableOptions: Option[] = tableList;
  @Output() onClose = new EventEmitter<boolean>();

  useForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private bookingDetailService: BookingDetailService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      tables: [[], Validators.required],
      personCount: [, Validators.min(1)],
      guest: ['', Validators.required],
      segment: ['', Validators.required],
      checkIn: ['', Validators.required],
      checkOut: ['', Validators.required],
      remark: [''],
    });
  }

  fullReservation() {}

  openDetailsPage() {
    // TODO: Replace guestId
    this.bookingDetailService.openBookingDetailSidebar({
      guestId: '42ca7269-deef-4709-83fd-df34abb0cf7e',
      tabKey: 'guest_details',
    });
  }

  createReservation() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Invalid Form !');
      return;
    }

    this.snackbarService.openSnackBarAsText('Guest Registered !', '', {
      panelClass: 'success',
    });
    this.close();
  }

  close() {
    this.onClose.emit(true);
  }
}
