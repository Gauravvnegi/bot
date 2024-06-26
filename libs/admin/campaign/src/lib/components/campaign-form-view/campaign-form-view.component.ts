import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ModuleNames,
  NavRouteOptions,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import {
  CampaignForm,
  CampaignType,
  PostCampaignForm,
  TemplateMode,
} from '../../types/campaign.type';
import { campaignRoutes } from '../../constant/route';
import { Subscription } from 'rxjs';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { filter, take } from 'rxjs/operators';
import { campaignConfig } from '../../constant/campaign';

import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { triggerOptions, eventOptions } from '../../constant/campaign';
import { CampaignService } from '../../services/campaign.service';
import { ActivatedRoute } from '@angular/router';
import { CampaignFormService } from '../../services/campaign-form.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { EmailService } from '../../services/email.service';
import { EmailList } from '../../data-model/email.model';
import { CampaignFormData } from '../../data-model/campaign.model';
import { TemplateDataType } from 'libs/admin/template/src/lib/data-models/templateConfig.model';

@Component({
  selector: 'hospitality-bot-campaign-form-view',
  templateUrl: './campaign-form-view.component.html',
  styleUrls: ['./campaign-form-view.component.scss'],
})
export class CampaignFormViewComponent implements OnInit, OnDestroy {
  readonly campaignConfig = campaignConfig;

  useForm: FormGroup;

  entityId: string;
  campaignId: string;
  maxChip = 5;

  pageTitle: string;
  navRoutes: NavRouteOptions = [];
  campaignType: CampaignType;

  isRemoveCta = false;
  isRouteData = false;

  minDate = new Date();
  maxDate = new Date();
  triggerOptions: Option[] = [];
  eventOptions: Option[] = [];
  fromEmailList: Option[] = [];

  campaignData = new CampaignFormData();

  selectedTemplate: Option;

  private $subscription = new Subscription();

  constructor(
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private campaignService: CampaignService,
    private activatedRoute: ActivatedRoute,
    private campaignFormService: CampaignFormService,
    private snackbarService: SnackBarService,
    private emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.campaignId = this.activatedRoute.snapshot.paramMap.get('id');
    this.maxDate.setDate(this.minDate.getDate() + 365);
    this.initForm();
    this.listenRouteData();
  }

  listenRouteData() {
    this.$subscription.add(
      this.activatedRoute.queryParams.pipe(take(1)).subscribe((res) => {
        if (res.data) {
          const formData = JSON.parse(atob(res.data)) as CampaignForm;
          if (formData?.cc?.length) this.addControl('cc');
          if (formData?.bcc?.length) this.addControl('bcc');
          this.useForm.patchValue(formData as CampaignForm);
          this.isRouteData = true;
        }
        if (res.campaignType) {
          this.campaignType = res.campaignType;
          this.initDetails();
          this.setValidators();
        }
      })
    );
  }

