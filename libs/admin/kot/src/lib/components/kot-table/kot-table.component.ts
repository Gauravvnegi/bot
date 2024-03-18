import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  ConfigService,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { kotStatusDetails } from '../../constants/kot-datatable.constant';
import {
  Kot,
  KotFilter,
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
  timeFilterConfiguration: Record<string, (value: number) => boolean>;
  filterChips: KotFilter[];
  globalQueries: any[];

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
      if (res) {
        this.orderConfig = new OrderConfigData().deserialize(res?.orderConfig);
        this.timeFilterConfiguration = this.orderConfig.kotFilterConfigurations;
        this.listenForEntityFilterChange();
        this.listenForGlobalFilters();
      }
    });
    this.listenForRefreshData();
  }

  listenForEntityFilterChange() {
    this.kotService.OnGlobalFilterChange.subscribe((res) => {
      this.cancelRequests$.next();
      this.entityId = res.entityId[0];
      if (this.globalQueries) this.initTableValue();
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      this.entityId = this.globalFilterService.entityId;

      //set-global query every time global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      //fetch-api for records
      this.cancelRequests$.next();
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
    this.loading = true;
    this.$subscription.add(
      this.kotService
        .getAllOrders(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const data = new KotList().deserialize(res);
            this.values = data?.records;
            this.backUpData = this.values; //backup data

            this.initFilters(
              data?.entityTypeCounts,
              {},
              data?.total,
              kotStatusDetails
            );
            this.filterChips = JSON.parse(
              JSON.stringify(this.orderConfig.kotTimeFilter)
            );
          },
          this.handelError,
          this.handleFinal
        )
    );
  }

  toggleQuickReplyFilter(event): void {
    const keys = [...event.selectedChips];

    if (keys[0] === 'ALL') {
      //if we selected all filter
      this.values = this.backUpData;
      return;
    }

    this.values = this.backUpData.filter((value) => {
      const timerValue = value.timer.split(':')[0];

      //checking for conditions
      return keys.some((key) => {
        const ans = this.timeFilterConfiguration[key](+timerValue);
        return ans;
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
        ...this.globalQueries,
        {
          offset: this.first,
          limit: this.rowsPerPage,
          order: 'DESC',
          includeKot: true,
          entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
          entityState: 'CONFIRMED',
        },
      ]),
    };
    return config;
  }

  handleFinal = () => {
    this.loading = false;
  };

  handelError = ({ error }) => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
