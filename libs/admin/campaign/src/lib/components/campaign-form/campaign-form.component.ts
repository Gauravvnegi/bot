import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Campaign } from '../../data-model/campaign.model';
import { EmailList } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';
import { SendTestComponent } from '../send-test/send-test.component';

@Component({
  selector: 'hospitality-bot-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
})
export class CampaignFormComponent implements OnInit {
  @Input() hotelId: string;
  @Input() campaignId: string;
  @Input() campaignFG: FormGroup;
  @Output() changeStep = new EventEmitter();
  campaign: Campaign;
  templateData = '';
  templateList = [];
  fromEmailList = [];
  isSending = false;
  visible: boolean = true;
  private $subscription = new Subscription();
  enableDropdown = false;
  template = '';
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  constructor(
    private location: Location,
    private _snackbarService: SnackBarService,
    private _emailService: EmailService,
    private _modalService: ModalService,
    private _campaignService: CampaignService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getFromEmails();
  }

  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) => {
          this.fromEmailList = new EmailList().deserialize(response);
          this.getTemplateId();
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.campaignId = params['id'];
          this.getCampaignDetails(this.campaignId);
        }
      })
    );
  }

  getCampaignDetails(id) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.hotelId, id)
        .subscribe((response) => {
          this.campaign = new Campaign().deserialize(response);
          this.campaignFG.patchValue(this.campaign);
          this._campaignService
            .getReceiversFromData(this.campaign.receivers, this.hotelId)
            .forEach((receiver) => this.to.push(new FormControl(receiver)));
        })
    );
  }

  goBack() {
    this.location.back();
  }

  sendTestCampaign() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const sendTestCampaignCompRef = this._modalService.openDialog(
      SendTestComponent,
      dialogConfig
    );

    this.$subscription.add(
      sendTestCampaignCompRef.componentInstance.closeSendTest.subscribe(
        (response) => {
          if (response.status) console.log('Send Test', response.email);
          sendTestCampaignCompRef.close();
        }
      )
    );
  }

  archiveCampaign() {}

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
    this.template = this.modifyTemplate(event.value);
    this.campaignFG.get('message').patchValue(this.template);
    this.autoSave();
  }

  modifyTemplate(template: string) {
    this.templateData = template;
    if (template.indexOf('<div') != -1)
      return template.substring(
        template.indexOf('<div'),
        template.lastIndexOf('</body>')
      );
    else return template;
  }

  getTemplateMessage(data) {
    if (this.templateData.indexOf('<div'))
      return (
        this.templateData.substring(0, this.templateData.indexOf('<div')) +
        data.message +
        this.templateData.substring(
          this.templateData.lastIndexOf('</body'),
          this.templateData.length
        )
      );
    else return data.message;
  }

  sendMail() {
    if (this.campaignFG.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid form.');
      this.campaignFG.markAllAsTouched();
      return;
    }
    const reqData = this.campaignFG.getRawValue();
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
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
        () => (this.isSending = false)
      )
    );
  }

  updateFieldData(event, control) {
    if (event.action == 'add') control.push(new FormControl(event.value));
    else {
      control.removeAt(
        control.value.indexOf((item) => item.text == event.value.text)
      );
    }
    console.log(this.campaignFG.getRawValue());
    this.autoSave();
  }

  enableEmailControl(event, controlName: string) {
    event.stopPropagation();
    this.campaignFG.addControl(
      controlName,
      new FormArray([], Validators.required)
    );
    this.disableDropdown();
  }

  get to() {
    return this.campaignFG.get('to') as FormArray;
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.disableDropdown();
  }

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(
    event: KeyboardEvent
  ) {
    this.disableDropdown();
  }

  disableDropdown() {
    this._emailService.disableDropdowns();
  }

  addPersonalization(value, controlName: string) {
    const control = this.campaignFG.get(controlName);
    control.setValue(control.value + value);
    this.autoSave();
  }

  openAddContent() {
    this.changeStep.emit({ step: 'next' });
  }

  autoSave() {
    console.log('Auto-Save');
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
