import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'libs/shared/material/src';
import { RequestService } from '../../services/request.service';
import { NotificationComponent } from '../notification/notification.component';
import { FeedbackNotificationConfig } from '../../data-models/request.model';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-feedback-notification',
  templateUrl: './feedback-notification.component.html',
  styleUrls: [
    './feedback-notification.component.scss',
    '../notification/notification.component.scss',
  ],
})
export class FeedbackNotificationComponent extends NotificationComponent
  implements OnInit, OnDestroy {
  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected dialogConfig: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    super(
      _fb,
      _location,
      requestService,
      snackbarService,
      route,
      _adminUtilityService,
      dialogConfig,
      dialogRef
    );
    /**
     * @Remarks Extracting data from he dialog service
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit() {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.entityId = this.globalFilterService.entityId;
        //fetch-api for records
      })
    );
  }

  getConfigData(entityId): void {
    this.requestService
      .getNotificationConfig(entityId)
      .subscribe((response) => {
        this.config = new FeedbackNotificationConfig().deserialize(response);
        this.templates.entityId = entityId;
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

  handleChannelChange(event) {
    this.notificationForm.patchValue({ templateId: '', message: '' });
    this.templates.ids = this.config.templateIds.filter(
      (template) => template.title === event.value
    );
    if (event.value === 'Sms') {
      this.notificationForm.get('message').disable();
      return;
    }
    this.notificationForm.get('message').enable();
  }

  fetchTemplate(event) {
    this.notificationForm.patchValue({ templateId: event.value.id });
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        { templateType: event.value.name },
      ]),
    };
    this.$subscription.add(
      this.requestService
        .getTemplate(this.entityId, event.value.id, config)
        .subscribe((response) =>
          this.notificationForm
            .get('message')
            .patchValue(
              this.notificationForm.get('channel').value === 'email'
                ? this.modifyTemplate(response.template)
                : response.template
            )
        )
    );
  }

  sendMessage(): void {
    const validation = this.requestService.validateRequestData(
      this.notificationForm,
      false
    );

    if (
      this.notificationForm.get('channel').value === 'email' &&
      this.emailIds.value.length === 0
    ) {
      this.snackbarService.openSnackBarAsText('Please enter an email');
      return;
    }

    if (validation.length) {
      this.snackbarService.openSnackBarAsText(validation[0].data.message);
      return;
    }
    const data = this.notificationForm.getRawValue();
    const requestData = {
      templateId: data.templateId,
      roomNumbers: data.roomNumbers,
      sources: [data.channel],
      emailIds: data.emailIds,
      message: this.getTemplateMessage(data),
      messageType: 'TRANSACTIONAL',
    };
    this.isSending = true;
    this.$subscription.add(
      this.requestService
        .createRequestData(this.templates.entityId, requestData)
        .subscribe(
          (res) => {
            this.isSending = false;
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.SUCCESS.NOTIFICATION_SENT',
                  priorityMessage: 'Notification sent.',
                },
                '',
                { panelClass: 'success' }
              )
              .subscribe();
            this.closeModal();
          },
          ({ error }) => {
            this.isSending = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
