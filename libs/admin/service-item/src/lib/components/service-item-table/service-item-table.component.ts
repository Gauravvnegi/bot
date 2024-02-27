import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  ModuleNames,
  NavRouteOption,
  PermissionModuleNames,
  QueryConfig,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  ServiceItem,
  ServiceItemList,
} from '../../models/service-item-datatable.model';
import { ServiceItemService } from '../../services/service-item-datatable.service';
import { cols } from '../../constants/service-item-datatable.contant';
import { parmaId, serviceItemRoutes } from '../../constants/routes';
import { Router } from '@angular/router';
import {
  UserPermissionDatatableComponent,
  UserPermissionResponse,
} from 'libs/admin/roles-and-permissions/src/lib/components/user-permission-datatable/user-permission-datatable.component';
import { DialogService } from 'primeng/dynamicdialog';
import { managePermissionRoutes } from 'libs/admin/roles-and-permissions/src/lib/constants/routes';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-service-item-table',
  templateUrl: './service-item-table.component.html',
  styleUrls: [
    './service-item-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class ServiceItemTableComponent extends BaseDatatableComponent
  implements OnInit {
  navRoutes: NavRouteOption[] = [
    {
      label: 'Service Item',
      link: './',
    },
  ];
  tableName: string = 'Service Item';
  $subscription = new Subscription();
  entityId: string;
  isAllTabFilterRequired: boolean = true;
  globalQueries = [];
  cols = cols;
  readonly serviceItemRoute = serviceItemRoutes;

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private routesConfigService: RoutesConfigService,
    private serviceItemService: ServiceItemService,
    private router: Router,
    private dialogService: DialogService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.listenForGlobalFilters();
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
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
      this.initTableValue();
    });
  }

  initTableValue() {
    this.loading = true;
    this.$subscription.add(
      this.serviceItemService
        .getServiceItemList(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const data = new ServiceItemList().deserialize(res);

            this.values = data?.records;
            this.initFilters(
              data.entityTypeCounts,
              data.entityStateCounts,
              data.total
            );
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(isExport: boolean = false): QueryConfig {
    const tabFilterValue = this.tabFilterItems[this.tabFilterIdx]?.value;
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
        ...[...this.globalQueries, { order: 'DESC' }],
        ...(isExport && this.selectedRows && this.selectedRows.length > 0
          ? this.selectedRows.map((item) => ({ ids: item.id }))
          : []),
        {
          offset: this.first,
          limit: this.rowsPerPage,
          includeComplaintStats: true,
          categoryName: tabFilterValue === 'ALL' ? null : tabFilterValue,
        },
      ]),
    };
    return config;
  }

  handleStatus(status: boolean, rowData: ServiceItem): void {
    this.loading = true;
    this.$subscription.add(
      this.serviceItemService
        .updateServiceItemStatus(this.entityId, rowData.id, { status: status })
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

  openTableModal(event, data: ServiceItem) {
    event.stopPropagation();
    const modalData: Partial<UserPermissionDatatableComponent> = {
      tableType: 'SERVICE_ITEM',
      serviceItemId: data?.id,
    };
    const dialogRef = openModal({
      config: {
        width: '80%',
        styleClass: 'dynamic-modal',
        data: modalData,
      },
      dialogService: this.dialogService,
      component: UserPermissionDatatableComponent,
    });

    dialogRef.onClose.subscribe((res: UserPermissionResponse) => {
      if (res?.userId) {
        this.routesConfigService.navigate({
          moduleName: ModuleNames.SETTINGS,
          subModuleName: ModuleNames.ROLES_AND_PERMISSION,
          additionalPath: `/${
            res?.isView || !this.hasManagePermission ? 'view-user' : 'edit-user'
          }/${res?.userId}`,
        });
      }
    });
  }

  editServiceItem(id: string) {
    this.routesConfigService.navigate({
      additionalPath: serviceItemRoutes.editServiceItem.route.replace(
        ':' + parmaId.editServiceItem,
        id
      ),
    });
  }

  exportCSV(): void {
    this.loading = true;
    this.$subscription.add(
      this.serviceItemService
        .exportServiceItems(this.entityId, this.getQueryConfig(true))
        .subscribe(
          (response) => {
            FileSaver.saveAs(
              response,
              `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
            );
          },
          this.handleError,
          this.handleFinal
        )
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

  get hasManagePermission() {
    return this.subscriptionPlanService.hasManageUserPermission(
      PermissionModuleNames.USERS
    );
  }
}
