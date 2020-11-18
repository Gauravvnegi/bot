import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';

import * as ClassicEditor from '../../../../../../../apps/admin/src/assets/js/ckeditor/ckeditor.js';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { Location } from '@angular/common';

@Component({
  selector: 'hospitality-bot-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit {
  attachment: string;

  channelList = [
    { label: 'Whatsapp', name: 'Whatsapp' },
    { label: 'Messenger', name: 'Messenger' },
    { label: 'Telegram', name: 'Telegram' },
  ];

  messageTypeList = [
    { label: 'Precheckin', name: 'precheckin' },
    { label: 'Checkin', name: 'checkin' },
    { label: 'Checkout', name: 'checkout' },
  ];

  ckeditorContent;
  public Editor = ClassicEditor;

  ckeConfig = {};
  notificationForm: FormGroup;

  visible = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  rooms: string[] = ['P001', 'P002', 'P003', 'P004', 'P005'];

  @ViewChild('emailCsvReader') emailCsvReader: any;
  @ViewChild('roomCsvReader') roomCsvReader: any;
  @ViewChild('attachmentUpload') attachmentUpload: any;

  constructor(
    private _fb: FormBuilder,
    private _location: Location
  ) {
    this.initNotificationForm();
  }

  ngOnInit(): void {}

  initNotificationForm() {
    this.notificationForm = this._fb.group({
      social_channels: [''],
      is_social_channel: [false],
      is_email_channel: [false],
      is_sms_channel: [false],
      message_type: [],
      template_type: [],
      attachment: [],
      message_body: [],
      email_ids: [''],
      room_nos: [],
    });
  }

  addEmail(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    //check for email regex before adding @to-do
    if ((value || '').trim()) {
      this.email_ids.patchValue(this.email_ids.value.concat(',', value.trim()));
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(emailToRemove): void {
    const allEmails = this.email_ids.value
      .split(',')
      .filter((email) => email != emailToRemove)
      .join(',');
    this.email_ids.patchValue(allEmails);
    if (allEmails === '') {
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
          csvArr.push(curruntRecord[0].trim());
        }
        if (csvArr.length) {
          this.email_ids.patchValue(csvArr.join(','));
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
          this.room_nos.patchValue(csvArr);
        }
      };  
    } else {
      this.roomCsvReader.nativeElement.value = "";
    }
  }

  readAttachments(event) {
    this.attachment = event.currentTarget.files[0].name;
    this.notificationForm.get('attachment').patchValue(event.currentTarget.files[0]);
  }

  goBack() {
    this._location.back();
  }

  sendMessage() {
    let values = this.notificationForm.getRawValue();
    console.log(values);
  }

  setRoomData(event) {
    if (event) {
      this.notificationForm.get('room_nos').patchValue(event.split(','));
    } else {
      this.notificationForm.get('room_nos').patchValue([]);
      this.roomCsvReader.nativeElement.value = ""; 
    }
  }

  get social_channels() {
    return this.notificationForm.get('social_channels') as FormControl;
  }

  get email_ids() {
    return this.notificationForm.get('email_ids') as FormControl;
  }

  get emailIdsList() {
    return this.email_ids.value.split(',').filter((email) => email);
  }

  get isSocialChannel() {
    return this.notificationForm.get('is_social_channel').value;
  }

  get isEmailChannel() {
    return this.notificationForm.get('is_email_channel').value;
  }

  get room_nos() {
    return this.notificationForm.get('room_nos');
  }

}
