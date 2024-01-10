import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FeedbackNotificationComponent } from '@hospitality-bot/admin/notification';
import {
  CardNames,
  ConfigService,
  HotelDetailService,
  ModuleNames,
  TableNames,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SubscriptionPlanService } from 'apps/admin/src/app/core/theme/src/lib/services/subscription-plan.service';
import { Subscription } from 'rxjs';
import { feedback } from '../../constants/feedback';
import { StatisticsService } from '../../services/feedback-statistics.service';
import { FeedbackTableService } from '../../services/table.service';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedbackConfig = feedback;
  public cards = CardNames;
  tables = TableNames;
  entityId: string;
  $subscription = new Subscription();
  globalFeedbackFilterType = '';
  // outlets;
  // outletIds;
  colorMap;
  responseRate;

  // tabFilterIdx = 0;
  // tabFilterItems = [
  //   {
  //     label: 'All',
  //     content: '',
  //     value: 'ALL',
  //     disabled: false,
  //     chips: [],
  //     type: 'Both',
  //   },
  // ];
  constructor(
    protected globalFilterService: GlobalFilterService,
    protected _hotelDetailService: HotelDetailService,
    protected statisticsService: StatisticsService,
    protected subscriptionPlanService: SubscriptionPlanService,
    protected tableService: FeedbackTableService,
    private configService: ConfigService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    // this.registerListeners();
    this.getConfig();
  }

  // <!-- TODO: Test & Remove when response is not empty -->
  // registerListeners(): void {
  //   this.listenForGlobalFilters();
  //   this.listenForStateData();
  // }

  getConfig() {
    this.$subscription.add(
      this.configService.$config.subscribe((response) => {
        if (response) {
          this.colorMap = response?.feedbackColorMap;
          this.responseRate = response?.responseRate;
        }
      })
    );
  }

  // <!-- TODO: Test & Remove when response is not empty -->
  // listenForGlobalFilters(): void {
  //   this.$subscription.add(
  //     this.globalFilterService.globalFilter$.subscribe((data) => {
  //       this.entityId = this.globalFilterService.entityId;
  //       this.globalFeedbackFilterType =
  //         data['filter'].value.feedback.feedbackType;
  //       if (
  //         this.globalFeedbackFilterType === feedback.types.transactional ||
  //         this.globalFeedbackFilterType === feedback.types.both
  //       ) {
  //         this.tabFilterIdx = 0;

  //         this.getOutletsSelected(
  //           [...data['feedback'].queryValue],
  //           data['filter'].value
  //         );
  //         if (this.globalFeedbackFilterType === feedback.types.transactional) {
  //           this.statisticsService.type = this.globalFeedbackFilterType;
  //           this.tableService.$feedbackType.next(this.globalFeedbackFilterType);
  //         } else {
  //           this.statisticsService.type = '';
  //           this.tableService.$feedbackType.next('');
  //         }
  //       } else {
  //         this.statisticsService.type = feedback.types.stay;
  //         this.tableService.$feedbackType.next(feedback.types.stay);
  //         this.setStayTabFilters(data['filter'].value);
  //       }
  //     })
  //   );
  // }

  // setStayTabFilters(globalQueryValue) {
  //   const branch = this._hotelDetailService.brands
  //     .find((brand) => brand.id === globalQueryValue.property.brandName)
  //     .entities.find(
  //       (branch) => branch['id'] === globalQueryValue.property.entityName
  //     );
  //   this.setTabFilterItems(branch);
  // }

  // getOutlets(branchId, brandId) {
  //   const branch = this._hotelDetailService.brands
  //     .find((brand) => brand.id === brandId)
  //     .entities.find((branch) => branch['id'] === branchId);
  //   this.outlets = branch.entities;
  //   this.statisticsService.outletIds =
  //     this.globalFeedbackFilterType === feedback.types.both
  //       ? (this.statisticsService.outletIds = [branch.id])
  //       : this.outlets
  //           .map((outlet) => {
  //             if (outlet.id && this.outletIds[outlet.id]) return outlet.id;
  //           })
  //           .filter((id) => id !== undefined);
  //   this.setTabFilterItems(branch);
  // }

  // setTabFilterItems(branch) {
  //   if (this.globalFeedbackFilterType === feedback.types.stay) {
  //     this.tabFilterItems = [this.getTabItem(branch, feedback.types.stay)];
  //     return;
  //   }
  //   this.tabFilterItems = [];
  //   if (this.globalFeedbackFilterType === feedback.types.both)
  //     this.tabFilterItems.push(this.getTabItem(branch, feedback.types.stay));
  //   this.tabFilterItems.push({
  //     label: 'All Outlets',
  //     content: '',
  //     value: 'ALL',
  //     disabled: false,
  //     chips: [],
  //     type: feedback.types.transactional,
  //   });
  //   this.outlets.forEach((outlet) => {
  //     if (this.outletIds[outlet.id]) {
  //       this.tabFilterItems.push(
  //         this.getTabItem(outlet, feedback.types.transactional)
  //       );
  //     }
  //   });
  // }

  // getTabItem(item, type) {
  //   return {
  //     label: item.name,
  //     content: '',
  //     value: item.id,
  //     disabled: false,
  //     chips: [],
  //     type: type,
  //   };
  // }

  // getOutletsSelected(globalQueries, globalQueryValue) {
  //   globalQueries.forEach((element) => {
  //     if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
  //   });
  //   this.getOutlets(
  //     globalQueryValue.property.entityName,
  //     globalQueryValue.property.brandName
  //   );
  // }

  // onSelectedTabFilterChange(event) {
  //   this.tabFilterIdx = event.index;
  //   this.tableService.$feedbackType.next(
  //     this.tabFilterItems[this.tabFilterIdx].type
  //   );
  //   this.statisticsService.outletIds =
  //     this.tabFilterItems[event.index].type === feedback.types.stay ||
  //     this.tabFilterItems[event.index].value !== 'ALL'
  //       ? [this.tabFilterItems[this.tabFilterIdx].value]
  //       : this.tabFilterItems
  //           .map((item) => item.value)
  //           .filter((value) => value !== 'ALL');
  //   this.statisticsService.type = this.tabFilterItems[this.tabFilterIdx].type;
  //   this.statisticsService.$outletChange.next({
  //     status: true,
  //     type: this.tabFilterItems[this.tabFilterIdx].type,
  //   });
  // }

  openFeedbackRequestPage(event) {
    event.stopPropagation();
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<FeedbackNotificationComponent> = {
      entityId: this.entityId,
    };
    dialogRef = openModal({
      config: {
        width: '80%',
        styleClass: 'dynamic-modal',
        data: modalData,
      },
      component: FeedbackNotificationComponent,
      dialogService: this.dialogService,
    });
  }

  checkForStaySubscribed() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.FEEDBACK
    );
  }

  checkForTransactionalSubscribed() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.FEEDBACK_TRANSACTIONAL
    );
  }

  // listenForStateData() {
  //   this.notificationService.$feedbackNotification.subscribe((response) => {
  //     if (response) {
  //       this.$subscription.add(
  //         this.cardService
  //           .getFeedbackNotificationData(response)
  //           .subscribe((response) => {
  //             const data = new FeedbackRecord().deserialize(
  //               response,
  //               this.outlets,
  //               response.feedbackType,
  //               this.colorMap
  //             );
  //             console.log(data);
  //             const dialogConfig = new MatDialogConfig();
  //             dialogConfig.disableClose = true;
  //             dialogConfig.width = '100%';
  //             dialogConfig.data = {
  //               feedback: data.feedback,
  //               colorMap: this.colorMap,
  //               feedbackType: this.tabFilterItems[this.tabFilterIdx].value,
  //               isModal: true,
  //               globalQueries: [],
  //             };

  //             const detailCompRef = this._modal.openDialog(
  //               FeedbackDetailModalComponent,
  //               dialogConfig
  //             );
  //             this.$subscription.add(
  //               detailCompRef.componentInstance.onDetailsClose.subscribe(
  //                 (res) => {
  //                   detailCompRef.close();
  //                 }
  //               )
  //             );
  //             this.notificationService.$feedbackNotification.next(null);
  //           })
  //       );
  //     }
  //   });
  // }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
