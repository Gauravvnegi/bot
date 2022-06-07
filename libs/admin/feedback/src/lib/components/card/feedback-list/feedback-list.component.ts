import { Component, Input, OnInit } from '@angular/core';
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
import { FeedbackList } from '../../../data-models/feedback-card.model';
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
})
export class FeedbackListComponent implements OnInit {
  @Input() entityType;
  @Input() outlets;
  @Input() colorMap;
  feedbackType: string;
  parentFG: FormGroup;
  tabFilterItems = card.list.tabFilterItems;
  selectedFeedback;
  tabFilterIdx: number = 5;
  hotelId: string;
  $subscription = new Subscription();
  globalQueries = [];
  enableSearchField = false;
  loading = false;
  showFilter = false;
  feedbackList;
  pagination = {
    offset: 0,
    limit: 5,
  };
  constructor(
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private firebaseMessagingService: FirebaseMessagingService,
    private cardService: CardService,
    private statisticService: StatisticsService,
    private tableService: FeedbackTableService
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
    this.listenForFeedbackTypeChanged();
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
        this.feedbackType = data['filter'].value.feedback.feedbackType;
        this.cardService.$selectedFeedback.next(null);
        this.loadInitialData([
          ...this.globalQueries,
          {
            order: sharedConfig.defaultOrder,
            feedbackType: this.feedbackType,
            entityType: this.entityType,
            entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
          },
        ]);
      })
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
   * @function listenForFeedbackTypeChanged To listen the local tab change.
   */
  listenForFeedbackTypeChanged(): void {
    this.$subscription.add(
      this.tableService.$feedbackType.subscribe(
        (response) => (this.feedbackType = response)
      )
    );
  }

  listenForEntityTypeChange() {
    this.$subscription.add(
      this.cardService.$selectedEntityType.subscribe((response) => {
        if (response) {
          this.entityType = response;
          this.loadInitialData([
            ...this.globalQueries,
            {
              order: sharedConfig.defaultOrder,
              feedbackType: this.feedbackType,
              entityType: this.entityType,
              entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
            },
          ]);
        }
      })
    );
  }

  loadInitialData(queries = []) {
    this.loading = true;

    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          this.feedbackList = new FeedbackList().deserialize(
            response,
            this.outlets,
            this.feedbackType,
            this.colorMap
          ).records;
          console.log(this.feedbackList);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
        () => (this.loading = false)
      )
    );
  }

  loadMore() {}

  fetchDataFrom(queries): Observable<any> {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };
    return this.cardService.getFeedbackList(config);
  }

  getHotelId(globalQueries): void {
    //todo

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
    } else {
      this.loading = true;
      // this.loadData(0, 10);
    }
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.loadInitialData([
      ...this.globalQueries,
      {
        order: sharedConfig.defaultOrder,
        feedbackType: this.feedbackType,
        entityType: this.entityType,
        entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
      },
    ]);
  }

  setSelectedItem(item) {
    this.cardService.$selectedFeedback.next(item);
    this.selectedFeedback = item;
  }

  handleFilter(event) {}
}
