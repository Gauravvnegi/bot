import {
  Component,
  Input,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
  StatCard,
} from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { eMarketStatCard } from '../../../../constants/emarket-stats.constants';
import { MarketingService } from '../../../../services/stats.service';
import { EMarketStatsResponse } from '../../../types/campaign.response.type';

@Component({
  selector: 'hospitality-bot-recent-campaign',
  templateUrl: './recent-campaign.component.html',
  styleUrls: ['./recent-campaign.component.scss'],
})
export class RecentCampaignComponent implements OnInit {
  $subscription = new Subscription();
  campaignForm: FormGroup;
  campaignList: Option[];
  entityId: string;
  statCard: StatCard[] = eMarketStatCard;
  @Input() selectedTab: 'EMAIL' | 'WHATSAPP' = 'EMAIL';
  statsScore: number = 0;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private dateService: DateService,
    private statsService: MarketingService
  ) {
    this.campaignForm = this.fb.group({
      campaign: [''],
    });
    this.listenFormCampaignValueChanges();
  }

  title: string = 'Recent WhatsApp Campaign';
  labelList: { label: string; count: number; colorCode }[];
  statsDataSets: StatData = {
    labels: ['NO DATA'],
    datasets: [
      {
        data: [100],
        backgroundColor: ['#d5d1d1'],
        hoverBackgroundColor: ['#d5d1d1'],
      },
    ],
    total: 0,
  };

  @Input() config: QueryConfig;
  @Input() set data(value: EMarketStatsResponse) {
    if (value) {
      this.statCard = this.statCard.map((item) => {
        return {
          ...item,
          comparisonPercent:
            item.id === 'deliveryRate'
              ? value.campaignStats['deliveryRate'] -
                value.previousCampaignStats['deliveryRate']
              : this.getScoreInPercentage(
                  value.campaignStats[item.id],
                  value.previousCampaignStats[item.id]
                ),
          additionalData:
            item.id === 'deliveryRate'
              ? `${value.campaignStats[item.id]}%`
              : `${value.campaignStats[item.id]}`,
        };
      });
    }
  }

  getScoreInPercentage(newValue: number, oldValue: number): number {
    const diff = newValue - oldValue;
    if (!oldValue) {
      return diff * 100;
    }
    return (diff / oldValue) * 100 || 0;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getAllCampaignList();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes.config.firstChange) {
      this.getAllCampaignList();
    }
  }

  listenFormCampaignValueChanges() {
    this.campaignForm.get('campaign').valueChanges.subscribe((res) => {
      const campaignData = this.campaignList.find((item) => item.value === res);
      this.labelList = campaignData?.data;
      this.statsScore = campaignData?.score;
      this.initStatsData();
    });
  }

  initStatsData() {
    const data = this.labelList.reduce(
      (acc, curr) => {
        acc.labels.push(curr.label);
        acc.datasets[0].data.push(curr.count);
        acc.datasets[0].backgroundColor.push(curr.colorCode);
        acc.datasets[0].hoverBackgroundColor.push(curr.colorCode);
        acc.total += curr?.count;

        return acc;
      },
      {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: [],
            hoverBackgroundColor: [],
          },
        ],
        total: 0,
      } as StatData
    );

    if (data.total) {
      this.statsDataSets = data;
    }
  }

  getAllCampaignList() {
    this.$subscription.add(
      this.statsService
        .getCampaignList(this.entityId, this.config)
        .subscribe((res) => {
          this.campaignList = res.records.map((data) => {
            return {
              label: data.name,
              value: data.id,
              score:
                this.selectedTab !== 'EMAIL'
                  ? data?.statsCampaign['sent']
                  : data?.statsCampaign['delivered'],

              data:
                this.selectedTab !== 'EMAIL'
                  ? [
                      {
                        label: 'Delivered',
                        count: data?.statsCampaign['delivered'],
                        colorCode: '#FF9F40',
                      },
                      {
                        label: 'Read',
                        count: data?.statsCampaign['read'],
                        colorCode: '#4BC0C0',
                      },
                      {
                        label: 'Failed',
                        count: data?.statsCampaign['failed'],
                        colorCode: '#FF6384',
                      },
                    ]
                  : [
                      {
                        label: 'Open',
                        count: data?.statsCampaign['opened'],
                        colorCode: '#FF9F40',
                      },
                      {
                        label: 'Failed',
                        count: data?.statsCampaign['failed'],
                        colorCode: '#4BC0C0',
                      },
                      {
                        label: 'Clicks',
                        count: data?.statsCampaign['clicked'],
                        colorCode: '#FF6384',
                      },
                      {
                        label: 'Unopened',
                        count: data?.statsCampaign['unopened'],
                        colorCode: '#36A2EB',
                      },
                    ],
            };
          });

          this.campaignForm.patchValue({
            campaign: this.campaignList[0].value,
          });
        })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

type StatData = { labels: string[]; datasets: any[]; total: number };
