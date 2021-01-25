import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
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
import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { RequestConfig, RequestData } from '../../data-models/request.model.js';
import { RequestService } from '../../services/request.service.js';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  attachment: string;
  templates = {
    ids: [],
  };
  hotelId = '5ef958ce-39a7-421c-80e8-ee9973e27b99';

  @Input() config: RequestConfig;
  isSending: boolean = false;

  ckeditorContent;
  public Editor = ClassicEditor;

  ckeConfig = {};
  notificationForm: FormGroup;

  visible = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  $subscription = new Subscription();

  @ViewChild('emailCsvReader') emailCsvReader: any;
  @ViewChild('roomCsvReader') roomCsvReader: any;
  @ViewChild('attachmentUpload') attachmentUpload: any;

  constructor(
    private _fb: FormBuilder,
    private _location: Location,
    private requestService: RequestService,
    private _snackbarService: SnackBarService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    this.initNotificationForm();
    this.getConfigData();
  }

  private registerListeners(): void {
    this.listenForGlobalFilters();
  }

  private listenForGlobalFilters(): void {
    this.$subscription.add(
      this.route.queryParams.subscribe((params) => {
        this.hotelId = params['hotelId'];
        console.log(this.hotelId);
      })
    );
  }

  private initNotificationForm(): void {
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

  private getConfigData(): void {
    this.requestService
      .getNotificationConfig(this.hotelId)
      .subscribe((response) => {
        this.config = new RequestConfig().deserialize(response);
      });
  }

  private isValidEmail(email): RegExpMatchArray {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!email && typeof email === 'string' && email.match(emailRegex);
  }

  addChipElement(event: MatChipInputEvent, control: FormControl): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      if (control === this.emailIds && !this.isValidEmail(value)) {
        this._snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter((cValue) => cValue == value);
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
      (cValue) => cValue != valueToRemove
    );
    control.patchValue(controlValues);
    control === this.roomNumbers
      ? (this.roomCsvReader.nativeElement.value = '')
      : (this.emailCsvReader.nativeElement.value = '');
  }

  readDataFromCSV($event: any, control: FormControl): void {
    let files = $event.srcElement.files;

    if (files[0].name.endsWith('.csv')) {
      let input = $event.target;
      let reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = () => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let csvArr = [];
        for (let i = 1; i < csvRecordsArray.length; i++) {
          let curruntRecord = (<string>csvRecordsArray[i]).split(',');
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
    let formData = new FormData();
    formData.append('files', event.currentTarget.files[0]);
    this.requestService.uploadAttachments(this.hotelId, formData).subscribe(
      (response) => {
        this.attachment = response.fileName;
        this.notificationForm
          .get('attachments')
          .patchValue([response.fileDownloadUri]);
        this._snackbarService.openSnackBarAsText('Attachment uploaded', '', {
          panelClass: 'success',
        });
      },
      ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  goBack(): void {
    this._location.back();
  }

  changeTemplateIds(method): void {
    let data = this.config.messageTypes.filter((d) => d.value === method)[0];
    this.templates.ids = data['templateIds'];
    this.modifyControl(
      this.templates.ids && this.templates.ids.length > 0,
      'templateId'
    );
    this.notificationForm.get('message').patchValue('');
  }

  sendMessage(): void {
    let validation = this.requestService.validateRequestData(
      this.notificationForm,
      !(this.isEmailChannel || this.isSocialChannel)
    );

    if (validation.length) {
      this._snackbarService.openSnackBarAsText(validation[0].data.message);
      return;
    }
    this.isSending = true;
    let values = new RequestData().deserialize(
      this.notificationForm.getRawValue()
    );

    this.$subscription.add(
      this.requestService.createRequestData(this.hotelId, values).subscribe(
        (res) => {
          this.isSending = false;
          this._snackbarService.openSnackBarAsText('Notification sent.', '', {
            panelClass: 'success',
          });
          this._location.back();
        },
        ({ error }) => {
          this.isSending = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  fetchTemplate(templateId) {
    let journey = this.notificationForm.get('messageType').value;
    if (templateId) {
      this.$subscription.add(
        this.requestService
          .getTemplate(this.hotelId, templateId, journey.toUpperCase())
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

  private modifyControl(event: boolean, control: string): void {
    let formControl = this.notificationForm.get(control);
    formControl.setValue([]);
    event
      ? formControl.setValidators([Validators.required])
      : formControl.clearValidators();
    formControl.updateValueAndValidity();
  }

  changeSocialChannels(event: string[]): void {
    this.social_channels.setValue(event);
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
}
