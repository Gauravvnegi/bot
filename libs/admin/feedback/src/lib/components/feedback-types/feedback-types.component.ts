import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { HotelDetailService } from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { StatisticsService } from '../../services/feedback-statistics.service';
import { FeedbackTableService } from '../../services/table.service';
import { feedback } from '../../constants/feedback';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-feedback-types',
  templateUrl: './feedback-types.component.html',
  styleUrls: ['./feedback-types.component.scss'],
})
export class FeedbackTypesComponent implements OnInit {
  @Output() onTabFilterChange = new EventEmitter();
  @Input() extraGap = 60;
  @Input() scrollBoundary = 120;
  isAllOutletSelected = true;

  entityId = '';
  tabFilterIdx = 0;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      chips: [],
      type: 'Both',
    },
  ];

  outletIds;
  outlets;
  globalFeedbackFilterType = '';
  $subscription = new Subscription();

  constructor(
    protected _modal: ModalService,
    protected globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected statisticsService: StatisticsService,
    protected subscriptionPlanService: SubscriptionPlanService,
    protected tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;

        this.isAllOutletSelected =
          data['filter'].value?.isAllOutletSelected ?? true;

        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        ) {
          this.tabFilterIdx = 0;

          this.getOutletsSelected(
            [...data['feedback'].queryValue],
            data['filter'].value
          );
          if (this.globalFeedbackFilterType === feedback.types.transactional) {
            this.statisticsService.type = this.globalFeedbackFilterType;
            this.tableService.$feedbackType.next(this.globalFeedbackFilterType);
          } else {
            this.statisticsService.type = '';
            this.tableService.$feedbackType.next('');
          }
        } else {
          this.statisticsService.type = feedback.types.stay;
          this.tableService.$feedbackType.next(feedback.types.stay);
          this.setStayTabFilters(data['filter'].value);
        }
      })
    );
  }

  getOutletsSelected(globalQueries, globalQueryValue) {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
    this.getOutlets(
      globalQueryValue.property.entityName,
      globalQueryValue.property.brandName
    );
  }

  getOutlets(branchId, brandId) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === brandId)
      .entities.find((branch) => branch['id'] === branchId);
    this.outlets = branch.entities;
    this.statisticsService.outletIds =
      this.globalFeedbackFilterType === feedback.types.both
        ? (this.statisticsService.outletIds = [branch.id])
        : this.outlets
            .map((outlet) => {
              if (outlet.id && this.outletIds[outlet.id]) return outlet.id;
            })
            .filter((id) => id !== undefined);
    this.setTabFilterItems(branch);
  }

  setTabFilterItems(branch) {
    if (this.globalFeedbackFilterType === feedback.types.stay) {
      this.tabFilterItems = [this.getTabItem(branch, feedback.types.stay)];
      return;
    }
    this.tabFilterItems = [];
    if (this.globalFeedbackFilterType === feedback.types.both)
      this.tabFilterItems.push(this.getTabItem(branch, feedback.types.stay));
    if (this.isAllOutletSelected) {
      this.tabFilterItems.push({
        label: 'All Outlets',
        content: '',
        value: 'ALL',
        disabled: false,
        chips: [],
        type: feedback.types.transactional,
      });
    }

    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push(
          this.getTabItem(outlet, feedback.types.transactional)
        );
      }
    });
  }

  getTabItem(item, type) {
    return {
      label: item.name,
      content: '',
      value: item.id,
      disabled: false,
      chips: [],
      type: type,
    };
  }

  setStayTabFilters(globalQueryValue) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === globalQueryValue.property.brandName)
      .entities.find(
        (branch) => branch['id'] === globalQueryValue.property.entityName
      );
    this.setTabFilterItems(branch);
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.tableService.$feedbackType.next(
      this.tabFilterItems[this.tabFilterIdx].type
    );
    this.statisticsService.outletIds =
      this.tabFilterItems[event.index].type === feedback.types.stay ||
      this.tabFilterItems[event.index].value !== 'ALL'
        ? [this.tabFilterItems[this.tabFilterIdx].value]
        : this.tabFilterItems
            .map((item) => item.value)
            .filter((value) => value !== 'ALL');
    this.statisticsService.type = this.tabFilterItems[this.tabFilterIdx].type;
    this.statisticsService.$outletChange.next({
      status: true,
      type: this.tabFilterItems[this.tabFilterIdx].type,
    });
    this.onTabFilterChange.emit(this.statisticsService.outletIds);
  }
}
