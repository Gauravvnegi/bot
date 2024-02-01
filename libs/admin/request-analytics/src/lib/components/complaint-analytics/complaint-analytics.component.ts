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
import { Subscription } from 'rxjs';
import { DateService } from '@hospitality-bot/shared/utils';
import { AnalyticsService } from '../../services/analytics.service';
import { AverageStats, DistributionStats } from '../../types/response.types';
import { AverageRequestStats } from '../../models/statistics.model';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';
import { CreateServiceItemComponent } from 'libs/admin/service-item/src/lib/components/create-service-item/create-service-item.component';

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

  createdPerDay = 0;
  closedPerDay = 0;
  sidebarVisible: boolean = false;

  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  sidebarType = 'complaint';

  buttonConfig = [
    { button: true, label: 'Raise Complaint', icon: 'assets/svg/requests.svg' },
  ];

  $subscription = new Subscription();

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

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
    this.getAgentStats();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
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
        this.getPerDayStats();
        this.getAgentStats();
      })
    );
  }

  getConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([...this.globalQueries]),
    };
    return config;
  }

  getPerDayStats() {
    this.analyticsService
      .getPerDayRequestStats(this.getConfig())
      .subscribe((res: AverageStats) => {
        const statsData = new AverageRequestStats().deserialize(res);
        this.createdPerDay = statsData.createdTickets;
        this.closedPerDay = statsData.resolvedTickets;
        statsData.averageStats.forEach((stat) => {
          this.statCard.push({
            key: stat.key,
            label: stat.label,
            score: stat.value,
            additionalData: stat.value,
            comparisonPercent: 100,
          });
        });
      });
  }

  getAgentStats() {
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
      });
  }

  /**
   * Refreshes the stats on the page
   */
  refreshStats() {
    this.analyticsService.refreshStats.emit(true);
    this.statCard = [];
    this.getPerDayStats();
    this.getAgentStats();
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
}
