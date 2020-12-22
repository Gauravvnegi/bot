import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqService } from 'libs/web-user/shared/src/lib/services/faq.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-faq-wrapper',
  templateUrl: './faq-wrapper.component.html',
  styleUrls: ['./faq-wrapper.component.scss'],
})
export class FaqWrapperComponent implements OnInit, OnDestroy {
  
  faq: boolean;
  $subscription: Subscription = new Subscription();

  constructor(
    private _faqService: FaqService,
    private _hotelService: HotelService,
    private utilService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getFaqs();
  }

  initFaqDetailsDs(covidFaqs) {
    this._faqService.initFaqDetailDS(covidFaqs);
  }

  getFaqs() {
    this.$subscription.add(
    this._faqService
      .getFaqs(this._hotelService.hotelId)
      .subscribe((faqResponse) => {
        this.faq = true;
        this.initFaqDetailsDs(faqResponse);
      },({error})=>{
        this.utilService.showErrorMessage(error);
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
