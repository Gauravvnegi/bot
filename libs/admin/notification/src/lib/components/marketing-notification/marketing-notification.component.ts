import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { EmailList, Topics } from '../../data-models/email.model';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-marketing-notification',
  templateUrl: './marketing-notification.component.html',
  styleUrls: ['./marketing-notification.component.scss'],
})
export class MarketingNotificationComponent implements OnInit {
  emailFG: FormGroup;
  @Input() hotelId: string = '5ef958ce-39a7-421c-80e8-ee9973e27b99';
  fromEmailList = [];
  topicList = [];
  templateList = [];
  selectedTemplate;
  private $subscription = new Subscription();
  separatorKeysCodes = [ENTER, COMMA];
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  addOnBlur: boolean = true;
  templateData: string;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  constructor(
    private _fb: FormBuilder,
    private _emailService: EmailService,
    private _snackbarService: SnackBarService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.getFromEmails();
    this.getTopicList();
  }

  initFG(): void {
    this.emailFG = this._fb.group({
      fromId: ['', [Validators.required]],
      emailIds: [[]],
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
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

  addEmail(event: MatChipInputEvent): void {
    let input = event.input;
    let value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (!this.isValidEmail(value)) {
        this._snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = this.emailIds.value.filter(
          (cValue) => cValue == value
        );
        if (!controlValues.length) {
          this.emailIds.patchValue([...this.emailIds.value, value.trim()]);
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(keyword: any): void {
    let index = this.emailIds.value.indexOf(keyword);

    if (index >= 0) {
      this.emailIds.patchValue(
        this.emailIds.value.filter((item) => item != keyword)
      );
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
    console.log(
      template.substring(
        template.indexOf('<div'),
        template.lastIndexOf('</body>')
      )
    );
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

  private isValidEmail(email): RegExpMatchArray {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!email && typeof email === 'string' && email.match(emailRegex);
  }

  get emailIds() {
    return this.emailFG.get('emailIds') as FormControl;
  }
}
