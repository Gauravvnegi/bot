import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { taxRoutes } from '../../constants/routes';
import { cols, title } from '../../constants/data-table';
import { Subject, Subscription } from 'rxjs';
import { TaxService } from '../../services/tax.service';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { TaxList } from '../../models/tax.model';
import { QueryConfig } from '../../types/tax';
import * as FileSaver from 'file-saver';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-tax-data-table',
  templateUrl: './tax-data-table.component.html',
  styleUrls: [
    './tax-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class TaxDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = taxRoutes;
  entityId: string;
  tableName = title;
  cols = cols;
  isCustomSort = true;
  triggerInitialData = false;
  isAllTabFilterRequired = true;
  globalQueries = [];
  $subscription = new Subscription();
  navRoutes: NavRouteOptions;
  private destroyed$ = new Subject<void>();

  constructor(
    public fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private taxService: TaxService,
    private router: Router,
    private route: ActivatedRoute,
    protected tabFilterService: TableService,
    private routesConfigService: RoutesConfigService
  ) {
    super(fb, tabFilterService);
    const { navRoutes } = taxRoutes['tax'];
  }

  ngOnInit(): void {
    // this.entityId = this.globalFilterService.entityId;
    // this.initTableValue();
    this.initNavRoutes();
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = navRoutesRes;
    });
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  onEntityTabFilterChanges(event): void {
    this.destroyed$.next();
    this.entityId = event.entityId[0];
    this.taxService.entityId = this.entityId;
    this.initTableValue();
  }

  /**
   * @function initTableValue
   * @description To get table data
   */

  initTableValue(): void {
    this.loading = true;
    this.$subscription.add(
      this.taxService
        .getTaxList(this.entityId, this.getQueryConfig())
        .pipe(takeUntil(this.destroyed$))
        .subscribe(
          (res) => {
            const taxList = new TaxList().deserialize(res);

            this.values = taxList.records;
            this.initFilters(
              taxList.entityTypeCounts,
              taxList.entityStateCounts,
              taxList.total
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
        ...this.getSelectedQuickReplyFilters({
          isStatusBoolean: true,
          key: 'entityState',
        }),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
          entityId: this.entityId,
        },
      ]),
    };

    return config;
  }

  /**
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.taxService
      .updateTax(this.entityId, rowData.id, { status: status })
      .subscribe(
        (res) => {
          this.initTableValue();
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.loading = false;
          this.values = [];
        },
        this.handleFinal
      );
  }

  /**
   * @function exportCSV
   * @description To export the data
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { order: 'DESC', entityId: this.entityId },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.taxService.exportCSV(this.entityId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        () => {},
        this.handleFinal
      )
    );
  }

  onCreateNewTax(): void {
    this.router.navigate([this.routes.createTax.route], {
      relativeTo: this.route,
    });
  }

  /**
   * @function editTax
   * @description To edit the tax
   */

  editTax(data): void {
    this.taxService.entityId = data.entityId;
    this.router.navigate([`${this.routes.editTax.route}/${data?.id}`], {
      relativeTo: this.route,
    });
  }

  /**
   *  @function handleFinal
   * @description To handle the loading status
   */
  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
