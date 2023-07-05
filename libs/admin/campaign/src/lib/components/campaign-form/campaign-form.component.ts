import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { Campaign } from '../../data-model/campaign.model';
import { EmailList } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';
import { SendTestComponent } from '../send-test/send-test.component';
import { TranslateService } from '@ngx-translate/core';
import { Option, NavRouteOptions } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-campaign-form',
  templateUrl: './campaign-form.component.html',
  styleUrls: ['./campaign-form.component.scss'],
})
export class CampaignFormComponent implements OnInit, OnDestroy {
  @Input() entityId: string;
  @Input() campaignId: string;
  @Input() campaignFG: FormGroup;
  @Input() campaign: Campaign;
  @Output() changeStep = new EventEmitter();
  @Output() save = new EventEmitter();
  templateData = '';
  templateList = [];
  fromEmailList: Option[] = [];
  isSending = false;
  visible = true;
  private $subscription = new Subscription();
  enableDropdown = false;
  template = '';
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  config = campaignConfig;
  draftDate: number | string = Date.now();
  pageTitle = 'Create Campaign';
  navRoutes: NavRouteOptions = [
    { label: 'Marketing', link: './' },
    { label: 'Campaign', link: '/pages/marketing/campaign' },
    { label: 'Create Campaign', link: './' },
  ];

  constructor(
    private snackbarService: SnackBarService,
    private _emailService: EmailService,
    private _modalService: ModalService,
    public globalFilterService: GlobalFilterService,
    private campaignService: CampaignService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (this.campaignId) {
      this.pageTitle = 'Edit Campaign';
      this.navRoutes[2].label = 'Edit Campaign';
    }
    this.draftDate = this.campaign?.updatedAt ?? this.campaign?.createdAt;
    this.getFromEmails();
  }

  /**
   * @function getFromEmail function to get email across particular hotel id.
   */
  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.entityId).subscribe(
        (response) => {
          this.fromEmailList = new EmailList()
            .deserialize(response)
            .map((item) => ({ label: item.email, value: item.id }));
        } 
      )
    );
  }

  /**
   * @function goBack function to go back to previous page.
   */
  goBack() {
    this.save.emit({ close: true });
  }

  /**
   *@function sendTestCampaign function to send test campaign email.
   */
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
              this._emailService.sendTest(this.entityId, reqData).subscribe(
                (response) => {
                  this.snackbarService
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
                }
              )
            );
          }
          sendTestCampaignCompRef.close();
        }
      )
    );
  }

  /**
   * @function archiveCampaign function to archive campaign.
   */
  archiveCampaign() {
    this.$subscription.add(
      this.campaignService
        .archiveCampaign(this.entityId, {}, this.campaignId)
        .subscribe(
          (response) => {
            this.snackbarService
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
          }
        )
    );
  }

  /**
   *@function getTemplateMessage function to get message from tempalate.
   */
  getTemplateMessage(data) {
    let message = data.message;
    if (
      !this.templateData.includes(
        `<img src="emailUrl" alt = "" width = "1" height = "1">`
      )
    )
      message += `<img src="emailUrl" alt="" width="1" height="1">`;
    return message;
  }

  /**
   * @function updateFieldData function to update form field data.
   * @param event event object for form control.
   */
  updateFieldData(event, control) {
    if (event.action === campaignConfig.add)
      control.push(new FormControl(event.value));
    else control.removeAt(event.value);
  }

  /**
   * @function enableEmailControl function to enable email control.
   * @param event event object for stop propogation.
   * @param controlName campaignFG
   */
  enableEmailControl(event, controlName: string) {
    event.stopPropagation();
    this.campaignFG.addControl(controlName, new FormArray([]));
    this.disableDropdown();
  }

  /**
   * @function to function to get 'to' value.
   */
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

  /**
   * @function disableDropdown function to disable dropdown.
   */
  disableDropdown() {
    this._emailService.disableDropdowns();
  }

  /**
   * @function addPersonalization function to add personalization.
   * @param controlName campaignFG
   */
  addPersonalization(value, controlName: string) {
    const control = this.campaignFG.get(controlName);
    control.setValue(control.value + value);
  }

  /**
   * @function openAddContent function to open add-content.
   */
  openAddContent() {
    this.changeStep.emit({ step: 'next' });
  }

  /**
   * @function ngOnDestroy unsubscribe subscriiption
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
