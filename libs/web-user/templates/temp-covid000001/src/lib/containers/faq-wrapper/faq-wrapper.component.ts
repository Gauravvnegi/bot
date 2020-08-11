import { Component, OnInit } from '@angular/core';
import { FaqService } from 'libs/web-user/shared/src/lib/services/faq.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-faq-wrapper',
  templateUrl: './faq-wrapper.component.html',
  styleUrls: ['./faq-wrapper.component.scss'],
})
export class FaqWrapperComponent implements OnInit {
  faq: boolean;
  constructor(
    private _faqService: FaqService,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.getFaqs();
  }

  initFaqDetailsDs(covidFaqs) {
    this._faqService.initFaqDetailDS(covidFaqs);
  }

  getFaqs() {
    this._faqService
      .getFaqs(this._hotelService.covidHotelId)
      .subscribe((faqResponse) => {
        this.faq = true;
        this.initFaqDetailsDs(faqResponse);
      });
  }
}
