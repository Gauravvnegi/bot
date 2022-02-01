import { Component } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FeedbackNotificationComponent } from '@hospitality-bot/admin/notification';
import {
  CardNames,
  TableNames,
  HotelDetailService,
  StatisticsService,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { Subscription } from 'rxjs';
import { feedback } from '../../constants/feedback';
import { FeedbackTableService } from '../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent {
  feedbackConfig = feedback;
  public cards = CardNames;
  tables = TableNames;
  hotelId: string;
  $subscription = new Subscription();
  globalFeedbackFilterType = '';
  outlets;
  outletIds;

  tabFilterIdx = 0;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
      type: 'Both',
    },
  ];
  constructor(
    protected _modal: ModalService,
    protected _globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected statisticsService: StatisticsService,
    protected subscriptionPlanService: SubscriptionPlanService,
    protected tableService: FeedbackTableService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.globalFeedbackFilterType =
          data['filter'].value.feedback.feedbackType;
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
        }
      })
    );
  }

  getOutlets(branchId, brandId) {
    const branch = this._hotelDetailService.hotelDetails.brands
      .find((brand) => brand.id === brandId)
      .branches.find((branch) => branch['id'] == branchId);
    this.outlets = branch.outlets;
    this.statisticsService.outletIds = this.outlets
      .map((outlet) => {
        if (outlet.id && this.outletIds[outlet.id]) return outlet.id;
      })
      .filter((id) => id !== undefined);

    this.settabFilters(branch);
  }

  settabFilters(branch) {
    this.tabFilterItems = [
      {
        label: 'Overall',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: [],
        type:
          this.globalFeedbackFilterType === feedback.types.both
            ? feedback.types.both
            : feedback.types.transactional,
      },
    ];
    if (this.globalFeedbackFilterType === feedback.types.both)
      this.tabFilterItems.push({
        label: branch.name,
        content: '',
        value: branch.id,
        disabled: false,
        total: 0,
        chips: [],
        type: feedback.types.stay,
      });
    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push({
          label: outlet.name,
          content: '',
          value: outlet.id,
          disabled: false,
          total: 0,
          chips: [],
          type: feedback.types.transactional,
        });
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

  getOutletsSelected(globalQueries, globalQueryValue) {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
    this.getOutlets(
      globalQueryValue.property.branchName,
      globalQueryValue.property.hotelName
    );
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.tableService.$feedbackType.next(
      this.tabFilterItems[this.tabFilterIdx].type
    );
    this.statisticsService.outletIds =
      event.index === 0
        ? this.tabFilterItems
            .map((item) => item.value)
            .filter((value) => value != 'ALL')
        : [this.tabFilterItems[this.tabFilterIdx].value];
    if (this.globalFeedbackFilterType !== feedback.types.both)
      this.statisticsService.type = this.tabFilterItems[this.tabFilterIdx].type;
    else this.statisticsService.type = '';
    this.statisticsService.outletChange.next(true);
  }

  openFeedbackRequestPage(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const detailCompRef = this._modal.openDialog(
      FeedbackNotificationComponent,
      dialogConfig
    );
    detailCompRef.componentInstance.hotelId = this.hotelId;

    this.$subscription.add(
      detailCompRef.componentInstance.onModalClose.subscribe((res) =>
        detailCompRef.close()
      )
    );
  }

  checkForStaySubscribed() {
    return this.subscriptionPlanService.getModuleSubscription().modules.feedback
      .active;
  }

  checkForTransactionalSubscribed() {
    return this.subscriptionPlanService.getModuleSubscription().modules
      .FEEDBACK_TRANSACTIONAL.active;
  }
}
