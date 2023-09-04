import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  GlobalFilterService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { feedback } from '@hospitality-bot/admin/feedback';
import { ModalService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { HotelDetailService } from '../../../../../shared/src/lib/services/hotel-detail.service';
import { EntityTabFilterResponse } from '@hospitality-bot/admin/shared';

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

  @Input() set config(configData: EntityTabFilterConfig) {
    for (const key in configData) {
      if (this.hasOwnProperty(key)) {
        this[key] = configData[key];
      }
    }
  }

  constructor(
    protected _modal: ModalService,
    protected globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.onEntityTabFilterChanges.emit({
      entityId: [this.tabFilterItems[this.tabFilterIdx].value],
      feedbacktype: this.tabFilterItems[this.tabFilterIdx].type,
      label: this.tabFilterItems[this.tabFilterIdx].label,
      outletType: this.tabFilterItems[this.tabFilterIdx]?.outletType,
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set the entityId
        this.entityId = this.globalFilterService.entityId;

        this.isAllOutletSelected =
          data['filter'].value?.isAllOutletSelected ?? true;

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
  setStayTabFilters(globalQueryValue) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === globalQueryValue.property.brandName)
      .entities.find(
        (branch) => branch['id'] === globalQueryValue.property.entityName
      );
    this.setTabFilterItems(branch);
  }

  /**
   * @function getOutletsSelected
   * @description get the outlets selected
   */
  getOutletsSelected(globalQueries, globalQueryValue) {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
    this.getOutlets(
      globalQueryValue.property.entityName,
      globalQueryValue.property.brandName
    );
  }

  /**
   * @function getOutlets
   * @description get the outlets
   * @param branchId
   * @param brandId
   * @returns void
   */

  getOutlets(branchId, brandId) {
    const branch = this._hotelDetailService.brands
      .find((brand) => brand.id === brandId)
      .entities.find((branch) => branch['id'] === branchId);

    this.outlets = branch.entities;
    this.setTabFilterItems(branch);
  }

  /**
   * @function setTabFilterItems
   * @description set the tab filter items
   * @param branch
   * @returns void
   * @memberof EntityTabFilterComponent
   */
  setTabFilterItems(branch) {
    //if the feedback type is stay then set the tab filter items
    if (this.globalFeedbackFilterType === feedback.types.stay) {
      this.tabFilterItems = [this.getTabItem(branch, feedback.types.stay)];
      return;
    }
    this.tabFilterItems = [];

    //if the feedback type is both then set the tab filter items
    if (this.globalFeedbackFilterType === feedback.types.both)
      this.tabFilterItems.push(this.getTabItem(branch, feedback.types.stay));

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

    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push(
          this.getTabItem(outlet, feedback.types.transactional)
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

  getTabItem(item, type) {
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
   * @param event
   * @returns void
   * @memberof EntityTabFilterComponent
   * @example <hospitality-bot-entity-tab-filter (onEntityTabFilterChanges)="onSelectedTabFilterChange($event)"></hospitality-bot-entity-tab-filter>
   */

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    const feedbackType = this.tabFilterItems[event.index].type;
    const outletIds =
      this.tabFilterItems[event.index].type === feedback.types.stay ||
      this.tabFilterItems[event.index].value !== 'ALL'
        ? [this.tabFilterItems[this.tabFilterIdx].value]
        : this.tabFilterItems
            .map((item) => item.value)
            .filter((value) => value !== 'ALL');
    this.onEntityTabFilterChanges.emit({
      entityId: outletIds,
      feedbacktype: feedbackType,
      label: this.tabFilterItems[this.tabFilterIdx].label,
      outletType: this.tabFilterItems[this.tabFilterIdx]?.outletType,
    });
  }
}

type EntityTabFilterConfig = {
  isAllOutletTabFilter: boolean;
  isSticky: boolean;
  extraGap: number;
  entityId: string;
  globalFeedbackFilterType: string;
};
