import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Chip,
  ConfigService,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, Subscription, interval } from 'rxjs';
import { kotStatusDetails } from '../../constants/kot-datatable.constant';
import {
  Kot,
  KotList,
  OrderConfigData,
} from '../../models/kot-datatable.model';
import { KotService } from '../../services/kot.service';

@Component({
  selector: 'hospitality-bot-kot-table',
  templateUrl: './kot-table.component.html',
  styleUrls: [
    './kot-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class KotTableComponent extends BaseDatatableComponent
  implements OnInit {
  navRoutes: NavRouteOptions = [];
  values: Kot[] = [];
  tableName: string = 'KOT';
  loading: boolean = false;
  entityId: string;
  $subscription = new Subscription();
  private cancelRequests$ = new Subject<void>();
  isAllTabFilterRequired: boolean = true;
  backUpData: any[] = [];
  orderConfig: OrderConfigData;
  isQuickFilters: boolean = true;
  kotFilter: any[];
  subscription$ = new Subscription();
  countData: Record<string, number>;

  constructor(
    fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private kotService: KotService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.configService.$config.subscribe((res) => {
      this.orderConfig = new OrderConfigData().deserialize(res?.orderConfig);
      this.listenForGlobalFilterChange();
    });
  }

  listenForGlobalFilterChange() {
    this.kotService.OnGlobalFilterChange.subscribe((res) => {
      this.cancelRequests$.next();
      this.entityId = res.entityId[0];
      this.initTableValue();
    });
  }

  loadData(event: LazyLoadEvent): void {
    this.cancelRequests$.next();
    this.initTableValue();
  }

  listenForRefreshData() {
    this.$subscription.add(
      this.kotService.refreshData.subscribe((res) => {
        if (res) {
          this.initTableValue();
        }
      })
    );
  }

  initTableValue() {
    this.$subscription.add(
      this.kotService
        .getAllOrders(this.entityId, this.getQueryConfig())
        .subscribe((res) => {
          const data = new KotList().deserialize(res);
          this.values = data?.records;
          this.backUpData = this.values; //backup data

          this.initFilters(
            data?.entityTypeCounts,
            this.orderConfig.kotTimeFilter,
            data?.total,
            kotStatusDetails
          );
        })
    );
  }

  /**
   * @function changePage
   * @param page
   * @returns
   * @description override the base property method to handel QuickFilter locally
   */
  changePage(page) {
    let keys: string[] = [];
    const data = this.getSelectedQuickReplyFilters();

    if (!data?.length) {
      //when we select all filter
      this.values = this.backUpData;
      return;
    }

    //extracting keys from selected quick filters
    keys = (data as Array<{ status: string }>)
      ?.map((item) => {
        const status = item?.status;
        return status ? status.match(/\d+/)[0] : undefined;
      })
      ?.filter(Boolean);

    // Filter the values array based on the extracted numbers
    this.values = this.backUpData.filter((value) => {
      const timerValue = value.timer.split(':')[0];

      //checking for conditions
      return keys.some((key) => {
        switch (key) {
          case '5':
            return +timerValue >= 5 && timerValue < 10;
          case '10':
            return +timerValue >= 10 && timerValue < 15;
          case '15':
            return +timerValue >= 15 && timerValue < 20;
          case '20':
            return +timerValue >= 20;
          default:
            return false;
        }
      });
    });
  }

  /**
   * @function getQueryConfig To get query config
   * @returns QueryConfig
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          offset: this.first,
          limit: this.rowsPerPage,
          order: 'DESC',
          includeKot: true,
          type: this.tabFilterItems[this.tabFilterIdx]?.value,
        },
      ]),
    };
    return config;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
