import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
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
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { TopicRoutes } from '../../../constants/routes';
import { topicConfig } from '../../../constants/topic';
import { Topics } from '../../../data-models/topicConfig.model';
import { TopicService } from '../../../services/topic.service';

@Component({
  selector: 'hospitality-bot-topic-datatable',
  templateUrl: './topic-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './topic-datatable.component.scss',
  ],
})
export class TopicDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = topicConfig.datatable.title;
  actionButtons = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  isAllTabFilterRequired = true;
  cols = topicConfig.datatable.cols;
  globalQueries = [];
  $subscription = new Subscription();
  entityId: any;

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected tabFilterService: TableService,
    protected _modal: ModalService,
    private _router: Router,
    private route: ActivatedRoute,
    private topicService: TopicService,
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
      this.entityId = this.globalFilterService.entityId;
      // fetch-api for records
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
        },
        ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
      ]);
    });
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
    const modifiedData = new Topics().deserialize(data);
    this.values = modifiedData.records;
    this.initFilters(
      modifiedData.entityTypeCounts,
      modifiedData.entityStateCounts,
      modifiedData.total
    );
    this.loading = false;
  }

  /**
   * @function fetchDataFrom Returns an observable for the topic list api call.
   * @param queries The filter list with date and hotel filters.
   * @param defaultProps The default table props to control data fetching.
   * @returns The observable with topic list.
   */
  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.topicService.getHotelTopic(config, this.entityId);
  }

  /**
   * @function updateTopicStatus update status of a topic record.
   * @param event active & inactive event check.
   * @param topicId The topic id for which status update action will be done.
   */
  updateTopicStatus(event, topicId): void {
    this.loading = true;
    const data = {
      active: event.checked,
    };
    this.topicService.updateTopicStatus(this.entityId, data, topicId).subscribe(
      (response) => {
        this.loadData();
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: 'message.success.topic_status_updated',
              priorityMessage: 'Status Updated Successfully..',
            },
            '',
            {
              panelClass: 'success',
            }
          )
          .subscribe();
        this.loading = false;
      },
      ({ error }) => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
  }

  /**
   * @function openCreateTopic navigate to create topic page.
   */
  openCreateTopic() {
    this._router.navigate([TopicRoutes.createTopic.route], {
      relativeTo: this.route,
    });
  }

  /**
   * @function openTopic navigate to edit topic page.
   * @param event to stop openCreateTopic navigation.
   * @param topic The topic for which edit action will be done.
   */
  openTopic(event, topic): void {
    event.stopPropagation();
    this._router.navigate([`${TopicRoutes.createTopic.route}/${topic.id}`], {
      relativeTo: this.route,
    });
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
          },
          ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
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
          this.loading = false;
          this.values = [];
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
        },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.topicService.exportCSV(this.entityId, config).subscribe(
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
   * @function topicConfiguration returns topicConfig object.
   * @returns topicConfig object.
   */
  get topicConfiguration() {
    return topicConfig;
  }

  handleFinal() {
    this.loading = false;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
