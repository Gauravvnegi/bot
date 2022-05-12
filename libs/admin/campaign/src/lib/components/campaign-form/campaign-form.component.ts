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
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
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
  @Input() campaign: Campaign;
  @Output() changeStep = new EventEmitter();
  @Output() save = new EventEmitter();
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
    private _snackbarService: SnackBarService,
    private _emailService: EmailService,
    private _modalService: ModalService,
    private _router: Router,
    public globalFilterService: GlobalFilterService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.getFromEmails();
  }

  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) => {
          this.fromEmailList = new EmailList().deserialize(response);
        },
        ({ error }) => {
          this._snackbarService
            .openSnackBarWithTranslate({
              translateKey: '',
              priorityMessage: error.message,
            })
            .subscribe();
        }
      )
    );
  }

  goBack() {
    this.save.emit({ close: true });
  }

  sendTestCampaign() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const sendTestCampaignCompRef = this._modalService.openDialog(
      SendTestComponent,
      dialogConfig
    );
    sendTestCampaignCompRef.componentInstance.parentFG = this.campaignFG;

    this.$subscription.add(
      sendTestCampaignCompRef.componentInstance.closeSendTest.subscribe(
        (response) => {
          if (response.status) {
            const reqData = this._emailService.createRequestData(
              this.campaignFG.getRawValue()
            );
            reqData.message = this.getTemplateMessage(reqData);
            this.$subscription.add(
              this._emailService.sendTest(this.hotelId, reqData).subscribe(
                (response) => {
                  this._snackbarService
                    .openSnackBarWithTranslate(
                      {
                        translateKey: 'messages.success.sendTestcampaign',
                        priorityMessage: 'Campaign sent to test email(s)',
                      },
                      '',
                      {
                        panelClass: 'success',
                      }
                    )
                    .subscribe();
                },
                ({ error }) => {
                  this._snackbarService
                    .openSnackBarWithTranslate({
                      translateKey: '',
                      priorityMessage: error.message,
                    })
                    .subscribe();
                }
              )
            );
          }
          sendTestCampaignCompRef.close();
        }
      )
    );
  }

  archiveCampaign() {
    this.$subscription.add(
      this.campaignService
        .archiveCampaign(this.hotelId, {}, this.campaignId)
        .subscribe(
          (response) => {
            this._snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.success.campaignArchived',
                  priorityMessage: 'Campaign Archived',
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
          },
          ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
        )
    );
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
    this.template = this.modifyTemplate(event.value);
    this.campaignFG.get('message').patchValue(this.template);
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
    const reqData = this._emailService.createRequestData(
      this.campaignFG.getRawValue()
    );
    reqData.message = this.getTemplateMessage(reqData);
    reqData.isDraft = false;
    this.isSending = true;
    this.$subscription.add(
      this._emailService.sendEmail(this.hotelId, reqData).subscribe(
        (response) => {
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.success.campaignSent',
                priorityMessage: 'Campiagn Sent successfully',
              },
              '',
              {
                panelClass: 'success',
              }
            )
            .subscribe();
          this._router.navigate(['pages/marketing/campaign']);
        },
        ({ error }) => {
          this._snackbarService
            .openSnackBarWithTranslate({
              translateKey: 'messages.error.loadData',
              priorityMessage: error.message,
            })
            .subscribe();
        },
        () => (this.isSending = false)
      )
    );
  }

  updateFieldData(event, control) {
    if (event.action == 'add') control.push(new FormControl(event.value));
    else control.removeAt(event.value);
    this.autoSave();
  }

  enableEmailControl(event, controlName: string) {
    event.stopPropagation();
    this.campaignFG.addControl(controlName, new FormArray([]));
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
  }

  openAddContent() {
    this.changeStep.emit({ step: 'next' });
  }
  
  autoSave(){
    this.save.emit();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
