import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { FeedbackComponent as BaseFeedbackComponent } from 'libs/admin/stay-feedback/src/lib/components/feedback/feedback.component';
import { StatisticsService } from 'libs/admin/shared/src/lib/services/feedback-statistics.service';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent extends BaseFeedbackComponent implements OnInit {
  constructor(
    _modal: ModalService,
    _globalFilterService: GlobalFilterService,
    _hotelDetailService: HotelDetailService,
    statisticsService: StatisticsService
  ) {
    super(_modal, _globalFilterService, _hotelDetailService, statisticsService);
  }

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
        this.getOutletsSelected([...data['feedback'].queryValue]);
        if (data['filter'].value.feedback.feedbackType === 'Transactional')
          this.getOutlets(data['filter'].value.property.branchName);
      })
    );
  }

  getOutlets(branchId) {
    this.outlets = this._hotelDetailService.hotelDetails.brands[0].branches.find(
      (branch) => branch['id'] == branchId
    ).outlets;
    this.statisticsService.outletIds = this.outlets.map((outlet) => outlet.id);
    this.tabFilterItems = [
      {
        label: 'Overall',
        content: '',
        value: 'ALL',
        disabled: false,
        total: 0,
        chips: [],
      },
    ];
    this.outlets.forEach((outlet) => {
      if (this.outletIds[outlet.id]) {
        this.tabFilterItems.push({
          label: outlet.name,
          content: '',
          value: outlet.id,
          disabled: false,
          total: 0,
          chips: [],
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

  getOutletsSelected(globalQueries) {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('outlets')) this.outletIds = element.outlets;
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.statisticsService.outletIds =
      event.index === 0
        ? this.outlets.map((outlet) => outlet.id)
        : [this.outlets[event.index - 1].id];
  }
}
