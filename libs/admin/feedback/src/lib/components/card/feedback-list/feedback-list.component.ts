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
import { ComingSoonComponent } from 'libs/admin/shared/src/lib/components/coming-soon/coming-soon.component';
import { forEach, keys, split } from 'lodash';
import { Observable, Subscription } from 'rxjs';
import { card } from '../../../constants/card';
import {
  FeedbackList,
  FeedbackRecord,
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
  pagination = card.pagination;
  totalRecords = card.totalRecords;
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
    this.listenForAssigneeChange();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
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
        // this.getUsersList();
        this.filterData = {
          ...this.filterData,
          order: sharedConfig.defaultOrder,
          feedbackType: data['filter'].value.feedback.feedbackType,
          entityType: this.entityType,
          entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
        };
        this.pagination = {
          offset: 0,
          limit: 20,
        };
        this.cardService.$selectedFeedback.next(null);
        this.loadData();
      })
    );
  }

  /**
   * @function listenForAssigneeChange Function load when assignee is changed.
   */
  listenForAssigneeChange() {
    this.$subscription.add(
      this.cardService.$assigneeChange.subscribe((response) => {
        if (response.status) {
          this.loadInitialData([
            ...this.globalQueries,
            this.filterData,
            {
              offset: 0,
              limit: this.pagination.offset + 20,
            },
          ]);
        }
      })
    );
  }

  /**
   * @function getUsersList Function to get feedback user list.
   */
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

  /**
   * @function listenForEntityTypeChange Function loads when change entity type.
   */
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

  /**
   * @function loadInitialData To load the initial data for feedback list.
   */
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

  /**
   * @function updateTabFilterCounts Function to update Tab filter count.
   * @param object
   */
  updateTabFilterCounts(object) {
    this.tabFilterItems.forEach((item) => (item.total = object[item.value]));
  }

  /**
   * @function fetchDataFrom Returns an observable for feedback list.
   * @param queries
   * @returns
   */
  fetchDataFrom(queries): Observable<any> {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this.cardService.getFeedbackList(config);
  }

  /**
   * @function getHotelId Function to get hotel id.
   * @param globalQueries
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * @function enableSearch function to enable search.
   */
  enableSearch() {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = true;
  }

  /**
   * @function clearSearch function to clear search
   */
  clearSearch() {
    this.parentFG.patchValue({ search: '' });
    this.enableSearchField = false;
    this.loading = true;
  }

  /**
   * @function getSearchValue Function to get search value.
   * @param event
   */
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

  /**
   * @function setSelectedItem
   * @param item
   */
  setSelectedItem(item) {
    debugger;
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

  /**
   * @function loadData Function to load data feedback user list data.
   */
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

  /**
   * @function onScroll Function to load data on scrolling.
   */
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

  /**
   * @function clearRecords Function to clear records on changing tab label.
   */
  clearRecords() {
    this.feedbackList = new FeedbackList().deserialize(
      { records: [] },
      this.outlets,
      this.feedbackType,
      this.colorMap
    );
  }

  /**
   * @function search Function for search.
   */
  get search(): string {
    return this.parentFG.get('search')?.value;
  }

  getRatingColorCode(rating) {
    if (this.feedbackType === 'stayFeedbacks') {
      return this.colorMap.stayFeedbacks[1].colorCode;
    } else {
      let colorCode = '';
      Object.keys(this.colorMap.transactionalFeedbacks).forEach((element) => {
        const a = this.colorMap.transactionalFeedbacks[element];
        const [min, max] = a.scale.split('-');
        if (rating >= min && rating <= max) {
          colorCode = a.colorCode;
        }
      });
      return colorCode;
    }
  }

  /**
   * @function ngOnDestroy Function to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
