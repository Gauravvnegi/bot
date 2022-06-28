import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable, Subscription } from 'rxjs';
import {
  InhouseData,
  InhouseTable,
} from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { request } from '../../constants/request';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'hospitality-bot-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  @ViewChild('requestList') private myScrollContainer: ElementRef;
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
  globalQueries = [];
  listData;
  offset = 0;
  limit = 10;
  totalData;
  selectedRequest: InhouseData;
  parentFG: FormGroup;
  tabFilterItems = request.tabFilter;

  tabFilterIdx: number = 0;
  hotelId: string;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
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
      search: ['', Validators.minLength(3)],
    });
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForNotification();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this._requestService.selectedRequest.next(null);
        this.loadInitialRequestList([
          ...this.globalQueries,
          {
            ...this.filterData,
            order: 'DESC',
            entityType: this.entityType,
            actionType: this.tabFilterItems[this.tabFilterIdx].value,
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
            entityType: this.entityType,
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
   * @function getHotelId To set the hotel id after extractinf from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
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
          this.loadData(0, this.listData?.length || 10);
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
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          this.listData = new InhouseTable().deserialize(response).records;
          this.updateTabFilterCount(response.entityStateCounts);
          this.totalData = response.total;
          this.loading = false;
        },
        ({ error }) => this.showError(error)
      )
    );
  }

  /**
   * @function fetchDataFrom To fetch data from api.
   * @param queries The queries for data fetching.
   * @returns The observable with stream of data.
   */
  fetchDataFrom(queries): Observable<any> {
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
          entityType: this.entityType,
          actionType: this.tabFilterItems[this.tabFilterIdx].value,
        },
      ]).subscribe(
        (response) => {
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
          this.updateTabFilterCount(response.entityStateCounts);
          this.loading = false;
        },
        ({ error }) => this.showError(error)
      )
    );
  }

  /**
   * @function updateTabFilterCount To update tab filter count.
   * @param countObj The object tab data count.
   */
  updateTabFilterCount(countObj): void {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        if (tab.value !== 'ALL') tab.total = countObj[tab.value];
      });
    }
  }

  /**
   * @function onSelectedTabFilterChange To handle tab selection.
   * @param event The Mat tab selection change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.loadData(0, 10);
  }

  /**
   * @function onScroll To handle request list scroll.
   * @param event The scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event): void {
    if (!this.enableSearchField)
      if (
        this.myScrollContainer &&
        this.myScrollContainer.nativeElement.offsetHeight +
          this.myScrollContainer.nativeElement.scrollTop ===
          this.myScrollContainer.nativeElement.scrollHeight
      ) {
        if (this.totalData > this.listData.length) {
          this.offset = this.listData.length;
          if (this.parentFG.get('search').value.trim().length)
            this.getRequestWithSearchAndFilter(this.offset, this.limit);
          else this.loadData(this.offset, this.limit);
        }
      }
  }

  /**
   * @function setSelectedRequest To set selected request data.
   * @param item The request data.
   */
  setSelectedRequest(item: InhouseData): void {
    this.selectedRequest = item;
    this._requestService.selectedRequest.next(item);
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
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = false;
    this.loading = true;
    this.loadData(0, 10);
  }

  /**
   * @function getSearchValue To get request list based on search field value.
   * @param event The search event data.
   */
  getSearchValue(event: { status: boolean; response? }): void {
    if (event.status)
      this.listData = new InhouseTable().deserialize({
        records: event.response,
      }).records;
    else {
      this.loading = true;
      this.loadData(0, 10);
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
      .searchRequest(this.hotelId, {
        queryObj: this._adminUtilityService.makeQueryParams([
          ...this.globalQueries,
          {
            ...this.filterData,
            offset,
            limit,
            key: this.parentFG.get('search').value.trim(),
            entityType: this.entityType,
          },
        ]),
      })
      .subscribe(
        (response) =>
          (this.listData = new InhouseTable().deserialize({
            records: response,
          }).records),
        ({ error }) => this.showError(error)
      );
  }

  /**
   * @function showError To show error with translation.
   * @param error The error object.
   */
  showError(error) {
    this._snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: 'messages.error.some_thing_wrong',
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  }

  resetFilter() {
    this.filterData = {
      sort: '',
      order: 'DESC',
      priorityType: '',
    };
  }
}
