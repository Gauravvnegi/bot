import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Subscription } from 'rxjs';
import { chips, cols, title } from '../../constant/data-table';
import { PackageList } from '../../models/packages.model';
import { PackagesService } from '../../services/packages.service';
import { PackageData } from '../../types/package';
import { PackageListResponse, PackageResponse } from '../../types/response';
import { packagesRoutes } from '../../constant/routes';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOption } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-package-datatable',
  templateUrl: './package-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './package-datatable.component.scss',
  ],
})
export class PackageDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = packagesRoutes;

  entityId: string;
  tableName = title;

  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = true;
  isAllTabFilterRequired = true;
  globalQueries = [];
  $subscription = new Subscription();
  navRoutes: NavRouteOption[] = [
    {
      label: 'Library',
      link: './',
    },
  ];

  cols = cols;

  constructor(
    public fb: FormBuilder,
    private packagesService: PackagesService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    private routesConfigService: RoutesConfigService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
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
      this.initTableValue();
    });
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue(): void {
    this.loading = true;
    this.$subscription.add(
      this.packagesService
        .getLibraryItems<PackageListResponse>(
          this.entityId,
          this.getQueryConfig()
        )
        .subscribe(
          (res) => {
            const packageList = new PackageList().deserialize(res);
            this.values = packageList.records;
            this.initFilters(
              packageList.entityTypeCounts,
              packageList.entityStateCounts,
              packageList.total
            );
          },
          ({ error }) => {
            this.values = [];
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          type: LibraryItem.package,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { order: 'DESC' },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        {
          type: LibraryItem.package,
          pagination: true,
          limit: this.totalRecords,
        },
      ]),
    };

    this.$subscription.add(
      this.packagesService.exportCSV(this.entityId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        (error) => (this.loading = false),
        () => (this.loading = false)
      )
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: boolean, rowData): void {
    // Not working
    this.loading = true;
    this.$subscription.add(
      this.packagesService
        .updateLibraryItem<Partial<PackageData>, PackageResponse>(
          this.entityId,
          rowData.id,
          { active: status },
          { params: '?type=PACKAGE' }
        )
        .subscribe(
          () => {
            this.initTableValue();
            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          ({ error }) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  /**
   * @function editPackage To Edit the service
   */
  editPackage(id: string) {
    this.routesConfigService.navigate({
      additionalPath: packagesRoutes.editPackage.route.replace(':id', id),
    });
  }

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
