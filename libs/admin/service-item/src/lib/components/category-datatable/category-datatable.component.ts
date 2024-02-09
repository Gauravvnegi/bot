import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOption,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ServiceItemService } from '../../services/service-item-datatable.service';
import { categoryCols } from '../../constants/service-item-category-datable.constant';
import { CategoryList } from '../../models/service-item-category-datable.model';
import { LazyLoadEvent } from 'primeng/api';
import { parmaId, serviceItemRoutes } from '../../constants/routes';

@Component({
  selector: 'hospitality-bot-category-datatable',
  templateUrl: './category-datatable.component.html',
  styleUrls: [
    './category-datatable.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class CategoryDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Categories';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;
  globalQueries = [];
  tabFilterIdx = 1;
  $subscription = new Subscription();
  entityId;
  isQuickFilters = false;
  cols = categoryCols;
  readonly serviceItemRoutes = serviceItemRoutes;
  navRoutes: NavRouteOption[] = serviceItemRoutes.manageCategory.navRoutes;

  constructor(
    public fb: FormBuilder,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private router: Router,
    private routesConfigService: RoutesConfigService,
    private serviceItemService: ServiceItemService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initNavRoutes();
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.$subscription.add(
      this.serviceItemService
        .getCategoryList(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const data = new CategoryList().deserialize(res);

            this.values = data?.records;
            this.initFilters({}, data.entityStateCounts, data.total);
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.entityId = this.globalFilterService.entityId;
      //fetch-api for records
      this.initTableValue();
    });
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const tabFilterValue = this.tabFilterItems[this.tabFilterIdx]?.value;
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
          includeItems: true,
        },
      ]),
    };
    return config;
  }

  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.$subscription.add(
      this.serviceItemService
        .updateCategoryStatus(this.entityId, rowData.id, { status: status })
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
            this.values = [];
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  onEditCategory(id: string) {
    this.router.navigate(
      [
        serviceItemRoutes.editCategory.route.replace(
          ':' + parmaId.editCategory,
          id
        ),
      ],
      {
        relativeTo: this.route,
      }
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
