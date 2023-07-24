import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { empty, interval, of, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { campaignConfig } from '../../constant/campaign';
import { Campaign } from '../../data-model/campaign.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';
import { ScheduleCampaignComponent } from '../schedule-campaign/schedule-campaign.component';

@Component({
  selector: 'hospitality-bot-camapaign-email',
  templateUrl: './edit-camapaign.component.html',
  styleUrls: ['./edit-camapaign.component.scss'],
})
export class EditCampaignComponent implements OnInit, OnDestroy {
  campaignId: string;
  campaignFG: FormGroup;
  scheduleFG: FormGroup;
  templateData = '';
  entityId: string;
  templateList = [];
  globalQueries = [];
  fromEmailList = [];
  isSending = false;
  visible = true;
  private $subscription = new Subscription();
  enableDropdown = false;
  template = '';
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  campaign: Campaign;
  createContentType = '';
  datamapped = true;

  @ViewChild('stepper') stepper: MatStepper;

  private $autoSaveSubscription = new Subscription();
  private $formChangeDetection = new Subscription();
  constructor(
    private location: Location,
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private _campaignService: CampaignService,
    private _emailService: EmailService,
    private snackbarService: SnackBarService,
    private _router: Router,
    protected _translateService: TranslateService,
    private _modalService: ModalService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.campaignFG = this._fb.group({
      id: [''],
      name: ['', [Validators.required]],
      templateId: ['', Validators.required],
      from: ['', [Validators.required]],
      to: this._fb.array([], Validators.required),
      message: ['', [Validators.required]],
      subject: [
        '',
        [
          Validators.required,
          Validators.maxLength(campaignConfig.validator.length),
        ],
      ],
      previewText: ['', Validators.maxLength(campaignConfig.validator.length)],
      topicId: ['', Validators.required],
      status: [true],
      isDraft: [true],
      campaignType: [''],
      testEmails: this._fb.array([]),
      active: [true],
    });
    this.scheduleFG = this._fb.group({
      scheduleDate: [0, Validators.required],
      time: ['', Validators.required],
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
        this.entityId = this.globalFilterService.entityId;
        this.getTemplateId();
      })
    );
  }

  /**
   * @function getTemplateId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.campaignId = params['id'];
          this.datamapped = false;
          this.getCampaignDetails(this.campaignId);
        } else this.listenForFormChanges();
      })
    );
  }

  /**
   * @function listenForFormChanges Save campaign form data on change after 20sec interval.
   */
  listenForFormChanges() {
    this.$formChangeDetection = this.campaignFG.valueChanges
      .pipe(
        debounceTime(campaignConfig.autosave.time),
        switchMap((formValue) => {
          if (this.datamapped)
            return this.autoSave(formValue).pipe(
              catchError((err) => {
                return empty();
              })
            );
          return of(null);
        })
      )
      .subscribe((response) => {
        if (this.campaignId) {
          console.log('Saved');
          this.setDataAfterUpdate(response);
        } else {
          this.campaignFG.patchValue({ id: response.id });
          this.campaignId = response.id;
          this.location.replaceState(
            `/pages/marketing/campaign/edit/${response.id}`
          );
          this.setDataAfterSave(response);
        }
        this.$formChangeDetection.unsubscribe();
        this.listenForAutoSave();
      });
  }

  /**
   * @function getCampaignDetails o get campaign detail.
   * @param id campaign id for which the action will be taken.
   */
  getCampaignDetails(id: string) {
    this.$subscription.add(
      this._campaignService
        .getCampaignById(this.entityId, id)
        .subscribe((response) => {
          this.campaign = new Campaign().deserialize(response);
          console.log(this.campaign, 'this.campaign');
          if (this.campaign.cc && this.campaign.cc.length)
            this.campaignFG.addControl('cc', this._fb.array([]));
          if (this.campaign.bcc && this.campaign.bcc.length)
            this.campaignFG.addControl('bcc', this._fb.array([]));
          this.setFormData();
          this.listenForAutoSave();
        })
    );
  }

  /**
   * @function addElementToData function to add element to data.
   * @returns resolves promise.
   */
  addElementToData() {
    return new Promise((resolve) => {
      Promise.all([
        this.addFormArray('to', 'toReceivers'),
        this.addEmailControls(),
      ]).then((res) => resolve(res[1]));
    });
  }

  /**
   * @function setFormData function to set form data.
   */
  setFormData() {
    this.addElementToData().then((res) => {
      this.campaignFG.patchValue(res);
      this.datamapped = true;
    });
  }

  /**
   * @function addFormArray function to add form data to an array.
   * @param control campaignFG.
   * @param dataField field where the form data is stored.
   * @returns resolved promise.
   */
  addFormArray(control: string, dataField: string) {
    return new Promise((resolve) => {
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
   * @function addEmailControls function to get form control for emails.
   * @returns resolved promise.
   */
  addEmailControls() {
    return new Promise((resolve) => {
      this.campaign.testEmails.forEach((item) =>
        (this.campaignFG.get('testEmails') as FormArray).push(
          new FormControl(item)
        )
      );
      if (this.campaignFG.get('cc'))
        this.campaign.cc.forEach((item) =>
          (this.campaignFG.get('cc') as FormArray).push(new FormControl(item))
        );
      if (this.campaignFG.get('bcc'))
        this.campaign.cc.forEach((item) =>
          (this.campaignFG.get('bcc') as FormArray).push(new FormControl(item))
        );
      resolve(this.campaign);
    });
  }

  /**
   * @function listenForAutoSave function for auto saving form data after 20sec intervals.
   */
  listenForAutoSave() {
    this.$autoSaveSubscription.add(
      interval(campaignConfig.autosave.time).subscribe(() => {
        this.autoSave(this.campaignFG.getRawValue()).subscribe((response) => {
          if (this.campaignId) {
            this.setDataAfterUpdate(response);
          } else {
            this.campaignFG.patchValue({ id: response.id });
            this.campaignId = response.id;
            this.setDataAfterSave(response);
            this.location.replaceState(
              `/pages/marketing/campaign/edit/${response.id}`
            );
          }
        });
      })
    );
  }

  /**
   * @function autoSave function to auto save the data.
   * @param data data to be saved.
   * @returns save.
   */
  autoSave(data: any) {
    return this._campaignService.save(
      this.entityId,
      this._emailService.createRequestData(data),
      this.campaignId
    );
  }

  /**
   * @function changeStep function to change form steps.
   * @param event event object to change form step.
   * @returns
   */
  changeStep(event: Record<string, any>) {
    if (event.status) {
      if (this.campaign) {
        this.campaign.templateName = event.data.name;
        this.campaign.topicName = event.data.topicName;
      }
      this.campaignFG.patchValue({
        message: event.data.htmlTemplate,
        templateId: event.data.id,
        topicId: event.data.topicId,
      });
      this.stepper.selectedIndex = 0;
      return;
    }
    this.stepper.selectedIndex = 1;
  }

  /**
   * @function handleCreateContentChange function to handle created content change.
   * @param event event object for the stepper.
   */
  handleCreateContentChange(event: { step: string; templateType?: string }) {
    this.stepper[event.step]();
    if (event.templateType) this.createContentType = event.templateType;
  }

  /**
   * @function setDataAfterUpdate function to set form data after update.
   * @param response updated form.
   */
  setDataAfterUpdate(response) {
    if (response?.value) {
      this.campaignId = response.value.id;
      this.campaign = new Campaign().deserialize(response.value);
    }
  }

  /**
   * @function setDataAfterSave function to set form data after saving.
   * @param response saved data.
   */
  setDataAfterSave(response) {
    if (response) {
      this.campaignId = response.id;
      this.campaign = new Campaign().deserialize(response);
    }
  }

  /**
   * @function saveAndCloseForm function for saving and closing the form.
   */
  saveAndCloseForm() {
    if (
      this.campaignId ||
      this._emailService.checkForEmptyForm(this.campaignFG.getRawValue())
    )
      this.$subscription.add(
        this.autoSave(this.campaignFG.getRawValue()).subscribe(
          (_response) => this._router.navigate(['/pages/marketing/campaign']),
          ({ error }) => {
            this._router.navigate(['/pages/marketing/campaign']);
          }
        )
      );
    else this._router.navigate(['/pages/marketing/campaign']);
  }

  /**
   * @function scheduleCampaign To schedule campaign.
   */
  scheduleCampaign() {
    if (this.campaignFG.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.validation.INVALID_FORM',
          priorityMessage: 'Invalid Form.',
        })
        .subscribe();
      return;
    }
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    dialogConfig.disableClose = true;
    const detailCompRef = this._modalService.openDialog(
      ScheduleCampaignComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.scheduleFG = this.scheduleFG;
    detailCompRef.componentInstance.onScheduleClose.subscribe((response) => {
      if (response.status) {
        this.$subscription.add(
          this._emailService
            .scheduleCampaign(
              this.entityId,
              this._emailService.createScheduleRequestData(
                this.campaignFG.getRawValue(),
                this.scheduleFG.get('time').value
              )
            )
            .subscribe((response) => {
              this.snackbarService.openSnackBarWithTranslate(
                {
                  translateKey: `messages.SUCCESS.CAMPAIGN_SCEDULED`,
                  priorityMessage: 'Campaign scheduled.',
                },
                '',
                { panelClass: 'success' }
              );
              this._router.navigate(['pages/marketing/campaign']);
            })
        );
      } else this.scheduleFG.reset();
      detailCompRef.close();
    });
  }

  /**
   * @function sendMail function to send campaign email.
   * @returns error on form invalid.
   */
  sendMail() {
    if (this.campaignFG.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.error.fail',
          priorityMessage: 'Invalid form.',
        })
        .subscribe();
      this.campaignFG.markAllAsTouched();
      return;
    }
    const reqData = this._emailService.createRequestData(
      this.campaignFG.getRawValue()
    );
    reqData.isDraft = false;
    this.isSending = true;
    this.$subscription.add(
      this._emailService.sendEmail(this.entityId, reqData).subscribe(
        (response) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.success.campaignSent',
                priorityMessage: 'Campaign Sent successfully',
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
          this.isSending = false;
        }
      )
    );
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
    this.$autoSaveSubscription.unsubscribe();
    this.$formChangeDetection.unsubscribe();
  }
}
