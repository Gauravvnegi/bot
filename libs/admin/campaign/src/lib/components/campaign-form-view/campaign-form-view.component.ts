import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AdminUtilityService, NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CampaignForm, CampaignType } from '../../types/campaign.type';
import { campaignRoutes } from '../../constant/route';
import { Observable, Subscription } from 'rxjs';
import { GlobalFilterService, RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { filter, map, take } from 'rxjs/operators';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { triggerOptions, eventOptions } from '../../constant/campaign';
import { Topics } from 'libs/admin/listing/src/lib/data-models/listing.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-campaign-form-view',
  templateUrl: './campaign-form-view.component.html',
  styleUrls: ['./campaign-form-view.component.scss']
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
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private campaignService: CampaignService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.initParamData();
    this.initDetails();
    this.initForm();
  }

  initParamData() {
    const paramData = this.route.snapshot.queryParams;
    this.campaignType = paramData?.campaignType;
  }

  initDetails() {
    this.triggerOptions = triggerOptions;
    this.eventOptions = eventOptions;
    const { title } = campaignRoutes[this.campaignType === 'email' ? 'createEmailCampaign' : 'createWhatsappCampaign'];
    this.pageTitle = title;
    this.entityId = this.globalFilterService.entityId;
    this.topicList = this.getTopicList();
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
      topic: ['', [Validators.required]],
      recipient: [''],
      triggers: [''],
      event: [''],
      startDate: [new Date()],
      endDate: [new Date()],
      campaignState: ['DOES_NOT_REPEAT']
    });
  }

  getTopicList() {
    return this.campaignService.getTopicList(this.entityId, { queryObj: '?entityState=ACTIVE' }).pipe(
      map((response) => {
        const data = new Topics().deserialize(response).records.map((item) => ({ label: item.name, value: item.id }));
        return data;
      })
    );
  }

  handleSend() {}

  handleSave() {}

  get inputControls() {
    return this.useForm.controls as Record<keyof CampaignForm, AbstractControl>;
  }
}
