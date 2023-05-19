import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import {
  BaseDatatableComponent,
  TableService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { SelectedEntityState } from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TopicService } from 'libs/admin/shared/src/lib/services/topic.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { templateConfig } from '../../../constants/template';
import { Templates } from '../../../data-models/templateConfig.model';
import { TemplateService } from '../../../services/template.service';

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
  @Input() tabFilterItems;
  @Input() tabFilterIdx = 0;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = templateConfig.rowsPerPage.datatableLimit;
  globalQueries = [];
  $subscription = new Subscription();
  hotelId: any;
  cols = templateConfig.datatable.cols;
  chips = templateConfig.datatable.chips;

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected tabFilterService: TableService,
    protected _modal: ModalService,
    private _router: Router,
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private _topicService: TopicService,
    protected _translateService: TranslateService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
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
      this.hotelId = this.globalFilterService.hotelId;
      this.setTabFilterItems();
    });
  }

  /**
   * @function setTabFilterItems function to set tab filter items.
   */
  setTabFilterItems() {
    this.tabFilterItems = [
      {
        label: 'All',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: this.chips,
      },
    ];
    const topicConfig = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.topicConfig.limit,
        },
      ]),
    };
    this.$subscription.add(
      this._topicService
        .getHotelTopic(topicConfig, this.hotelId)
        .subscribe((response) => {
          response.records.forEach((topic) =>
            this.tabFilterItems.push({
              label: topic.name,
              content: '',
              value: topic.name,
              disabled: false,
              total: 0,
              lastPage: 0,
              chips: this.chips,
            })
          );
          this.loadInitialData([
            {
              order: sharedConfig.defaultOrder,
              entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
            },
            ...this.getSelectedQuickReplyFilters(),
          ]);
        })
    );
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
    data.entityTypeCounts &&
      this.updateTabFilterCount(data.entityTypeCounts, data.total);
    data.entityStateCounts &&
      this.updateQuickReplyFilterCount(data.entityStateCounts);
    this.updateTotalRecords();
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
    return this.templateService.getHotelTemplate(config, this.hotelId);
  }

  /**
   * @function updateTemplateStatus update status of a template record.
   * @param event active & inactive event check.
   * @param templateId The template id for which status update action will be done.
   */
  updateTemplateStatus(status, userData): void {
    const data = {
      active: status,
    };
    this.templateService
      .updateTemplateStatus(this.hotelId, data, userData.id)
      .subscribe(
        (_) => {
          const statusValue = (val: boolean) => (val ? 'ACTIVE' : 'INACTIVE');
          this.updateStatusAndCount(
            statusValue(userData.status),
            statusValue(status)
          );
          this.values.find((item) => item.id === userData.id).status = status;

          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.STATUS_UPDATED`,
              priorityMessage: 'Status Updated Successfully.',
            },
            '',
            { panelClass: 'success' }
          );
          this.changePage(this.currentPage);
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
    this._router.navigate(['create'], { relativeTo: this.route });
  }

  /**
   * @function openCreateTemlplate navigate to edit template page.
   */
  openEditTemplate(event, template): void {
    event.stopPropagation();
    this._router.navigate([`edit/${template.id}`], { relativeTo: this.route });
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips value.
   */
  getSelectedQuickReplyFilters(): SelectedEntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected === true)
      .map((item) => ({
        entityState: item.value,
      }));
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
          {
            order: sharedConfig.defaultOrder,
            entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
          },
          ...this.getSelectedQuickReplyFilters(),
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
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
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
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.loadData();
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
   */
  onFilterTypeTextChange(
    value: string,
    field: string,
    matchMode = 'startsWith'
  ): void {
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
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.templateService.exportCSV(this.hotelId, config).subscribe(
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
}
