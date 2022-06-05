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
import { CardService } from '../../../services/card.service';
import { FeedbackTableService } from '../../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback-list',
  templateUrl: './feedback-list.component.html',
  styleUrls: ['./feedback-list.component.scss'],
})
export class FeedbackListComponent implements OnInit {
  @Input() entityType;
  feedbackType: string;
  filterData = {
    sort: '',
    order: 'DESC',
    priorityType: '',
  };
  parentFG: FormGroup;
  tabFilterItems = [
    {
      label: 'To-Do',
      content: '',
      value: 'PENDING',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Timeout',
      content: '',
      value: 'TIMEOUT',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Resolved',
      content: '',
      value: 'RESOLVED',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

  tabFilterIdx: number = 0;
  hotelId: string;
  $subscription = new Subscription();
  globalQueries = [];
  enableSearchField = false;
  loading = false;
  showFilter = false;
  feedbackList;
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
    this.cardService.selectedRequest.next(null);
  }

  initFG() {
    this.parentFG = this.fb.group({
      search: ['', Validators.minLength(3)],
    });
  }

  registerListeners() {
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
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.feedbackType = data['filter'].value.feedback.feedbackType;
        this.cardService.selectedRequest.next(null);
        this.getFeedbackList([
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

  getFeedbackList(queries = []) {
    this.loading = true;

    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (response) => {
          console.log(response);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
        () => (this.loading = false)
      )
    );
  }

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
    this.getFeedbackList([
      ...this.globalQueries,
      {
        order: sharedConfig.defaultOrder,
        feedbackType: this.feedbackType,
        entityType: this.entityType,
        entityState: this.tabFilterItems[this.tabFilterIdx]?.value,
      },
    ]);
  }
}
