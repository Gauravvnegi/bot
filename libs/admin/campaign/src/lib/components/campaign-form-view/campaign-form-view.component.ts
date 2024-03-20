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

  navRoutes: NavRouteOptions = [];
  triggerOptions: Option[] = [];
  eventOptions: Option[] = [];
  recipients: Option[] = [];
  topicList: Observable<Option[]>;

  private $subscription = new Subscription();

  constructor(
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private campaignService: CampaignService,
    private activatedRoute: ActivatedRoute,
    private campaignFormService: CampaignFormService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.listenRouteData();
  }

  listenRouteData() {
    this.$subscription.add(
      this.activatedRoute.queryParams.pipe(take(1)).subscribe((res) => {
        if (res.formData) {
          const formData = JSON.parse(atob(res.formData));
          this.useForm.patchValue(formData as CampaignForm);
        }
        if (res.campaignType) {
          this.campaignType = res.campaignType;
          this.initDetails();
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
      to: [[]],
      triggers: [''],
      event: [''],
      startDate: [new Date()],
      endDate: [new Date()],
      campaignState: ['DOES_NOT_REPEAT'],
      campaignTags: [[]],
      template: [''],
      message: [''],
      templateId: [''],
    });
  }

  addControl(controlName: string) {
    this.useForm.addControl(
      controlName,
      new FormControl([], [Validators.pattern(Regex.EMAIL_REGEX)])
    );
  }

  removeControl(controlName: string) {
    this.useForm.removeControl(controlName);
  }

  selectedRecipients(recipients: Option[]) {
    this.recipients = recipients;
  }

  handleSend() {
    const formData = this.campaignFormService.posFormData(
      this.useForm.getRawValue() as CampaignForm,
      this.campaignType,
      this.recipients
    );
  }

  handleSave() {}

  get inputControls() {
    return this.useForm.controls as Record<keyof CampaignForm, AbstractControl>;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
