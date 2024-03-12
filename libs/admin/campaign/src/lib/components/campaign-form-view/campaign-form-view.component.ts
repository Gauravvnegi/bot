import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CampaignType } from '../../types/campaign.type';
import { campaignRoutes } from '../../constant/route';
import { Observable, Subscription } from 'rxjs';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { filter, map, take } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { triggerOptions } from '../../constant/campaign';
import { ListingService } from 'libs/admin/listing/src/lib/services/listing.service';
import { Topics } from 'libs/admin/listing/src/lib/data-models/listing.model';

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
  private $subscription = new Subscription();

  topicList: Observable<Option[]>;

  constructor(
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService,
    private fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService
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
    const { title } = campaignRoutes[
      this.campaignType === 'email'
        ? 'createEmailCampaign'
        : 'createWhatsappCampaign'
    ];
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
      topic: [''],
      recipient: [''],
      event: [''],
      startDate: [new Date()],
      triggers: [''],
      endDate: [''],
    });
  }

  getTopicList() {
    return this.listingService
      .getTopicList(this.entityId, '?entityState=ACTIVE')
      .pipe(
        map((response) => {
          const data = new Topics()
            .deserialize(response)
            .records.map((item) => ({ label: item.name, value: item.id }));
          return data;
        })
      );
  }
}
