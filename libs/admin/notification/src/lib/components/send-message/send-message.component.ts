import { ENTER, COMMA } from '@angular/cdk/keycodes';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Location } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';
import { RequestConfig, RequestData, RequestMessageData } from '../../data-models/request.model';

@Component({
  selector: 'hospitality-bot-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.scss'],
})
export class SendMessageComponent implements OnInit {
  templates: Option[] = [];
  channels: Option[] = [];
  messageTypes: Option[] = [];
  rooms: Option[] = [];
  attachmentsList: Option[] = [];

  @Input() isEmail: boolean;
  @Input() entityId: string;
  @Input() channel: string;
  @Input() roomNumber: string;
  @Input() isModal: boolean;

  @Output() onModalClose = new EventEmitter();

  config: RequestConfig;
  attachment: string = '';

  isSending = false;
  isTemplateDisabled = true;

  messageFG: FormGroup;

  $subscription = new Subscription();
  @ViewChild('attachmentComponent') updateAttachment: any;

  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.getConfigData(this.entityId);
    // this.templates.entityId = this.entityId;
  }

  getConfigData(entityId): void {
    this.requestService.getNotificationConfig(entityId).subscribe((response) => {
      this.config = new RequestConfig().deserialize(response);
      this.initOptions();
      this.initNotificationForm();
    });
  }

  initOptions() {
    this.channels = [
      {
        label: this.config.channels.sms.label,
        value: this.config.channels.sms.title,
      },
    ];
    this.messageTypes = this.config.messageTypes;
    this.rooms = [{ label: this.roomNumber, value: this.roomNumber }];
  }

  onMessageTypeChange(selectedMessageType: string) {
    const messageType = this.messageTypes.find(
      (type) => type.value === selectedMessageType
    );
    if (messageType) {
      this.isTemplateDisabled = false;
      this.templates = messageType.templateIds.map((template) => ({
        label: template.name,
        value: template.id,
      }));
    } else {
      this.isTemplateDisabled = true;
      this.templates = [];
    }
  }

  goBack(): void {
    this._location.back();
  }

  protected initNotificationForm(): void {
    this.messageFG = this._fb.group({
      socialChannels: [[]],
      messageType: ['', Validators.required],
      roomNumbers: [[]],
      templateId: [''],
      message: [''],
      attachments: [[]],
    });
    this.messageFG.get('roomNumbers').setValue(this.rooms);
    this.messageFG.get('socialChannels').patchValue(this.channels.map(item=> item.value));
  }

  sendMessage() {
    if (this.messageFG.invalid) {
      this.messageFG.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }
    this.isSending = true;
    console.log(this.messageFG.getRawValue());
    // const values = new RequestData().deserialize(this.messageFG.getRawValue());
    const values = new RequestMessageData().deserialize(this.messageFG.getRawValue());
    if (values.templateId.length === 0) {
      values.templateId = '';
    }
    this.$subscription.add(
      this.requestService.createRequestData(this.entityId, values).subscribe(
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

  uploadAttachments(event): void {
    const formData = new FormData();
    formData.append('files', event.currentTarget.files[0]);
    this.requestService.uploadAttachments(this.entityId, formData).subscribe(
      (response) => {
        this.attachment = response.fileName;
        this.attachmentsList.push({
          label: response.fileName,
          value: response.fileDownloadUri,
        });
        this.setUpdatedOptions(this.attachmentsList);
        this.messageFG.get('attachments').patchValue(this.attachmentsList.map(item=> item.value));
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

  setUpdatedOptions(input: Option[]) {
    this.updateAttachment.menuOptions = input;
    this.updateAttachment.dictionary = input.reduce(
      (prev, { label, value }) => {
        prev[value] = label;
        return prev;
      },
      {}
    );
  }

  closeModal() {
    this.onModalClose.emit(true);
  }

  get templateId(): FormControl {
    return this.messageFG.get('templateId') as FormControl;
  }
}
