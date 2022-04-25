import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
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
  implements OnInit {
  emailFG: FormGroup;
  @Input() hotelId: string;
  @Input() email: string;
  fromEmailList = [];
  topicList = [];
  templateList = [];
  selectedTemplate;
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  isSending = false;
  constructor(
    protected _fb: FormBuilder,
    protected _location: Location,
    protected requestService: RequestService,
    protected _snackbarService: SnackBarService,
    protected route: ActivatedRoute,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    private _emailService: EmailService
  ) {
    super(
      _fb,
      _location,
      requestService,
      _snackbarService,
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
    });
  }

  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) =>
          (this.fromEmailList = new EmailList().deserialize(response)),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
    this.to.push(this._fb.control(this.email));
  }

  getTopicList() {
    this.$subscription.add(
      this._emailService.getTopicList(this.hotelId).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  addEmail(event: MatChipInputEvent, control): void {
    let input = event.input;
    let value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (!this.isValidEmail(value)) {
        this._snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter((cValue) => cValue == value);
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
    let index = control.value.indexOf(keyword);

    if (index >= 0) {
      control.removeAt(index);
    }
  }

  handleTopicChange(event) {
    this.$subscription.add(
      this._emailService
        .getTemplateByTopic(this.hotelId, event.value)
        .subscribe((response) => {
          this.templateList = response;
        })
    );
  }

  handleTemplateChange(event) {
    this.emailFG.get('message').patchValue(this.modifyTemplate(event.value));
  }

  modifyTemplate(template: string) {
    this.templateData = template;
    return template.substring(
      template.indexOf('<div'),
      template.lastIndexOf('</body>')
    );
  }

  getTemplateMessage(data) {
    return (
      this.templateData.substring(0, this.templateData.indexOf('<div')) +
      data.message +
      this.templateData.substring(
        this.templateData.lastIndexOf('</body'),
        this.templateData.length
      )
    );
  }

  sendMail() {
    if (this.emailFG.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid form.');
      this.emailFG.markAllAsTouched();
      return;
    }
    const reqData = this.emailFG.getRawValue();
    reqData.message = this.getTemplateMessage(reqData);
    this.isSending = true;
    this.$subscription.add(
      this._emailService.sendEmail(this.hotelId, reqData).subscribe(
        (response) => {
          this._snackbarService.openSnackBarAsText(
            'Email sent successfully.',
            '',
            { panelClass: 'success' }
          );
          this.onModalClose.emit();
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
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
}
