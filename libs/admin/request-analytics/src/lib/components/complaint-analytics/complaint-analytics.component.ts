import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ConfigService,
  StatCard,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { MatDialogConfig } from '@angular/material/dialog';
import { AddItemComponent } from 'libs/admin/request/src/lib/components/add-item/add-item.component';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import { DateService } from '@hospitality-bot/shared/utils';
import { AnalyticsService } from '../../services/analytics.service';
import { AverageStats, DistributionStats } from '../../types/response.types';
import { AverageRequestStats } from '../../models/statistics.model';

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

  $subscription = new Subscription();

  constructor(
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private snackBarService: SnackBarService,
    private modalService: ModalService,
    private dateService: DateService,
    private analyticsService: AnalyticsService,
    private adminUtilityService: AdminUtilityService
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

  createServiceItem() {
    //to open add new item pop up

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '90vh';

    const addItemCompRef = this.modalService.openDialog(
      AddItemComponent,
      dialogConfig
    );

    this.$subscription.add(
      addItemCompRef.componentInstance.onClose.subscribe(() => {
        addItemCompRef.close();
      })
    );
  }

  raiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '500px';
    dialogConfig.height = '90vh';

    const raiseRequestCompRef = this.modalService.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          raiseRequestCompRef.close();
        }
      )
    );
  }
}