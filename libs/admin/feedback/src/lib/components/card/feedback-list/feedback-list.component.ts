import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  sharedConfig,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { Observable, Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import {
  FeedbackList,
  User,
  UserList,
} from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
})
export class FeedbackListComponent implements OnInit {
  @Input() entityType;
  @Input() outlets;
  @Input() colorMap;
  @Input() feedbackType: string;
  @ViewChild('feedbackListContainer') private myScrollContainer: ElementRef;
  parentFG: FormGroup;
  tabFilterItems = card.list.tabFilterItems;
  selectedFeedback;
  tabFilterIdx: number = 0;
  hotelId: string;
  $subscription = new Subscription();
  globalQueries = [];
  enableSearchField = false;
  loading = false;
  showFilter = false;
  userList: User[];
  feedbackList;
  filterData = {};
  pagination = {
    offset: 0,
    limit: 20,
  };
  totalRecords = 0;
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private firebaseMessagingService: FirebaseMessagingService,
    private cardService: CardService,
    private statisticService: StatisticsService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
    this.cardService.$selectedFeedback.next(null);
  }

  initFG() {
    this.parentFG = this.fb.group({
      search: ['', Validators.minLength(3)],
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.listenForOutletChanged();
    this.listenForEntityTypeChange();
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
        this.cardService.$selectedFeedback.next(null);
        this.getUsersList();
        this.filterData = {
          ...this.filterData,
          order: sharedConfig.defaultOrder,
          feedbackType: this.feedbackType,
          entityType: this.entityType,
          entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
        };
        this.pagination = {
          offset: 0,
          limit: 20,
        };
        this.loadData();
      })
    );
  }

  getUsersList() {
    this.$subscription.add(
      this.cardService
        .getUsersList(this.hotelId)
        .subscribe(
          (response) => (this.userList = new UserList().deserialize(response))
        )
    );
  }

  /**
   * @function listenForOutletChanged To listen for outlet tab change.
   */
  listenForOutletChanged(): void {
    this.$subscription.add(
      this.statisticService.$outletChange.subscribe((response) => {
        if (response) {
          this.globalQueries.forEach((element) => {
            if (element.hasOwnProperty('entityIds')) {
              element.entityIds = this.statisticService.outletIds;
            }
          });
        }
      })
    );
  }

  listenForEntityTypeChange() {
    this.$subscription.add(
      this.cardService.$selectedEntityType.subscribe((response) => {
        if (response) {
          this.entityType = response;
          this.filterData = { ...this.filterData, entityType: response };
          this.loadData();
        }
      })
    );
  }

  loadInitialData(queries = []) {
    if (this.feedbackList && !this.feedbackList.length) this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          this.feedbackList =
            this.pagination.offset > 0
              ? [
                  ...this.feedbackList,
                  ...new FeedbackList().deserialize(
                    response,
                    this.outlets,
                    this.feedbackType,
                    this.colorMap
                  ).records,
                ]
              : new FeedbackList().deserialize(
                  response,
                  this.outlets,
                  this.feedbackType,
                  this.colorMap
                ).records;
          this.totalRecords = response.total;
          response.entityTypeCounts &&
            this.cardService.$tabValues.next(response.entityTypeCounts);
          response.entityStateCounts &&
            this.updateTabFilterCounts(response.entityStateCounts);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
        () => (this.loading = false)
      )
    );
  }

  updateTabFilterCounts(object) {
    this.tabFilterItems.forEach((item) => (item.total = object[item.value]));
  }

  fetchDataFrom(queries): Observable<any> {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this.cardService.getFeedbackList(config);
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  enableSearch() {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = true;
  }

  clearSearch() {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = false;
    this.loading = true;
  }

  getSearchValue(event) {
    if (event.status) {
      this.feedbackList = new FeedbackList().deserialize(
        { records: event.response },
        this.outlets,
        this.feedbackType,
        this.colorMap
      ).records;
    } else {
      this.loading = true;
      this.pagination.offset = 0;
      this.loadData();
    }
  }

  onSelectedTabFilterChange(event) {
    this.clearRecords();
    this.tabFilterIdx = event.index;
    this.filterData = {
      ...this.filterData,
      entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
    };
    this.pagination.offset = 0;
    this.loadData();
  }

  setSelectedItem(item) {
    this.cardService.$selectedFeedback.next(item);
    this.selectedFeedback = item;
  }

  handleFilter(event) {
    if (event.status) {
      this.filterData = { ...this.filterData, ...event.data };
      this.loadData();
    }
    this.showFilter = false;
  }

  loadData() {
    if (this.search.length) {
      this.loading = true;
      this.clearRecords();
      this.filterData = {
        ...this.filterData,
        entityState: '',
      };
      this.$subscription.add(
        this.cardService
          .searchFeedbacks({
            queryObj: this._adminUtilityService.makeQueryParams([
              ...this.globalQueries,
              this.filterData,
              { key: this.search },
            ]),
          })
          .subscribe(
            (response) =>
              (this.feedbackList = new FeedbackList().deserialize(
                { records: response },
                this.outlets,
                this.feedbackType,
                this.colorMap
              ).records),
            ({ error }) =>
              this._snackbarService.openSnackBarAsText(error.message),
            () => (this.loading = false)
          )
      );
    } else {
      this.filterData = {
        ...this.filterData,
        entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
      };
      this.loadInitialData([
        ...this.globalQueries,
        this.filterData,
        this.pagination,
      ]);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (!this.search.length)
      if (
        this.myScrollContainer &&
        this.myScrollContainer.nativeElement.offsetHeight +
          this.myScrollContainer.nativeElement.scrollTop ===
          this.myScrollContainer.nativeElement.scrollHeight
      ) {
        if (this.totalRecords > this.feedbackList.length) {
          this.pagination.offset = this.feedbackList.length;
          this.loadData();
        }
      }
  }

  clearRecords() {
    this.feedbackList = new FeedbackList().deserialize(
      { records: [] },
      this.outlets,
      this.feedbackType,
      this.colorMap
    );
  }

  get search(): string {
    return this.parentFG.get('search')?.value;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
