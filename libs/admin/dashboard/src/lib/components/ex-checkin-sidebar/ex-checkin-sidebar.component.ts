import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { AnalyticsService } from 'libs/admin/request-analytics/src/lib/services/analytics.service';
import * as moment from 'moment';
import { PreArrivalRequestList } from '../../data-models/ex-checkin.model';

@Component({
  selector: 'hospitality-bot-ex-checkin-sidebar',
  templateUrl: './ex-checkin-sidebar.component.html',
  styleUrls: ['./ex-checkin-sidebar.component.scss'],
})
export class ExCheckinSidebarComponent implements OnInit {
  @Output() onCloseSidebar = new EventEmitter();
  loading: boolean = false;

  timestamps: string[] = [];
  tabFilterItems = [
    { label: 'Guest', value: 'GUEST' },
    { label: 'Pre-Arrival Request', value: 'PRE_ARRIVAL_REQUEST' },
  ];

  tabFilterIdx = 0;
  entityId: string;
  preArrivalRequestList = [];

  constructor(
    private _adminUtilityService: AdminUtilityService,
    private analyticsService: AnalyticsService,
    private globalFilterService: GlobalFilterService
  ) {
    this.entityId = this.globalFilterService.entityId;
  }

  ngOnInit(): void {}

  getPreArrivalRequest() {
    this.loading = true;
    const query = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          fromDate: moment.utc().startOf('day').valueOf(),
          toDate: moment.utc().endOf('day').valueOf(),
          order: 'DESC',
          entityType: 'ALL',
          journeyType: 'pre-arrival',
          entityId: this.entityId,
        },
      ]),
    };

    this.analyticsService.getInhouseRequest(query).subscribe((res) => {
      this.preArrivalRequestList = new PreArrivalRequestList().deserialize(
        res
      ).PreArrivalRequest;
      this.loading = false;
    });
  }

  onSelectedTabFilterChange(index: number) {
    this.tabFilterIdx = index;

    if (this.tabFilterItems[index].value === 'PRE_ARRIVAL_REQUEST') {
      this.getPreArrivalRequest();
    } else {
      this.preArrivalRequestList = [];
    }
  }
}
