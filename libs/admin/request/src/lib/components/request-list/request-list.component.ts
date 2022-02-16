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
import { InhouseTable } from '../../data-models/inhouse-list.model';
import { RequestService } from '../../services/request.service';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';

@Component({
  selector: 'hospitality-bot-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  @ViewChild('requestList') private myScrollContainer: ElementRef;
  $subscription = new Subscription();
  entityType = 'Inhouse';
  enableSearchField = false;
  showFilter = false;
  filterData = {};
  loading = false;
  globalQueries = [];
  listData;
  offset = 0;
  limit = 10;
  totalData;
  selectedRequest;
  parentFG: FormGroup;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'To-Do',
      content: '',
      value: 'Pending',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Timeout',
      content: '',
      value: 'Timeout',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Close',
      content: '',
      value: 'Closed',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

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

  initFG() {
    this.parentFG = this.fb.group({
      search: ['', Validators.minLength(3)],
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForNotification();
  }

  listenForGlobalFilters() {
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

  listenForNotification() {
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

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  listenForRefreshData() {
    this.$subscription.add(
      this._requestService.refreshData.subscribe((response) => {
        if (response) {
          this.loading = true;
          this.loadData(0, this.listData?.length || 10);
        }
      })
    );
  }

  loadInitialRequestList(queries = []) {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          this.listData = new InhouseTable().deserialize(response).records;
          this.updateTabFilterCount(response.entityStateCounts);
          this.totalData = response.total;
          this.loading = false;
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  fetchDataFrom(queries): Observable<any> {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this._requestService.getAllLiveRequest(config);
  }

  loadData(offset, limit) {
    this.$subscription.add(
      this.fetchDataFrom([
        ...this.globalQueries,
        {
          ...this.filterData,
          offset,
          limit,
          order: 'DESC',
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
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  updateTabFilterCount(countObj) {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        if (tab.value !== 'ALL') tab.total = countObj[tab.value];
      });
    }
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.loadData(0, 10);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (!this.enableSearchField)
      if (
        this.myScrollContainer &&
        this.myScrollContainer.nativeElement.offsetHeight +
          this.myScrollContainer.nativeElement.scrollTop ===
          this.myScrollContainer.nativeElement.scrollHeight
      ) {
        if (this.totalData > this.listData.length) {
          this.offset = this.listData.length;
          this.loadData(this.offset, this.limit);
        }
      }
  }

  setSelectedRequest(item) {
    this.selectedRequest = item;
    this._requestService.selectedRequest.next(item);
  }

  enableSearch() {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = true;
  }

  clearSearch() {
    this.enableSearchField = false;
    this.loading = true;
    this.loadData(0, 10);
  }

  getSearchValue(event) {
    if (event.response)
      this.listData = new InhouseTable().deserialize({
        records: event.response,
      }).records;
    else {
      this.loading = true;
      this.loadData(0, 10);
    }
  }

  handleFilter(event) {
    if (event.status) {
      this.filterData = event.data;
      this.loadData(0, 10);
    }
    this.showFilter = false;
  }
}
