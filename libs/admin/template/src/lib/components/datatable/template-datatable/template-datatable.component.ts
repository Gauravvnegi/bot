import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseDatatableComponent,
  NavRouteOption,
  PermissionModuleNames,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TopicService } from 'libs/admin/shared/src/lib/services/topic.service';
import { SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { templateConfig } from '../../../constants/template';
import { Templates } from '../../../data-models/templateConfig.model';
import { TemplateService } from '../../../services/template.service';
import {
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { templateRoutes } from '../../../constants/routes';

@Component({
  selector: 'hospitality-bot-template-datatable',
  templateUrl: './template-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './template-datatable.component.scss',
  ],
})
export class TemplateDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = templateConfig.datatable.title;
  actionButtons = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isAllTabFilterRequired = false;
  globalQueries = [];
  $subscription = new Subscription();
  entityId: any;
  cols = templateConfig.datatable.cols;
  isAllATabItem = true;
  navRoutes: NavRouteOption[] = [
    {
      label: 'Library',
      link: './',
    },
  ];
  selectedTab: string = 'WHATSAPP';

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private _router: Router,
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private _topicService: TopicService,
    protected _translateService: TranslateService,
    private routesConfigServices: RoutesConfigService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.selectedTab = this.isPermissionTo.viewWhatsapp ? 'WHATSAPP' : 'EMAIL';

    this.templateService.templateFormData.next(null);
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.entityId = this.globalFilterService.entityId;
      this.loadTableValue();
    });
  }

  loadTableValue(): void {
    this.loadInitialData([
      {
        order: sharedConfig.defaultOrder,
        entityType: this.selectedTab,
      },
      ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
    ]);
  }

  /**
   * @function loadInitialData To load the initial data for datatable.
   * @param queries The filter list with date and hotel filters.
   * @param loading The loading status.
   */
  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function setRecords To set records after getting reponse from an api.
   * @param data The data is a response which comes from an api call.
   */
  setRecords(data): void {
    const responseData = new Templates().deserialize(data);
    this.values = responseData.records;

    if (!this.isPermissionTo.viewEmail) {
      delete responseData.entityTypeCounts['EMAIL'];
    }
    if (!this.isPermissionTo.viewWhatsapp) {
      delete responseData.entityTypeCounts['WHATSAPP'];
    }

    this.initFilters(
      responseData.entityTypeCounts,
      responseData.entityStateCounts,
      responseData.total
    );

    this.loading = false;
  }

  /**
   * @function fetchDataFrom Returns an observable for the template list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with template list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.templateService.getHotelTemplate(config, this.entityId);
  }

  /**
   * @function updateTemplateStatus update status of a template record.
   * @param event active & inactive event check.
   * @param templateId The template id for which status update action will be done.
   */
  updateTemplateStatus(status, userData): void {
    this.loading = true;
    this.templateService
      .updateTemplateStatus(this.entityId, { active: status }, userData.id, {
        params: `?channel=${this.selectedTab}`,
      })
      .subscribe(
        (_) => {
          this.loadData();
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.STATUS_UPDATED`,
              priorityMessage: 'Status Updated Successfully.',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.loading = false;
        }
      );
  }

  /**
   * @function openCreateTemlplate navigate to create template page.
   */
  openCreateTemplate() {
    this.routesConfigServices.navigate({
      additionalPath: templateRoutes.createTemplate.route,
    });
  }

  /**
   * @function openCreateTemlplate navigate to edit template page.
   */
  openEditTemplate(event, template): void {
    event.stopPropagation();
    this._router.navigate(
      [templateRoutes.editTemplate.route.replace(':templateId', template.id)],
      {
        relativeTo: this.route,
      }
    );
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(): void {
    this.loading = true;
    // this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
            entityType: this.selectedTab,
          },
          ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        }
      ).subscribe(
        (data) => {
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          exportType: 'CSV',
          channel: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.templateService.exportCSV(this.entityId, config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
        }
      )
    );
  }

  /**
   * @function templateConfiguration returns templateConfig object.
   * @returns templateConfig object.
   */
  get templateConfiguration() {
    return templateConfig;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get isPermissionTo() {
    return {
      viewEmail: this.subscriptionPlanService.checkViewPermission(
        PermissionModuleNames.EMAIL_CAMPAIGN
      ),
      viewWhatsapp: this.subscriptionPlanService.checkViewPermission(
        PermissionModuleNames.WHATSAPP_CAMPAIGN
      ),
      editEmail: this.subscriptionPlanService.hasManageUserPermission(
        PermissionModuleNames.EMAIL_CAMPAIGN
      ),
    };
  }
}
