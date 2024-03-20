import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavRouteOptions, Option, Regex } from '@hospitality-bot/admin/shared';
import { CampaignForm, CampaignType } from '../../types/campaign.type';
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

@Component({
  selector: 'hospitality-bot-campaign-form-view',
  templateUrl: './campaign-form-view.component.html',
  styleUrls: ['./campaign-form-view.component.scss'],
})
export class CampaignFormViewComponent implements OnInit, OnDestroy {
  readonly campaignConfig = campaignConfig;

  useForm: FormGroup;

  entityId: string;
  pageTitle: string;
  campaignType: CampaignType;

  minDate = new Date();
  navRoutes: NavRouteOptions = [];
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
    this.initForm();
    this.listenRouteData();
  }

  listenRouteData() {
    this.$subscription.add(
      this.activatedRoute.queryParams.pipe(take(1)).subscribe((res) => {
        if (res.formData) {
          const formData = JSON.parse(atob(res.formData)) as CampaignForm;
          if (formData?.cc?.length) this.addControl('cc');
          if (formData?.bcc?.length) this.addControl('bcc');
          this.useForm.patchValue(formData as CampaignForm);
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
      this.campaignType === 'EMAIL'
        ? 'createEmailCampaign'
        : 'createWhatsappCampaign'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.entityId = this.globalFilterService.entityId;
    this.topicList = this.campaignService.mapTopicList(this.entityId);
    this.initNavRoutes();
    this.getFromEmails();
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
      topic: ['', [Validators.required]],
      to: [[]],
      triggers: [''],
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
    });
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

  removeControl(controlName: string) {
    this.useForm.removeControl(controlName);
  }

  setValidators() {
    if (this.campaignType === 'EMAIL') {
      this.inputControls.subject.setValidators([Validators.required]);
    } else {
      this.resetValidators(this.inputControls.subject);
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

    const formData = this.campaignFormService.posFormData(
      this.useForm.getRawValue() as CampaignForm,
      this.campaignType,
      action
    );
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
