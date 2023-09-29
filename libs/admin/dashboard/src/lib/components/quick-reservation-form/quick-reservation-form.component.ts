import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { BookingConfig } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';

@Component({
  selector: 'hospitality-bot-quick-reservation-form',
  templateUrl: './quick-reservation-form.component.html',
  styleUrls: ['./quick-reservation-form.component.scss'],
})
export class QuickReservationFormComponent implements OnInit {
  pageTitle = 'Add Item';
  navRoutes = [{ label: 'Add Item', link: './' }];

  loading: boolean = false;
  useForm: FormGroup;
  entityId: string;
  isSidebar = false;
  @Output() onCloseSidebar = new EventEmitter();
  configData: BookingConfig;

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private router: Router,
    private configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.getData();
  }

  getData() {
    this.getCountryCode();
  }

  initForm() {
    this.useForm = this.fb.group({
      from: [''],
      to: [''],
      rooms: [[]],
      marketSegment: [''],
      adultCount: [''],
      childCount: [''],
      bookingSource: [''],
      bookingSourceName: [''],
      specialInstructions: [''],
      price: [''],
    });
  }

  close(): void {
    this.onCloseSidebar.emit();
  }

  editForm() {}

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
      });
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = this.useForm.getRawValue();
    this.loading = true;
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Service Created successfully`,
      '',
      { panelClass: 'success' }
    );
    this.onCloseSidebar.emit();
  };

  handleError = (error) => {
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }
}
