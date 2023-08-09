import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { EntityState } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable, Subscription } from 'rxjs';
import { request, RequestStatus } from '../../constants/request';
import {
  InhouseData,
  InhouseTable,
} from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';
import { AllJobRequestResponse } from '../../types/response.types';

@Component({
  selector: 'hospitality-bot-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit, OnDestroy {
  $subscription = new Subscription();
  requestConfig = request;
  entityType = 'Inhouse';
  enableSearchField = false;
  showFilter = false;
  filterData = {
    sort: '',
    order: 'DESC',
    priorityType: '',
  };
  loading = false;
  paginationDisabled = false;

  isSearchEnabled = false;

  globalQueries = [];
  listData;
  offset = 0;
  limit = 10;
  totalData;
  selectedRequest: InhouseData;
  parentFG: FormGroup;
  tabFilterItems = request.defaultTabFilter;
  tabFilterIdx = 0;
  entityId: string;

  timeInterval;
  timeLeft = [];

  constructor(
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private _requestService: RequestService,
    private _adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private firebaseMessagingService: FirebaseMessagingService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
    this._requestService.selectedRequest.next(null);
  }

  /**
   * @function initFG To initialize form group.
   */
  initFG(): void {
    this.parentFG = this.fb.group({
      search: [''],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForNotification();
    this.listenForRefreshData();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.entityId = this.globalFilterService.entityId;
        this._requestService.selectedRequest.next(null);
        this.loadInitialRequestList([
          ...this.globalQueries,
          {
            ...this.filterData,
            order: 'DESC',
            journeyType: this.entityType,
            entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
            offset: 0,
            limit:
              this.listData && this.listData.length > 10
                ? this.listData.length
                : 10,
          },
        ]);
      })
    );
  }

  /**
   * @function listenForNotification To listen for request notification.
   */
  listenForNotification(): void {
    this.firebaseMessagingService.newInhouseRequest.subscribe((response) => {
      if (response) {
        this.loadInitialRequestList([
          ...this.globalQueries,
          {
            ...this.filterData,
            order: 'DESC',
            journeyType: this.entityType,
            actionType: this.tabFilterItems[this.tabFilterIdx].value,
            offset: 0,
            limit:
              this.listData && this.listData.length > 10
                ? this.listData.length
                : 10,
          },
        ]);
      }
    });
  }

  /**
   * @function listenForRefreshData To listen for refreshing data.
   */
  listenForRefreshData(): void {
    this.$subscription.add(
      this._requestService.refreshData.subscribe((response) => {
        if (response) {
          this.loading = true;

          setTimeout(() => {
            this.loadData(0, this.listData?.length || 10);
          }, 800);
        }
      })
    );
  }

  /**
   * @function loadInitialRequestList To load the initial request list.
   * @param queries The queries for data fetching.
   */
  loadInitialRequestList(queries = []): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe((response) => {
        this.listData = new InhouseTable().deserialize(response).records;
        this.timeLeft = this.listData.map((item) => item.timeLeft);
        this.startTimeLeftTimer();

        this.initTabFilter(response.entityStateCounts, response.total);
        this.totalData = response.total;
        this.loading = false;
      })
    );
  }

  initTabFilter(
    entityStateCounts: EntityState<RequestStatus>,
    totalCount: number
  ) {
    if (entityStateCounts) {
      this._requestService.requestStatus.next(
        Object.keys(entityStateCounts) as RequestStatus[]
      );

      this.tabFilterItems = Object.entries({
        ALL: totalCount,
        ...entityStateCounts,
      }).map(([key, value]) => {
        const stateCount = {
          label: convertToTitleCase(key),
          value: key,
          total: value,
        };
        return stateCount;
      });
    } else {
      this.tabFilterItems = request.defaultTabFilter;
    }
  }

  getTitleCaseValue(value: string) {
    return convertToTitleCase(value);
  }

  /**
   * @function fetchDataFrom To fetch data from api.
   * @param queries The queries for data fetching.
   * @returns The observable with stream of data.
   */
  fetchDataFrom(queries): Observable<AllJobRequestResponse> {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this._requestService.getAllLiveRequest(config);
  }

  /**
   * @function loadData To load request list data.
   * @param offset The page offset.
   * @param limit The limit of data to be fetched.
   */
  loadData(offset: number, limit: number): void {
    this.$subscription.add(
      this.fetchDataFrom([
        ...this.globalQueries,
        {
          ...this.filterData,
          offset,
          limit,
          journeyType: this.entityType,
          actionType: this.tabFilterItems[this.tabFilterIdx].value,
        },
      ]).subscribe((response) => {
        if (offset === 0)
          this.listData = new InhouseTable().deserialize(response).records;
        else
          this.listData = [
            ...new Map(
              [
                ...this.listData,
                ...new InhouseTable().deserialize(response).records,
              ].map((item) => [item.id, item])
            ).values(),
          ];
        this.totalData = response.total;
        this.initTabFilter(response.entityStateCounts, response.total);
        this.loading = false;
      })
    );
  }

  // /**
  //  * @function updateTabFilterCount To update tab filter count.
  //  * @param countObj The object tab data count.
  //  */
  // updateTabFilterCount(countObj, total): void {
  //   if (countObj) {
  //     this.tabFilterItems.forEach((tab) => {
  //       tab.value === 'ALL'
  //         ? (tab.total = total)
  //         : (tab.total = countObj[tab.value]);
  //     });
  //   }
  // }

  /**
   * @function onSelectedTabFilterChange To handle tab selection.
   * @param event The Mat tab selection change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.loadData(0, 10);
  }

  /**
   * @function loadMore To handle request list scroll.
   */
  loadMore(): void {
    if (!this.enableSearchField) {
      this.paginationDisabled = this.totalData <= this.listData.length;
      if (!this.paginationDisabled) {
        this.offset = this.listData.length;
        if (this.parentFG.get('search').value.trim().length)
          this.getRequestWithSearchAndFilter(this.offset, this.limit);
        else this.loadData(this.offset, this.limit);
      }
    }
  }

  startTimeLeftTimer() {
    this.timeInterval = setInterval(() => {
      this.timeLeft = this.timeLeft.map((item) =>
        item - 1 > 0 ? item - 1 : 0
      );
    }, 1000 * 60);
  }

  /**
   * @function setSelectedRequest To set selected request data.
   * @param item The request data.
   */
  setSelectedRequest(item: InhouseData, i: number): void {
    clearInterval(this.timeInterval);

    const request = item;
    request.timeLeft = this.timeLeft[i];
    this.startTimeLeftTimer();
    // this logic will be removed api should be call to get the new data

    this.selectedRequest = request;
    this._requestService.selectedRequest.next(request);
  }

  /**
   * @function enableSearch To enable search field.
   */
  enableSearch(): void {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = true;
  }

  /**
   * @function clearSearch To clear search field.
   */
  clearSearch(): void {
    this.parentFG.patchValue({ search: '' }, { emitEvent: false });
    this.enableSearchField = false;

    if (this.isSearchEnabled) {
      this.loading = true;
      this.loadData(0, 10);
      this.isSearchEnabled = false;
    }
  }

  /**
   * @function getSearchValue To get request list based on search field value.
   * @param event The search event data.
   */
  getSearchValue(event: { status: boolean; response? }): void {
    if (event.status) {
      this.listData = new InhouseTable().deserialize({
        records: event.response,
      }).records;
      this.isSearchEnabled = true;
    } else {
      if (this.isSearchEnabled) {
        this.isSearchEnabled = false;
        this.loading = true;
        this.loadData(0, 10);
      }
    }
  }

  /**
   * @function handleFilter To handle filter submit.
   * @param event The filter event data.
   */
  handleFilter(event: { status: boolean; data? }): void {
    if (event.status) {
      this.filterData = event.data;
      if (this.parentFG.get('search').value.trim().length)
        this.getRequestWithSearchAndFilter(0, 10);
      else this.loadData(0, 10);
    }
    this.showFilter = false;
  }

  /**
   * @function getRequestWithSearchAndFilter To get request data with search and filter.
   * @param offset The page offset.
   * @param limit The limit of data to be fetched.
   */
  getRequestWithSearchAndFilter(offset, limit): void {
    this._requestService
      .searchRequest(this.entityId, {
        queryObj: this._adminUtilityService.makeQueryParams([
          ...this.globalQueries,
          {
            ...this.filterData,
            offset,
            limit,
            key: this.parentFG.get('search').value.trim(),
            journeyType: this.entityType,
          },
        ]),
      })
      .subscribe(
        (response) =>
          (this.listData = new InhouseTable().deserialize({
            records: response,
          }).records)
      );
  }

  resetFilter() {
    this.filterData = {
      sort: '',
      order: 'DESC',
      priorityType: '',
    };
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    clearInterval(this.timeInterval);
  }
}
