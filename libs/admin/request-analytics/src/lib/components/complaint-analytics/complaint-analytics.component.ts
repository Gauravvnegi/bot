import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  StatCard,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';
import { CreateServiceItemComponent } from 'libs/admin/service-item/src/lib/components/create-service-item/create-service-item.component';
import { Subscription, forkJoin } from 'rxjs';
import { getTicketCountLabel } from '../../constant/stats';
import { AverageRequestStats } from '../../models/statistics.model';
import { AnalyticsService } from '../../services/analytics.service';
import { DistributionStats } from '../../types/response.types';

@Component({
  selector: 'complaint-analytics',
  templateUrl: './complaint-analytics.component.html',
  styleUrls: ['./complaint-analytics.component.scss'],
})
export class ComplaintAnalyticsComponent implements OnInit {
  welcomeMessage = 'Welcome To Complaint Analytics';
  navRoutes = [{ label: 'Complaint Analytics', link: './' }];

  selectedInterval: string;
  globalQueries = [];

  entityId: string;

  agentsOnTicket = 0;
  availableAgents = 0;

  createdTicketCount = 0;
  closedTicketCount = 0;
  sidebarVisible: boolean = false;

  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  sidebarType = 'complaint';

  buttonConfig = [
    { button: true, label: 'Raise Complaint', icon: 'assets/svg/requests.svg' },
  ];
  $subscription = new Subscription();

  createdTickedLabel: string = 'Created/Day';
  closedTickedLabel: string = 'Closed/Day';

  constructor(
    private globalFilterService: GlobalFilterService,
    private sidebarService: SideBarService,
    private dateService: DateService,
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver
  ) {}

  statCard: StatCard[] = [];
  agentStats: StatCard;
  ticketsStats: any[];

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.createdTickedLabel = getTicketCountLabel(
          'Created',
          data['dateRange']?.value?.label
        );
        this.closedTickedLabel = getTicketCountLabel(
          'Closed',
          data['dateRange']?.value?.label
        );
        const calenderType = {
          calenderType: this.dateService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate,
            this.globalFilterService.timezone
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.statCard = [];
        this.getAgentStats();
        this.initTicketsCreatedStats();
      })
    );
  }

  //resolved
  initTicketsCreatedStats() {
    this.$subscription.add(
      forkJoin([
        this.getPerDayStats('ALL'),
        this.getPerDayStats('FOCUSED'),
      ]).subscribe(([teamResponse, individualResponse]) => {
        this.ticketsStats = new AverageRequestStats().deserialize(
          teamResponse,
          individualResponse
        ).data;
      })
    );
  }

  getPerDayStats(statsType: 'ALL' | 'FOCUSED') {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          statsType: statsType,
        },
      ]),
    };
    return this.analyticsService.getPerDayRequestStats(config);
  }

  getAgentStats() {
    this.$subscription.add(
      this.analyticsService
        .getAgentDistributionStats()
        .subscribe((res: DistributionStats) => {
          this.agentStats = {
            label: 'Agents Distrubution',
            key: 'Agent',
            score: res.distributionStats.availableUsers.toString(),
          };

          this.agentsOnTicket = res.distributionStats.occupiedUsers;
          this.availableAgents = res.distributionStats.availableUsers;
        })
    );
  }

  /**
   * Refreshes the stats on the page
   */
  refreshStats() {
    this.analyticsService.refreshStats.emit(true);
    this.statCard = [];
    this.getAgentStats();
    this.initTicketsCreatedStats();
  }

  createServiceItem() {
    const lazyModulePromise = import(
      'libs/admin/service-item/src/lib/admin-service-item.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminServiceItemModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });

    lazyModulePromise.then(() => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(
        CreateServiceItemComponent
      );
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;

      this.$subscription.add(
        componentRef.instance.onCloseSidebar.subscribe((res) => {
          this.sidebarVisible = false;
        })
      );

      manageMaskZIndex();
    });
  }

  raiseRequest() {
    this.sidebarService.openSidebar({
      componentName: 'RaiseRequest',
      containerRef: this.sidebarSlide,
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => {
        this.refreshStats();
        this.sidebarVisible = false;
      },
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
