import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { SnackBarService } from 'libs/shared/material/src/index.js';
import { Subscription } from 'rxjs';
// import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { RequestConfig, RequestData } from '../../data-models/request.model.js';
import { RequestService } from '../../services/request.service.js';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnDestroy {
  templateData: string;
  attachment: string;
  templates = {
    ids: [],
    entityId: '',
  };
  @Input() entityId;
  @Input() channel;
  @Input() isEmail;
  @Input() email;
  @Input() roomNumber;
  config;
  @Input() isModal = false;
  @Output() onModalClose = new EventEmitter();
  isSending = false;

  ckeditorContent;
  // public Editor = ClassicEditor;

  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  notificationForm: FormGroup;

  visible = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  $subscription = new Subscription();

  @ViewChild('emailCsvReader') emailCsvReader: any;
  @ViewChild('roomCsvReader') roomCsvReader: any;
  @ViewChild('attachmentUpload') attachmentUpload: any;

  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService,
    protected dialogConfig: DynamicDialogConfig,
    protected dialogRef: DynamicDialogRef
  ) {
    /**
     * @Remarks Extracting data from he dialog service
     */
    if (this.dialogConfig?.data) {
      Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
        this[key] = value;
      });
    }
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForRouteParams();
  }

  private listenForRouteParams(): void {
    if (this.isModal) {
      this.getConfigData(this.entityId);
      this.templates.entityId = this.entityId;
    } else {
      this.$subscription.add(
        this.route.queryParams.subscribe((params) => {
          if (params) {
            this.templates.entityId = params['entityId'];
            if (params['channel']) {
              this.social_channels.patchValue([params['channel']]);
              this.notificationForm.get('is_social_channel').patchValue(true);
            }
            if (params['roomNumber']) {
              this.roomNumbers.patchValue([params['roomNumber']]);
            }
            this.getConfigData(params['entityId']);
          }
        })
      );
    }
  }

  protected initNotificationForm(): void {
    if (this.isModal) {
      this.notificationForm = this._fb.group({
        social_channels: [this.channel ? [this.channel] : []],
        is_social_channel: [this.channel ? true : false, Validators.required],
        is_email_channel: [this.isEmail, Validators.required],
        is_sms_channel: [false, Validators.required],
        messageType: ['', Validators.required],
        templateId: [],
        attachments: [[]],
        message: [''],
        emailIds: [this.isEmail ? [this.email] : []],
        roomNumbers: [this.roomNumber ? [this.roomNumber] : []],
      });
    } else {
      this.notificationForm = this._fb.group({
        social_channels: [[]],
        is_social_channel: [false, Validators.required],
        is_email_channel: [false, Validators.required],
        is_sms_channel: [false, Validators.required],
        messageType: ['', Validators.required],
        templateId: [],
        attachments: [[]],
        message: [''],
        emailIds: [[]],
        roomNumbers: [[]],
      });
    }
  }

  getConfigData(entityId): void {
    this.requestService
      .getNotificationConfig(entityId)
      .subscribe((response) => {
        this.config = new RequestConfig().deserialize(response);
        this.initNotificationForm();
      });
  }

  isValidEmail(email): RegExpMatchArray {
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!email && typeof email === 'string' && email.match(emailRegex);
  }

  addChipElement(event: MatChipInputEvent, control: FormControl): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (control === this.emailIds && !this.isValidEmail(value)) {
        this.snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter(
          (cValue) => cValue === value
        );
        if (!controlValues.length) {
          control.patchValue([...control.value, ...[value]]);
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeChipElement(valueToRemove: string, control: FormControl): void {
    const controlValues = control.value.filter(
      (cValue) => cValue !== valueToRemove
    );
    control.patchValue(controlValues);
    control === this.roomNumbers
      ? (this.roomCsvReader.nativeElement.value = '')
      : this.emailCsvReader
      ? (this.emailCsvReader.nativeElement.value = '')
      : '';
  }

  readDataFromCSV($event: any, control: FormControl): void {
    const files = $event.srcElement.files;

    if (files[0].name.endsWith('.csv')) {
      const input = $event.target;
      const reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        const csvData = reader.result;
        const csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        const csvArr = [];
        for (let i = 1; i < csvRecordsArray.length; i++) {
          const curruntRecord = (<string>csvRecordsArray[i]).split(',');
          if (curruntRecord[0].trim()) {
            csvArr.push(curruntRecord[0].trim());
          }
        }
        if (csvArr.length) {
          control.patchValue(csvArr.join(',').split(','));
        }
      };
    } else {
      control === this.roomNumbers
        ? (this.roomCsvReader.nativeElement.value = '')
        : (this.emailCsvReader.nativeElement.value = '');
    }
  }

  uploadAttachments(event): void {
    const formData = new FormData();
    formData.append('files', event.currentTarget.files[0]);
    this.requestService
      .uploadAttachments(this.templates.entityId, formData)
      .subscribe(
        (response) => {
          this.attachment = response.fileName;
          this.notificationForm
            .get('attachments')
            .patchValue([response.fileDownloadUri]);
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.ATTACHMENT_UPLOADED',
                priorityMessage: 'Attachment uploaded.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
        },
        ({ error }) => {}
      );
  }

  goBack(): void {
    this._location.back();
  }

  changeTemplateIds(method): void {
    const data = this.config.messageTypes.filter((d) => d.value === method)[0];
    this.templates.ids = data['templateIds'];
    this.modifyControl(
      this.templates.ids && this.templates.ids.length > 0,
      'templateId'
    );
    this.notificationForm.get('message').patchValue('');
  }

  sendMessage(): void {
    const validation = this.requestService.validateRequestData(
      this.notificationForm,
      !(this.isEmailChannel || this.isSocialChannel)
    );

    if (validation.length) {
      this.snackbarService.openSnackBarAsText(validation[0].data.message);
      return;
    }
    this.isSending = true;
    const values = new RequestData().deserialize(
      this.notificationForm.getRawValue()
    );

    if (values.templateId.length === 0) {
      values.templateId = '';
    }

    this.$subscription.add(
      this.requestService
        .createRequestData(this.templates.entityId, values)
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
            this.isModal ? this.closeModal() : this._location.back();
          },
          ({ error }) => {
            this.isSending = false;
          }
        )
    );
  }

  fetchTemplate(templateId) {
    if (templateId) {
      const config = {
        queryObj: this._adminUtilityService.makeQueryParams([
          {
            journey: this.notificationForm
              .get('messageType')
              .value.toUpperCase(),
          },
        ]),
      };
      this.$subscription.add(
        this.requestService
          .getTemplate(this.templates.entityId, templateId, config)
          .subscribe(
            (response) => {
              this.notificationForm
                .get('message')
                .patchValue(this.modifyTemplate(response.template));
            },
            ({ error }) => {}
          )
      );
    }
  }

  private modifyControl(event: boolean, control: string): void {
    const formControl = this.notificationForm.get(control);
    formControl.setValue([]);
    event
      ? formControl.setValidators([Validators.required])
      : formControl.clearValidators();
    formControl.updateValueAndValidity();
  }

  changeSocialChannels(event: string[]): void {
    this.social_channels.setValue(event);
  }

  closeModal() {
    this.onModalClose.emit(true);
    this.dialogRef.close(true);
  }

  modifyTemplate(template: string) {
    this.templateData = template;
    return template.substring(
      template.indexOf('<div'),
      template.lastIndexOf('</body>')
    );
  }

  getTemplateMessage(data) {
    return data.channel === 'email'
      ? this.templateData.substring(0, this.templateData.indexOf('<div')) +
          data.message +
          this.templateData.substring(
            this.templateData.lastIndexOf('</body'),
            this.templateData.length
          )
      : data.message;
  }

  get social_channels(): FormControl {
    return this.notificationForm.get('social_channels') as FormControl;
  }

  get emailIds(): FormControl {
    return this.notificationForm.get('emailIds') as FormControl;
  }

  get isSocialChannel() {
    return this.notificationForm.get('is_social_channel').value;
  }

  get isEmailChannel() {
    return this.notificationForm.get('is_email_channel').value;
  }

  get roomNumbers(): FormControl {
    return this.notificationForm.get('roomNumbers') as FormControl;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
