import { Component, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { FeedbackComponent as BaseFeedbackComponent } from 'libs/admin/stay-feedback/src/lib/components/feedback/feedback.component';

@Component({
  selector: 'hospitality-bot-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss'],
})
export class FeedbackComponent extends BaseFeedbackComponent implements OnInit {
  constructor(
    _modal: ModalService,
    _globalFilterService: GlobalFilterService,
    _hotelDetailService: HotelDetailService
  ) {
    super(_modal, _globalFilterService, _hotelDetailService);
  }
}
