import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TableData } from '../../data-models/subscription.model';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'hospitality-bot-hotel-usage-datatable',
  templateUrl: './hotel-usage-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './hotel-usage-datatable.component.scss',
  ],
})
export class HotelUsageDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Input() featureData;

  tableName = 'Usage of Hotel';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;
  globalQueries = [];
  tabFilterIdx = 1;
  $subscription = new Subscription();
  hotelId;
  usageData;

  cols = [
    { field: 'serviceType', header: 'Type of Service' },
    { field: 'name', header: 'Name' },
    { field: 'limit', header: 'Limit' },
    { field: 'usage', header: 'Usage' },
  ];

  documentActionTypes = [
    {
      label: 'Export All',
      value: 'exportAll',
      type: '',
      defaultLabel: 'Export All',
    },
  ];

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private subscriptionService: SubscriptionService,
    private globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private _snackbarService: SnackBarService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.initTableData();
    this.listenForGlobalFilters();
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

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initTableData(): void {
    if (this.featureData) {
      this.usageData = new TableData().deserialize(this.featureData).data;
      this.totalRecords = this.usageData.length;
      this.getFilteredData();
    }
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

    this.$subscription.add(
      this.subscriptionService.exportCSV(this.hotelId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith'): void {
    // value = value && value.trim();
    // this.table.filter(value, field, matchMode);

    if (!!value && !this.isSearchSet) {
      this.tempFirst = this.first;
      this.tempRowsPerPage = this.rowsPerPage;
      this.isSearchSet = true;
    } else if (!!!value) {
      this.isSearchSet = false;
      this.first = this.tempFirst;
      this.rowsPerPage = this.tempRowsPerPage;
    }

    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
