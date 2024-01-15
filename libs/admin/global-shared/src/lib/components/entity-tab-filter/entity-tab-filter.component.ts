import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FilterValue,
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { HotelDetailService } from '../../../../../shared/src/lib/services/hotel-detail.service';
import { EntityTabFilterResponse } from '@hospitality-bot/admin/shared';
import {
  Branch,
  EntityTabFilterConfig,
  FeedbackType,
} from '../../types/entity-tab.type';
import { feedback } from 'libs/admin/feedback/src/lib/constants/feedback';

@Component({
  selector: 'hospitality-bot-entity-tab-filter',
  templateUrl: './entity-tab-filter.component.html',
  styleUrls: ['./entity-tab-filter.component.scss'],
})
export class EntityTabFilterComponent implements OnInit {
  tabFilterIdx = 0;
  tabFilterItems = [];
  $subscription = new Subscription();
  entityId = '';
  globalFeedbackFilterType = '';
  outletIds;
  outlets;
  @Input() isAllOutletTabFilter = true;
  isSticky = false;
  extraGap = 60;
  scrollBoundary = 120;
  @Output() onEntityTabFilterChanges = new EventEmitter<
    EntityTabFilterResponse
  >();
  isAllOutletSelected = true;
  previousDateRange = {};
  isFirstTime = true;

  @Input() set config(configData: EntityTabFilterConfig) {
    for (const key in configData) {
      if (this.hasOwnProperty(key)) {
        this[key] = configData[key];
      }
    }
  }

  constructor(
    protected globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.onEntityTabFilterChanges.emit({
      entityId: [this.tabFilterItems[this.tabFilterIdx].value],
      feedbackType: this.tabFilterItems[this.tabFilterIdx].type,
      label: this.tabFilterItems[this.tabFilterIdx].label,
      outletType: this.tabFilterItems[this.tabFilterIdx]?.outletType,
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        if (this.isFirstTime) {
          //set the previous date range if it is first time
          this.previousDateRange = { ...data.dateRange };
          this.isFirstTime = false;
        }

        //check if the date range is changed and return if it is changed
        if (
          JSON.stringify(data.dateRange) !==
          JSON.stringify(this.previousDateRange)
        ) {
          this.previousDateRange = { ...data.dateRange };
          //As this component should not be updated if the date range is changed so return if the date range is changed
          return;
        }
        //maintain the previous date range
        this.previousDateRange = { ...data.dateRange };

        //set the entityId
        this.entityId = this.globalFilterService.entityId;

        this.isAllOutletSelected = data['filter'].value?.isAllOutletSelected;

        //set the globalFeedbackFilterType
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;

        if (
          this.globalFeedbackFilterType === feedback.types.transactional ||
          this.globalFeedbackFilterType === feedback.types.both
        ) {
          this.tabFilterIdx = 0;

          //get the selected outlets
          this.getOutletsSelected(
            [...data['feedback'].queryValue],
            data['filter'].value
          );
        } else {
          //set the tab filter items for stay feedback type i.e Hotel
          this.setStayTabFilters(data['filter'].value);
        }
      })
    );
  }

  /**
   * @function setStayTabFilters
   * @description set the tab filter items for stay feedback type
   * @param globalQueryValue
   */
  setStayTabFilters(globalQueryFilterValue: FilterValue) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === globalQueryFilterValue.property.brandName)
      .entities.find(
        (branch) => branch['id'] === globalQueryFilterValue.property.entityName
      );
    this.setTabFilterItems(branch);
  }

  /**
   * @function getOutletsSelected
   * @description get the outlets selected
   */
  getOutletsSelected(
    globalFeedbackQueries: any[],
    globalFilterQueryValue: FilterValue
  ) {
    //get the selected outlets this.outletIds = [{'outletId' : true}, ...]
    globalFeedbackQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });

    //to get outlet details
    this.getOutlets(
      globalFilterQueryValue.property.brandName,
      globalFilterQueryValue.property.entityName
    );
  }

  /**
   * @function getOutlets
   * @description get the outlet details
   * @param entityId
   * @param brandId
   */
  getOutlets(brandId: string, entityId: string) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === brandId)
      .entities.find((branch) => branch['id'] === entityId);

    this.outlets = branch.entities;

    this.setTabFilterItems(branch); // brach = [{ id : '' ,  name : ''} , {...} , ...]
  }

  /**
   * @function setTabFilterItems
   * @description set the tab filter items
   * @param branch
   * @memberof EntityTabFilterComponent
   */
  setTabFilterItems(branch: Branch) {
    //if the feedback type is stay then set the tab filter items
    if (this.globalFeedbackFilterType === feedback.types.stay) {
      this.tabFilterItems = [
        this.getTabItem(branch, feedback.types.stay as FeedbackType),
      ];
      return;
    }
    this.tabFilterItems = [];

    //if the feedback type is both then set the tab filter items
    if (this.globalFeedbackFilterType === feedback.types.both)
      this.tabFilterItems.push(
        this.getTabItem(branch, feedback.types.stay as FeedbackType)
      );

    if (this.isAllOutletTabFilter && this.isAllOutletSelected) {
      this.tabFilterItems.push({
        label: 'All Outlets',
        content: '',
        value: 'ALL',
        disabled: false,
        chips: [],
        type: feedback.types.transactional,
      });
    }
    //check if the outlet is selected in the global filter and set the tab filter items
    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push(
          this.getTabItem(outlet, feedback.types.transactional as FeedbackType)
        );
      }
    });
  }

  /**
   * @function getTabItem
   * @description get the tab item
   * @param item
   * @param type
   * @returns tab item
   */

  getTabItem(item, type: FeedbackType) {
    return {
      label: item.name,
      content: '',
      value: item.id,
      disabled: false,
      chips: [],
      type: type,
      outletType: item.type,
    };
  }

  /**
   * @function onSelectedTabFilterChange
   * @description emit the selected tab filter
   * @example <hospitality-bot-entity-tab-filter (onEntityTabFilterChanges)="onSelectedTabFilterChange($"></hospitality-bot-entity-tab-filter>
   */

  onSelectedTabFilterChange(index: number) {
    this.tabFilterIdx = index;
    const feedbackType = this.tabFilterItems[index].type;

    const outletIds =
      this.tabFilterItems[index].type === feedback.types.stay ||
      this.tabFilterItems[index].value !== 'ALL'
        ? [this.tabFilterItems[index].value]
        : this.tabFilterItems
            .map((item) => item.value)
            .filter((value) => value !== 'ALL');
    this.onEntityTabFilterChanges.emit({
      entityId: outletIds,
      feedbackType: feedbackType,
      label: this.tabFilterItems[this.tabFilterIdx].label,
      outletType: this.tabFilterItems[this.tabFilterIdx]?.outletType,
    });
  }
}
