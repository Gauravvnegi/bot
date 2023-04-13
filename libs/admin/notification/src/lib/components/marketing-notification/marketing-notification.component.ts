import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { EmailList, Topics } from '../../data-models/email.model';
import { EmailService } from '../../services/email.service';
import { RequestService } from '../../services/request.service';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'hospitality-bot-marketing-notification',
  templateUrl: './marketing-notification.component.html',
  styleUrls: ['./marketing-notification.component.scss'],
})
export class MarketingNotificationComponent extends NotificationComponent
  implements OnInit, OnDestroy {
  emailFG: FormGroup;
  @Input() hotelId: string;
  @Input() email: string;
  fromEmailList = [];
  topicList = [];
  templateList = [];
  selectedTemplate;
  separatorKeysCodes = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  isSending = false;
  template = '';
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
    this.initFG();
  }

  ngOnInit(): void {
    this.getFromEmails();
    this.getTopicList();
  }

  initFG(): void {
    this.emailFG = this._fb.group({
      fromId: ['', [Validators.required]],
      emailIds: this._fb.array([], Validators.required),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      templateId: [''],
    });
  }

  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) =>
          (this.fromEmailList = new EmailList().deserialize(response)) 
      )
    );
    this.to.push(this._fb.control(this.email));
  }

  getTopicList() {
    this.$subscription.add(
      this._emailService.getTopicList(this.hotelId).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records) 
      )
    );
  }

  addEmail(event: MatChipInputEvent, control): void {
    const input = event.input;
    const value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (!this.isValidEmail(value)) {
        this.snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter(
          (cValue) => cValue === value
        );
        if (!controlValues.length) {
          control.push(this._fb.control(value.trim()));
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(keyword: any, control: FormArray): void {
    const index = control.value.indexOf(keyword);

    if (index >= 0) {
      control.removeAt(index);
    }
  }

  handleTopicChange(event) {
    this.$subscription.add(
      this._emailService
        .getTemplateByTopic(this.hotelId, event.value)
        .subscribe((response) => {
          this.templateList = response.records;
          this.emailFG.get('templateId').setValue('');
        })
    );
  }

  handleTemplateChange(event) {
    this.emailFG.get('message').patchValue(event.value.htmlTemplate);
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
      this._emailService.sendEmail(this.hotelId, reqData).subscribe(
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

  handleOnFocus(event) {
    event.stopPropagation();
  }

  hanldeOnBlur(event) {
    event.stopPropagation();
  }

  get to() {
    return this.emailFG.get('emailIds') as FormArray;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
