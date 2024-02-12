import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { tableList } from '../../constants/guest-list.const';
import { BookingDetailService, Option } from '@hospitality-bot/admin/shared';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AddGuestForm } from '../../types/form';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletTableService } from '../../services/outlet-table.service';

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

  marketSegments = [
    {
      label: 'val',
      value: 'val',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private bookingDetailService: BookingDetailService,
    private snackbarService: SnackBarService,
    private formService: OutletFormService,
    private outletService: OutletTableService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.useForm = this.fb.group({
      tables: [[], Validators.required],
      personCount: [null, Validators.min(1)],
      guest: ['', Validators.required],
      marketSegment: ['', Validators.required],
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

    const formData = this.formService.getGuestFormData(
      this.useForm.getRawValue() as AddGuestForm
    );

    this.outletService.createReservation(formData).subscribe(
      (res) => {},
      (error) => {},
      () => {
        this.snackbarService.openSnackBarAsText('Guest Registered !', '', {
          panelClass: 'success',
        });
        this.close();
      }
    );
  }

  close() {
    this.onClose.emit(true);
  }
}
