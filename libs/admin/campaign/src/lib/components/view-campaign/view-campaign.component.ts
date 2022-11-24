import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
import { MatDialogConfig } from '@angular/material/dialog';
import { SendTestComponent } from '../send-test/send-test.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-view-campaign',
  templateUrl: './view-campaign.component.html',
  styleUrls: ['./view-campaign.component.scss'],
})
export class ViewCampaignComponent implements OnInit, OnDestroy {
  private $subscription = new Subscription();
  globalQueries = [];
  fromEmailList = [];
  campaignId: string;
  campaignFG: FormGroup;
  hotelId: string;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  campaign: Campaign;
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private snackbarService: SnackBarService,
    public globalFilterService: GlobalFilterService,
    private _emailService: EmailService,
    private _campaignService: CampaignService,
    private activatedRoute: ActivatedRoute,
    private _modalService: ModalService,
    protected _translateService: TranslateService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.campaignFG.disable();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      from: ['', [Validators.required]],
      to: this._fb.array([], Validators.required),
      message: ['', [Validators.required]],
      subject: ['', [Validators.required, Validators.maxLength(200)]],
      previewText: ['', Validators.maxLength(200)],
      topicId: [''],
      status: [true],
      isDraft: [true],
      campaignType: [''],
      testEmails: this._fb.array([]),
      name: [''],
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        this.getFromEmails();
        this.getTemplateId();
      })
    );
  }

  /**
   * @function getFromEmail function to get email across particular hotel id.
   */
  getFromEmails() {
    this.$subscription.add(
      this._emailService.getFromEmail(this.hotelId).subscribe(
        (response) =>
          (this.fromEmailList = new EmailList().deserialize(response)),
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  /**
   * @function getTemplateId function to get template id.
   */
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

  /**
   * @function getCampaignDetails funcction to get campaign details.
   * @param id campaign id.
   */
  getCampaignDetails(id) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.hotelId, id)
        .subscribe((response) => {
          this.campaign = new Campaign().deserialize(response);
          if (this.campaign.cc)
            this.campaignFG.addControl('cc', this._fb.array([]));
          if (this.campaign.bcc)
            this.campaignFG.addControl('bcc', this._fb.array([]));
          this.setFormData();
        })
    );
  }

  /**
   * @function addElementToData function to add element to data.
   * @returns new promise value.
   */
  addElementToData() {
    return new Promise((resolve, reject) => {
      Promise.all([
        this.addFormArray('to', 'toReceivers'),
        this.addtestEmails(),
      ]).then((res) => resolve(res[1]));
    });
  }

  /**
   * @function setFormData function to set form data.
   */
  setFormData() {
    this.addElementToData().then((res) => {
      this.campaignFG.patchValue(res);
    });
  }

  /**
   * @function addFormArray function to add form array.
   * @param control campaignFG.
   * @param dataField have form data.
   */
  addFormArray(control, dataField) {
    return new Promise((resolve, reject) => {
      if (this.campaign[dataField]) {
        this.campaign[control] = [];
        if (!this.campaignFG.get(control))
          this.campaignFG.addControl(control, this._fb.array([]));
        this._campaignService
          .getReceiversFromData(this.campaign[dataField])
          .forEach((receiver) => {
            (this.campaignFG.get(control) as FormArray).push(
              new FormControl(receiver)
            );
          });
      }
      resolve(this.campaign);
    });
  }

  /**
   * @function addtestEmails function to add test emails.
   */
  addtestEmails() {
    return new Promise((resolve, reject) => {
      this.campaign.testEmails.forEach((item) =>
        (this.campaignFG.get('testEmails') as FormArray).push(
          new FormControl(item)
        )
      );
      resolve(this.campaign);
    });
  }

  /**
   * @function archieve function to archive a particular campaign.
   */
  archiveCampaign() {
    this.$subscription.add(
      this._campaignService
        .archiveCampaign(this.hotelId, {}, this.campaignId)
        .subscribe(
          (response) => {
            this.setDataAfterUpdate(response);
            this.snackbarService.openSnackBarWithTranslate(
              {
                translateKey: `messages.SUCCESS.CAMPAIGN_ARCHIVED`,
                priorityMessage: 'Campaign Archived.',
              },
              '',
              { panelClass: 'success' }
            );
          },
          ({ error }) => {
            this.snackbarService
              .openSnackBarWithTranslate({
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error.message,
              })
              .subscribe();
          }
        )
    );
  }

  /**
   * @function sendTestCampaign function to send test campaign email.
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
            this.$subscription.add(
              this._emailService.sendTest(this.hotelId, reqData).subscribe(
                (response) => {
                  this.setDataAfterUpdate(response);
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
                },
                ({ error }) => {
                  this.snackbarService
                    .openSnackBarWithTranslate({
                      translateKey: `messages.error.${error?.type}`,
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

  /**
   * @function setDataAfterUpdate function to set data after updating campaign data.
   * @param response that we receive after updating.
   */
  setDataAfterUpdate(response) {
    if (response?.value) {
      this.campaign = new Campaign().deserialize(response?.value);
    }
  }

  /**
   * @function goBack function to go-back to previous page.
   */
  goBack() {
    this.location.back();
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
