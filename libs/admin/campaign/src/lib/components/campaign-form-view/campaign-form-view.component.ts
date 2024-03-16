import { Component, OnInit } from '@angular/core';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CampaignForm, CampaignType } from '../../types/campaign.type';
import { campaignRoutes } from '../../constant/route';
import { Observable, Subscription } from 'rxjs';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { filter, take } from 'rxjs/operators';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { triggerOptions, eventOptions } from '../../constant/campaign';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-campaign-form-view',
  templateUrl: './campaign-form-view.component.html',
  styleUrls: ['./campaign-form-view.component.scss'],
})
export class CampaignFormViewComponent implements OnInit {
  useForm: FormGroup;

  entityId: string;

  pageTitle: string;
  navRoutes: NavRouteOptions = [];
  campaignType: CampaignType;

  triggerOptions: Option[] = [];
  eventOptions: Option[] = [];
  private $subscription = new Subscription();

  topicList: Observable<Option[]>;

  constructor(
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private campaignService: CampaignService
  ) {}

  ngOnInit(): void {
    this.initParamData();
    this.initDetails();
    this.initForm();
  }

  initParamData() {
    this.campaignType = this.campaignService?.campaignType;
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
      recipient: [''],
      triggers: [''],
      event: [''],
      startDate: [new Date()],
      endDate: [new Date()],
      campaignState: ['DOES_NOT_REPEAT'],
      template: [''],
      message: [''],
    });
  }

  handleSend() {}

  handleSave() {}

  get inputControls() {
    return this.useForm.controls as Record<keyof CampaignForm, AbstractControl>;
  }
}
