import { ENTER, COMMA, J } from '@angular/cdk/keycodes';
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
  attachmentsList: {
    label: string;
    value: string;
    data: string | Blob;
  }[] = [];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isSending = false;
  template = '';
  isTemplateDisabled = true;
  reservationId: string = '';
  packageId: string = '';
  details: any;
  packageList: Option[] = [];

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
    this.getAllTemplates();
    this.getPackageList();
    this.initFG();
    this.listenForTemplateChange();
    this.listenForPackageChange();
    this.listenForAttachmentChange();
  }

  getPackageList() {
    this.details.amenitiesDetails.paidPackages.forEach((packageData) => {
      this.packageList.push({
        label: packageData?.name,
        value: packageData?.packageId,
      } as Option);
    });
  }

  getConfigData(entityId): void {
    this.requestService
      .getNotificationConfig(entityId)
      .subscribe((response) => {
        this.config = new RequestConfig().deserialize(response);
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
      packageId: [''],
      attachedFiles: [[]],
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

  getAllTemplates() {
    this.$subscription.add(
      this._emailService
        .getAllTemplates(this.entityId, {
          params: this._adminUtilityService.makeQueryParams([
            { channelType: 'EMAIL' },
            { allTemplates: 'true' },
          ]),
        })
        .subscribe(
          (response) => {
            this.templateList = response.templates.map((template) => ({
              label: template.label,
              value: template.name,
            }));
          },
          (error) => {
            this.emailFG.get('message').patchValue('');
          }
        )
    );
  }

  listenForTemplateChange() {
    this.emailFG.get('templateId').valueChanges.subscribe((res) => {
      this.emailFG.get('message').patchValue('', { emitEvent: false });
      this.emailFG.get('packageId').patchValue('', { emitEvent: false });
      if (res != 'PACKAGE_ACCEPT' && res != 'PACKAGE_REJECT') {
        this.getTemplateDetails(res);
      }
    });
  }

  listenForPackageChange() {
    this.emailFG.get('packageId').valueChanges.subscribe((res) => {
      this.packageId = res;
      this.getTemplateDetails(this.emailFG.get('templateId').value);
    });
  }

  getTemplateDetails(template) {
    this.$subscription.add(
      this._emailService
        .getTemplateDetails(this.entityId, {
          params: this._adminUtilityService.makeQueryParams([
            { templateType: template },
            { reservationId: this.reservationId },
            { packageId: this.packageId },
          ]),
        })
        .subscribe((response) => {
          this.emailFG.get('message').patchValue(response.template);
          this.emailFG.get('subject').patchValue(response.subject);
          response?.attachments &&
            this.emailFG
              .get('attachedFiles')
              .patchValue([response.attachments]);
        })
    );
  }

  get isPackageVisible() {
    return (
      this.emailFG.get('templateId').value === 'PACKAGE_ACCEPT' ||
      this.emailFG.get('templateId').value === 'PACKAGE_REJECT'
    );
  }

  // onTopicChange(selectedMessageType: string) {
  //   const topic = this.topicList.find(
  //     (type) => type.value === selectedMessageType
  //   );
  //   this.emailFG.get('templateId').patchValue('');
  //   this.templateList = [];
  //   if (topic && topic.templateIds) {
  //     this.isTemplateDisabled = false;
  //     this.templateList = topic.templateIds.map((template) => ({
  //       label: template.name,
  //       value: template.id,
  //     }));
  //   } else {
  //     this.isTemplateDisabled = true;
  //     this.templateList = [];
  //   }
  // }

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

  // getTemplateList(event) {
  //   console.log(event);
  //   this.$subscription.add(
  //     this._emailService
  //       .getTemplateByTopic(this.hotelId, event.value)
  //       .subscribe((response) => {
  //         console.log(response);
  //         this.templateList = response.records;
  //         this.emailFG.get('templateId').setValue('');
  //       })
  //   );
  //   if (this.templateList.length === 0) {
  //     this.templateList.push({
  //       label: 'No Data',
  //       value: 'noData',
  //     });
  //
  //     this.emailFG.get('templateId').setValue(this.templateList[0].value);
  //   }
  // }

  // handleTemplateChange(event) {
  //   this.emailFG.get('message').patchValue(event.value.htmlTemplate);
  // }
  uploadAttachments(event): void {
    this.attachmentsList.push({
      label: event.currentTarget.files[0].name,
      value: event.currentTarget.files[0].name,
      data: event.currentTarget.files[0],
    });

    this.emailFG
      .get('attachments')
      .patchValue(this.attachmentsList.map((item) => item.value));
  }

  listenForAttachmentChange() {
    this.emailFG.get('attachments').valueChanges.subscribe((res) => {
      this.attachmentsList = this.attachmentsList.filter((item) =>
        res.includes(item.value)
      );
    });
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
      message: htmlTemplate,
      subject,
      previewText,
      topicId,
      attachedFiles,
    } = this.emailFG.getRawValue();
    const reqData = {
      fromId,
      emailIds,
      htmlTemplate,
      subject,
      previewText,
      topicId,
    };
    reqData['attachments'] = attachedFiles;
    // delete reqData['tempalteId'];

    const formData = new FormData();
    this.attachmentsList.forEach((attachment, index) => {
      const blobData = new Blob([attachment.data], {
        type: 'application/octet-stream',
      });
      formData.append('files', blobData, attachment.label);
    });

    formData.append('data', JSON.stringify(reqData));

    this.isSending = true;
    this.$subscription.add(
      this._emailService.sendEmail(this.entityId, formData).subscribe(
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
        ({ error }) => {
          this.isSending = false;
        },
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
