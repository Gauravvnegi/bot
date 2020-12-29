import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { RequestService } from '../../services/request.service.js';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service.js';
import { Subscription } from 'rxjs';
import { RequestData, RequestConfig } from '../../data-models/request.model.js';
import { SnackBarService } from 'libs/shared/material/src/index.js';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  attachment: string;
  templates = {
    ids: []
  };
  hotelId = '5ef958ce-39a7-421c-80e8-ee9973e27b99';
  
  config: RequestConfig;

  ckeditorContent;
  public Editor = ClassicEditor;

  ckeConfig = {};
  notificationForm: FormGroup;

  visible = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  rooms: string[] = ['P001', 'P002', 'P003', 'P004', 'P005'];
  $subscription = new Subscription();

  @ViewChild('emailCsvReader') emailCsvReader: any;
  @ViewChild('roomCsvReader') roomCsvReader: any;
  @ViewChild('attachmentUpload') attachmentUpload: any;

  constructor(
    private _globalFilterService: GlobalFilterService,
    private _fb: FormBuilder,
    private _location: Location,
    private requestService: RequestService,
    private _snackbarService: SnackBarService
  ) { }

  ngOnInit(): void {
    this.registerListeners();
    this.initNotificationForm();
    this.getConfigData();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    // this.$subscription.add(
      this._globalFilterService
        .globalFilter$.subscribe((data) => {
        // debugger;
        // this.hotelId = data['filter'].queryValue[0].hotelId;
      })
    // );
  }

  initNotificationForm() {
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

  getConfigData() {
    this.config = new RequestConfig().deserialize({
      channels: {
        bot: {
          title: "Bot",
          options: [
            { label: 'Whatsapp', value: 'Whatsapp' },
            { label: 'Messenger', value: 'Messenger' },
            { label: 'Telegram', value: 'Telegram' }
          ],
        },
        email: {
          title: "Email"
        },
        sms: {
          title: "SMS"
        }
      },
      messageTypes: [
        { label: 'Precheckin', value: 'precheckin', templeteIds: [] },
        { label: 'Checkin', value: 'checkin', templeteIds: [] },
        { label: 'Checkout', value: 'checkout', templeteIds: [] },
      ]
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    //check for email regex before adding @to-do
    if ((value || '').trim()) {
      this.emailIds.patchValue(this.emailIds.value);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(emailToRemove): void {
    const allEmails = this.emailIds.value
      .filter((email) => email != emailToRemove);
    this.emailIds.patchValue(allEmails);
    if (!allEmails.length) {
      this.emailCsvReader.nativeElement.value = "";
    }
  }

  readEmailFromCSV($event: any): void {
    let files = $event.srcElement.files;  
  
    if (files[0].name.endsWith(".csv")) {
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
          this.emailIds.patchValue(csvArr.join(',').split(','));
        }
      };  
    } else {
      this.emailCsvReader.nativeElement.value = "";
    }
  }

  readRoomsFromCSV($event: any): void {
    let files = $event.srcElement.files;  
  
    if (files[0].name.endsWith(".csv")) {
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
          this.roomNumbers.patchValue(csvArr);
        }
      };  
    } else {
      this.roomCsvReader.nativeElement.value = "";
    }
  }

  readAttachments(event) {
    this.attachment = event.currentTarget.files[0].name;
    let formData = new FormData();
    formData.append('files', event.currentTarget.files[0]);
    this.requestService.uploadAttachments(this.hotelId, formData)
      .subscribe((response) => {
        this.attachment = response.fileName;
        this.notificationForm.get('attachments').patchValue([response.fileDownloadUri]);
      }, ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      });
  }

  goBack() {
    this._location.back();
  }

  changeTemplateIds(method): void {
    this.templates.ids.length = 0;
    let data = this.config.messageTypes.filter((d) => d.value === method);
    this.templates.ids = data['templateIds'];
  }

  sendMessage() {
    let validation = this.requestService.validateRequestData(
      this.notificationForm,
      !(this.isEmailChannel && this.isSocialChannel)
    );

    if (validation.length) {
      this._snackbarService.openSnackBarAsText(validation[0].data.message);
      return;
    }
    let values = new RequestData().deserialize(this.notificationForm.getRawValue());

    this.$subscription.add(
      this.requestService.createRequestData(this.hotelId, values)
        .subscribe((res) => {
          this._snackbarService.openSnackBarAsText('Notification sent.', '', { panelClass: 'success' });
          this._location.back();
        }, ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        })
    );
  }

  setRoomData(event) {
    if (event) {
      this.roomNumbers.patchValue(event.split(','));
    } else {
      this.roomNumbers.patchValue([]);
      this.roomCsvReader.nativeElement.value = ""; 
    }
  }

  modifyControl(event, control) {
    this.notificationForm.removeControl(control)
    if (event) {
      this.notificationForm.addControl(control, new FormControl([], Validators.required));
      return;
    }
    this.notificationForm.addControl(control, new FormControl([]));
  }

  changeSocialChannels(event) {
    this.social_channels.setValue(event);
  }

  get social_channels() {
    return this.notificationForm.get('social_channels') as FormControl;
  }

  get emailIds() {
    return this.notificationForm.get('emailIds') as FormControl;
  }

  get emailIdsList() {
    return this.emailIds.value;
  }

  get isSocialChannel() {
    return this.notificationForm.get('is_social_channel').value;
  }

  get isEmailChannel() {
    return this.notificationForm.get('is_email_channel').value;
  }

  get roomNumbers() {
    return this.notificationForm.get('roomNumbers');
  }

}
