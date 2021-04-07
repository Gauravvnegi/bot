import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription, Observable } from 'rxjs';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { TableData } from '../../data-models/subscription.model';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';

@Component({
  selector: 'hospitality-bot-hotel-usage-datatable',
  templateUrl: './hotel-usage-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './hotel-usage-datatable.component.scss',
  ],
})
export class HotelUsageDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Usage of Hotel';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;
  globalQueries = [];
  tabFilterIdx: number = 1;
  $subscription = new Subscription();
  hotelId;
  usageData;

  cols = [
    { field: 'serviceType', header: 'Type of Service' },
    { field: 'name', header: 'Name' },
    { field: 'limit', header: 'Limit' },
    { field: 'usage', header: 'Usage' },
  ];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private subscriptionService: SubscriptionPlanService,
    private router: Router,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    // this.listenForGlobalFilters();
    this.listenForSubscriptionPlan();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
    });
  }

  listenForSubscriptionPlan(): void {
    this.$subscription.add(
      this.subscriptionService.subscription$.subscribe((response) => {
        // console.log(new TableData().deserialize(response).data);
        this.usageData = new TableData().deserialize(response).data;
        this.totalRecords = this.usageData.length;
        this.getFilteredData();
      })
    );
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getFilteredData(
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ) {
    this.values = this.usageData.filter(
      (data, i) => i >= this.first && i < this.first + this.rowsPerPage
    );
  }

  loadData(event: LazyLoadEvent): void {
    this.updatePaginations(event);
    this.getFilteredData();
  }

  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  exportCSV(): void {
    // this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
  }

  redirectToAddPackage(): void {
    this.router.navigate(['add'], { relativeTo: this.route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith'): void {
    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }
}
