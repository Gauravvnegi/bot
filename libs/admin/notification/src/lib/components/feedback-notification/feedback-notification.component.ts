import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'libs/shared/material/src';
import { RequestService } from '../../services/request.service';
import { NotificationComponent } from '../notification/notification.component';
import { FeedbackNotificationConfig } from '../../data-models/request.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';

@Component({
  selector: 'hospitality-bot-feedback-notification',
  templateUrl: './feedback-notification.component.html',
  styleUrls: [
    './feedback-notification.component.scss',
    '../notification/notification.component.scss',
  ],
})
export class FeedbackNotificationComponent extends NotificationComponent
  implements OnInit {
  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected _snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService
  ) {
    super(
      _fb,
      _location,
      requestService,
      _snackbarService,
      route,
      _adminUtilityService
    );
  }

  ngOnInit() {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        //fetch-api for records
      })
    );
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
        this.getConfigData(this.hotelId);
      }
    });
  }

  getConfigData(hotelId): void {
    this.requestService.getNotificationConfig(hotelId).subscribe((response) => {
      this.config = new FeedbackNotificationConfig().deserialize(response);
      this.templates.ids = this.config.templateIds;
      this.templates.hotelId = hotelId;
      this.initNotificationForm();
    });
  }

  initNotificationForm() {
    this.notificationForm = this._fb.group({
      channel: ['', Validators.required],
      templateId: ['', Validators.required],
      message: ['', Validators.required],
      emailIds: [this.email || []],
      roomNumbers: [[]],
    });
  }

  fetchTemplate(templateId) {
    if (templateId) {
      const config = {
        queryObj: this._adminUtilityService.makeQueryParams([
          { templateType: 'TRANSACTIONAL' },
        ]),
      };
      this.$subscription.add(
        this.requestService
          .getTemplate(this.hotelId, templateId, config)
          .subscribe(
            (response) => {
              this.notificationForm
                .get('message')
                .patchValue(response.template);
            },
            ({ error }) => {
              this._snackbarService.openSnackBarAsText(error.message);
            }
          )
      );
    }
  }

  sendMessage(): void {
    let validation = this.requestService.validateRequestData(
      this.notificationForm,
      false
    );

    if (
      this.notificationForm.get('channel').value === 'email' &&
      this.emailIds.value.length === 0
    ) {
      this._snackbarService.openSnackBarAsText('Please enter an email');
      return;
    }

    if (validation.length) {
      this._snackbarService.openSnackBarAsText(validation[0].data.message);
      return;
    }
    const data = this.notificationForm.getRawValue();
    const requestData = {
      templateId: data.templateId,
      roomNumbers: data.roomNumbers,
      sources: [data.channel],
      emailIds: data.emailIds,
      message: data.message,
      messageType: 'TRANSACTIONAL',
    };

    this.$subscription.add(
      this.requestService
        .createRequestData(this.templates.hotelId, requestData)
        .subscribe(
          (res) => {
            this.isSending = false;
            this._snackbarService.openSnackBarAsText('Notification sent.', '', {
              panelClass: 'success',
            });
            this.closeModal();
          },
          ({ error }) => {
            this.isSending = false;
            this._snackbarService.openSnackBarAsText(error.message);
          }
        )
    );
  }
}
