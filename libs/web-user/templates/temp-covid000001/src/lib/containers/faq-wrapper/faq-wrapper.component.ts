import { Component, OnDestroy, OnInit } from '@angular/core';
import { FaqService } from 'libs/web-user/shared/src/lib/services/faq.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

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
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getFaqs();
  }

  initFaqDetailsDs(covidFaqs) {
    this._faqService.initFaqDetailDS(covidFaqs);
  }

  getFaqs() {
    this.$subscription.add(
      this._faqService.getFaqs(this._hotelService.hotelId).subscribe(
        (faqResponse) => {
          this.faq = true;
          this.initFaqDetailsDs(faqResponse);
        },
        ({ error }) => {
          this._translateService
            .get(`MESSAGES.ERROR.${error.type}`)
            .subscribe((translatedMsg) => {
              this._snackBarService.openSnackBarAsText(translatedMsg);
            });
        }
      )
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
