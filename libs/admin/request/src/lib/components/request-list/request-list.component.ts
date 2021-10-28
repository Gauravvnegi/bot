import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable, Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss'],
})
export class RequestListComponent implements OnInit {
  @ViewChild('requestList') private myScrollContainer: ElementRef;
  $subscription = new Subscription();
  entityType = 'Inhouse';
  globalQueries = [];
  listData = [];
  offset = 0;
  limit = 10;
  totalData;
  selectedRequest;
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
      value: 'Immediate',
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
      label: 'Closed',
      content: '',
      value: 'Closed',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

  tabFilterIdx: number = 0;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _requestService: RequestService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.loadInitialRequestList([
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.entityType,
            actionType: this.tabFilterItems[this.tabFilterIdx].value,
            offset: 0,
            limit: 10,
          },
        ]);
      })
    );
  }

  loadInitialRequestList(queries = []) {
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          this.listData = response.records;
          this.updateTabFilterCount(response.entityStateCounts);
          this.totalData = response.total;
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
          offset,
          limit,
          order: 'DESC',
          entityType: this.entityType,
          actionType: this.tabFilterItems[this.tabFilterIdx].value,
        },
      ]).subscribe(
        (response) => {
          if (offset === 0) this.listData = response.records;
          else
            this.listData = [
              ...new Map(
                [...this.listData, ...response.records].map((item) => [
                  item.id,
                  item,
                ])
              ).values(),
            ];
          this.totalData = response.total;
          this.updateTabFilterCount(response.entityStateCounts);
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
    this.loadData(0, 10);
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
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
    } else if (this.myScrollContainer.nativeElement.scrollTop === 0) {
      this.offset = 0;
      this.loadData(this.offset, this.limit);
    }
  }

  setSelectedRequest(item) {
    this.selectedRequest = item;
    this._requestService.selectedRequest.next(item);
  }
}
