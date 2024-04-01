import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
  StatCard,
  getUniqueOptions,
} from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { Subscription } from 'rxjs';
import {
  eMarketEmailStatCard,
  eMarketWhatsappStatCard,
} from '../../../../constants/emarket-stats.constants';
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
  campaignList: any[] = [];
  entityId: string;
  statCard: StatCard[] = eMarketEmailStatCard;
  loading: boolean = false;
  selectedOption: Option;

  @Input() selectedTab: 'EMAIL' | 'WHATSAPP' = 'EMAIL';
  statsScore: number = 0;

  noMoreCampaign: boolean = true;

  limit: number = 10;
  offset: number = 0;

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

  title: string = `Recent ${convertToNormalCase(this.selectedTab)} Campaign`;

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
          comparisonPercent: ['deliveryRate', 'conversionRate'].includes(
            item.id
          )
            ? value.campaignStats[item.id] -
              value.previousCampaignStats[item.id]
            : this.getScoreInPercentage(
                value.campaignStats[item.id],
                value.previousCampaignStats[item.id]
              ),

          additionalData: ['deliveryRate', 'conversionRate'].includes(item.id)
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
    return +((diff / oldValue) * 100 || 0).toFixed(2);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getAllCampaignList(true);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!changes?.config?.firstChange) {
      this.getAllCampaignList(true);
    }

    if (changes.selectedTab) {
      this.statCard =
        this.selectedTab === 'EMAIL'
          ? eMarketEmailStatCard
          : eMarketWhatsappStatCard;
      this.campaignList = [];

      this.title = `Recent ${convertToNormalCase(this.selectedTab)} Campaign`;
    }
  }

  listenFormCampaignValueChanges() {
    this.campaignForm.get('campaign').valueChanges.subscribe((res) => {
      const campaignData = this.campaignList.find((item) => item.value === res);
      this.selectedOption = campaignData;

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
    } else {
      this.statsDataSets = {
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
    }
  }

  getAllCampaignList(patch: boolean = false) {
    this.loading = true;
    const params = `${this.config.params}&limit=${this.limit}&offset=${this.offset}&entityState=ACTIVE`;

    this.$subscription.add(
      this.statsService
        .getCampaignList(this.entityId, { params: params })
        .subscribe(
          (res) => {
            this.noMoreCampaign = this.limit > res.total;

            const data = this.initCampaignOption(res.records);

            this.campaignList = getUniqueOptions([
              ...this.campaignList,
              ...data,
              this.selectedOption ? this.selectedOption : {},
            ]);

            if (patch) {
              const id = this.campaignList[0].value;
              this.campaignForm.get('campaign').patchValue(id);
            }
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  loadMoreData() {
    if (!this.noMoreCampaign) {
      this.limit += 10;
      this.getAllCampaignList();
    }
  }

  initCampaignOption(record: any[]) {
    return record.map((data) => {
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
  }

  onSearchCampaign(text: string) {
    if (text) {
      const params = `${this.config.params}&key=${text}&entityState=ACTIVE`;

      this.$subscription.add(
        this.statsService
          .getCampaignList(this.entityId, { params: params })
          .subscribe((res) => {
            this.campaignList = this.initCampaignOption(res.records);
          })
      );
    } else {
      this.campaignList = [];
      this.getAllCampaignList();
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };
}

type StatData = { labels: string[]; datasets: any[]; total: number };
