import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { EmailList, Topics } from '../../data-models/email.model';
import { EmailService } from '../../services/email.service';
import { RequestService } from '../../services/request.service';
import { NotificationComponent } from '../notification/notification.component';
import { RequestConfig } from '../../data-models/request.model';

@Component({
  selector: 'hospitality-bot-marketing-notification',
  templateUrl: './marketing-notification.component.html',
  styleUrls: ['./marketing-notification.component.scss'],
})
export class MarketingNotificationComponent extends NotificationComponent
  implements OnInit, OnDestroy {
  emailFG: FormGroup;
  @Input() entityId: string;
  @Input() email: string;
  fromEmailList: Option[] = [];
  topicList: Option[] = [];
  templateList: Option[] = [];
  to: Option[] = [];
  attachmentsList: Option[] = [];
  selectedTemplate;
  separatorKeysCodes = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isSending = false;
  template = '';
  isTemplateDisabled = false;

  @ViewChild('attachmentComponent') updateAttachment: any;

  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    private _emailService: EmailService
  ) {
    super(
      _fb,
      _location,
      requestService,
      snackbarService,
      route,
      _adminUtilityService
    );
  }

  ngOnInit(): void {
    this.getConfigData(this.entityId);
  }

  getConfigData(entityId): void {
    this.requestService.getNotificationConfig(entityId).subscribe((response) => {
      this.config = new RequestConfig().deserialize(response);
      this.initFG();
      this.initOptions();
    });
  }

  initOptions() {
    this.topicList = this.config.messageTypes;
    this.getFromEmails();
    // this.getTemplateList();
  }

  initFG(): void {
    this.emailFG = this._fb.group({
      fromId: [''],
      emailIds: [[]],
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      templateId: [''],
      attachments: [[]],
    });
  }

  getFromEmails() {
    this._emailService.getFromEmail(this.entityId).subscribe((response) => {
      this.fromEmailList = new EmailList().deserialize(response);
      this.emailFG.get('fromId').setValue(this.fromEmailList[0].value);
    });
    this.to.push({
      label: this.email,
      value: this.email,
    });
    this.emailFG.get('emailIds').patchValue(this.to.map((item) => item.value));
  }

  fetchTemplate(event) {
    const topic = this.templateList.filter(
      (item) => item.value === event.value
    );
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        { templateType: topic[0].label },
      ]),
    };
    this.$subscription.add(
      this.requestService
        .getTemplate(this.entityId, event.value, config)
        .subscribe(
          (response) => {
            console.log(response);
            this.emailFG
              .get('message')
              .patchValue(this.modifyTemplate(response.template));
          },
          (error) => {
            this.emailFG.get('message').patchValue('');
          }
        )
    );
  }

  onTopicChange(selectedMessageType: string) {
    const topic = this.topicList.find(
      (type) => type.value === selectedMessageType
    );
    if (topic) {
      this.isTemplateDisabled = false;
      this.templateList = topic.templateIds.map((template) => ({
        label: template.name,
        value: template.id,
      }));
    } else {
      this.isTemplateDisabled = true;
      this.templateList = [];
    }
  }

  // getTopicList() {
  //   this.$subscription.add(
  //     this._emailService
  //       .getTopicList(this.entityId)
  //       .subscribe(
  //         (response) =>
  //           (this.topicList = new Topics().deserialize(response).records)
  //       )
  //   );
  // }

  // addEmail(event: MatChipInputEvent, control): void {
  //   const input = event.input;
  //   const value = event.value;

  //   // Add our keyword
  //   if ((value || '').trim()) {
  //     if (!this.isValidEmail(value)) {
  //       this.snackbarService.openSnackBarAsText('Invalid email format');
  //       return;
  //     } else {
  //       const controlValues = control.value.filter(
  //         (cValue) => cValue === value
  //       );
  //       if (!controlValues.length) {
  //         control.push(this._fb.control(value.trim()));
  //       }
  //     }
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  // removeEmail(keyword: any, control: FormArray): void {
  //   const index = control.value.indexOf(keyword);

  //   if (index >= 0) {
  //     control.removeAt(index);
  //   }
  // }

  getTemplateList(event) {
    console.log(event);
    this.$subscription.add(
      this._emailService
        .getTemplateByTopic(this.entityId, event.value)
        .subscribe((response) => {
          console.log(response);
          this.templateList = response.records;
          this.emailFG.get('templateId').setValue('');
        })
    );
    if (this.templateList.length === 0) {
      this.templateList.push({
        label: 'No Data',
        value: 'noData',
      });
      this.emailFG.get('templateId').setValue(this.templateList[0].value);
    }
  }

  // handleTemplateChange(event) {
  //   this.emailFG.get('message').patchValue(event.value.htmlTemplate);
  // }

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
        this.emailFG
          .get('attachments')
          .patchValue(this.attachmentsList.map((item) => item.value));
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

  sendMail() {
    if (this.emailFG.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.validation.INVALID_FORM',
          priorityMessage: 'Invalid Form.',
        })
        .subscribe();
      this.emailFG.markAllAsTouched();
      return;
    }
    const {
      fromId,
      emailIds,
      message,
      subject,
      previewText,
      topicId,
    } = this.emailFG.getRawValue();
    const reqData = {
      fromId,
      emailIds,
      message,
      subject,
      previewText,
      topicId,
    };
    delete reqData['tempalteId'];
    this.isSending = true;
    this.$subscription.add(
      this._emailService.sendEmail(this.entityId, reqData).subscribe(
        (response) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.EMAIL_SENT',
                priorityMessage: 'Email sent successfully.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
          this.onModalClose.emit();
        },
        ({ error }) => {},
        () => (this.isSending = false)
      )
    );
  }

  // handleOnFocus(event) {
  //   event.stopPropagation();
  // }

  // hanldeOnBlur(event) {
  //   event.stopPropagation();
  // }

  // get to() {
  //   return this.emailFG.get('emailIds') as FormArray;
  // }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