  initDetails() {
    this.triggerOptions = triggerOptions;
    this.eventOptions = eventOptions;
    const { title, navRoutes } = campaignRoutes[
      (this.campaignId ? 'edit' : 'create') +
        (this.campaignType === 'EMAIL' ? 'Email' : 'Whatsapp') +
        'Campaign'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.initNavRoutes();
    this.getFromEmails();
    if (this.campaignId && !this.isRouteData) {
      this.initCampaignData();
    }
  }

  initNavRoutes() {
    this.$subscription.add(
      this.routesConfigService.navRoutesChanges
        .pipe(
          filter((navRoutesRes) => navRoutesRes.length > 0),
          take(1)
        )
        .subscribe((navRoutesRes) => {
          this.navRoutes = [...navRoutesRes, ...this.navRoutes];
        })
    );
  }

  initForm() {
    let startDate = this.campaignId ? '' : new Date();
    this.useForm = this.fb.group({
      campaignName: ['', [Validators.required]],
      to: [[], [Validators.required]],
      from: ['', [Validators.required]],
      event: [''],
      startDate: [startDate],
      endDate: [new Date()],
      campaignState: ['DOES_NOT_REPEAT'],
      subject: [''],
      campaignTags: [[]],
      template: [''],
      message: [''],
      templateId: [''],
      recipients: [[]],
      id: [''],
    });
    this.listenForTagChanges();
  }

  listenForTagChanges(): void {
    this.useForm.get('campaignTags').valueChanges.subscribe((val) => {
      if (val.length > this.maxChip) {
        this.useForm.get('campaignTags').setErrors({ maxTags: true });
      } else {
        this.useForm.get('campaignTags').setErrors(null);
      }
    });
  }

  initCampaignData() {
    this.$subscription.add(
      this.campaignService
        .getCampaignById(this.entityId, this.campaignId)
        .subscribe((res) => {
          if (res) {
            this.campaignData = new CampaignFormData().deserialize(res);
            if (this.campaignData.templateId)
              this.selectedTemplate = {
                label: this.campaignData.templateName,
                value: this.campaignData.templateId,
              };
            this.useForm.patchValue(this.campaignData);
            const recipientValues = this.campaignData.recipients.map(
              (recipient) => recipient.value
            );

            this.campaignService.updateSelectedRecipients(recipientValues);
          }
        })
    );
  }

  addControl(controlName: string) {
    this.useForm.addControl(
      controlName,
      new FormControl([], [Validators.pattern(Regex.EMAIL_REGEX)])
    );
  }

  /**
   * @function getFromEmail function to get email across particular hotel id.
   */
  getFromEmails() {
    this.$subscription.add(
      this.emailService.getFromEmail(this.entityId).subscribe((response) => {
        this.fromEmailList = new EmailList()
          .deserialize(response)
          .map((item) => ({ label: item.email, value: item.id }));
      })
    );
  }

  selectedMode(mode: TemplateMode) {
    this.isRemoveCta = mode !== 'backdrop';
  }

  removeTemplate() {
    this.inputControls.message.reset();
  }

  removeControl(controlName: string) {
    this.useForm.removeControl(controlName);
  }

  setValidators() {
    if (this.campaignType === 'EMAIL') {
      this.inputControls.subject.setValidators([Validators.required]);
    } else {
      this.resetValidators(this.inputControls.subject);
      this.resetValidators(this.inputControls.from);
    }
  }

  resetValidators(control: AbstractControl) {
    control.clearValidators();
    control.updateValueAndValidity({ emitEvent: false });
    control.markAsUntouched();
  }

  templateChange(event: TemplateDataType) {
    if (event.id)
      this.selectedTemplate = {
        label: event?.name,
        value: event?.id,
      };
  }

  handleSubmit(action: 'schedule' | 'save') {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
      );
      return;
    }

    const formData = this.campaignFormService.postFormData(
      this.useForm.getRawValue() as CampaignForm,
      this.campaignType,
      action
    );

    if (this.campaignId) {
      this.updateCampaign(formData);
    } else {
      this.createCampaign(formData);
    }
  }

  updateCampaign(formData: PostCampaignForm) {
    this.$subscription.add(
      this.campaignService
        .updateCampaign(this.entityId, formData, this.campaignId, {
          queryObj: `?channel=${this.campaignType}`,
        })
        .subscribe((res) => {
          if (res) {
            this.snackbarService.openSnackBarAsText(
              `Campaign updated successfully`,
              '',
              { panelClass: 'success' }
            );
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.CAMPAIGN,
            });
          }
        })
    );
  }

  createCampaign(formData: PostCampaignForm) {
    this.$subscription.add(
      this.campaignService
        .createCampaign(this.entityId, formData)
        .subscribe((res) => {
          if (res) {
            this.snackbarService.openSnackBarAsText(
              `Campaign created successfully`,
              '',
              { panelClass: 'success' }
            );
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.CAMPAIGN,
            });
          }
        })
    );
  }

  get inputControls() {
    return this.useForm.controls as Record<keyof CampaignForm, AbstractControl>;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
    this.campaignService.resetFormValues();
  }
}
