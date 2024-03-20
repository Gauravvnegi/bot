import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ModuleNames,
  NavRouteOptions,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
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
  topicList: Observable<Option[]>;

  private $subscription = new Subscription();

  constructor(
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private campaignService: CampaignService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.campaignType = this.campaignService?.campaignType;
    this.initDetails();
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
      })
    );
  }

  initDetails() {
    this.triggerOptions = triggerOptions;
    this.eventOptions = eventOptions;
    const { title } = campaignRoutes[
      this.campaignType === 'email'
        ? 'createEmailCampaign'
        : 'createWhatsappCampaign'
    ];
    this.pageTitle = title;
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
      template: [''],
      message: [''],
    });
  }

  addControl(controlName: string) {
    this.useForm.addControl(
      controlName,
      new FormControl([], [Validators.pattern(Regex.EMAIL_REGEX)])
    );
  }

  handleSend() {}

  handleSave() {}

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get inputControls() {
    return this.useForm.controls as Record<keyof CampaignForm, AbstractControl>;
  }
}
