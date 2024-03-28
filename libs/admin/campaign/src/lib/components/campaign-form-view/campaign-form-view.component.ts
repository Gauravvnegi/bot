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
import { Observable, Subscription } from 'rxjs';
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

  pageTitle: string;
  navRoutes: NavRouteOptions = [];
  campaignType: CampaignType;

  isRemoveCta = false;
  isRouteData = false;

  minDate = new Date();
  triggerOptions: Option[] = [];
  eventOptions: Option[] = [];
  fromEmailList: Option[] = [];
  topicList: Observable<Option[]>;

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
    this.campaignId = this.activatedRoute.snapshot.paramMap.get('id');
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
    this.entityId = this.globalFilterService.entityId;
    this.topicList = this.campaignService.mapTopicList(this.entityId);
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
    this.useForm = this.fb.group({
      campaignName: ['', [Validators.required]],
      topic: [''],
      to: [[], [Validators.required]],
      from: ['', [Validators.required]],
      event: [''],
      startDate: [new Date()],
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
  }

  initCampaignData() {
    this.$subscription.add(
      this.campaignService
        .getCampaignById(this.entityId, this.campaignId)
        .subscribe((res) => {
          if (res) {
            const campaignData = new CampaignFormData().deserialize(res);
            this.useForm.patchValue(campaignData, { emitEvent: false });
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

  handleSubmit(action: 'send' | 'save') {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
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
        .updateCampaign(this.entityId, formData, this.campaignId)
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
  }
}
