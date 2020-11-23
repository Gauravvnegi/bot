import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TempCovid000001RoutingModule } from './temp-covid000001-routing.module';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { TempCovid000001Component } from './containers/temp-covid000001/temp-covid000001.component';
import { FaqService } from 'libs/web-user/shared/src/lib/services/faq.service';
import { SafeMeasuresService } from 'libs/web-user/shared/src/lib/services/safe-measures.service';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { RaiseRequestService } from 'libs/web-user/shared/src/lib/services/raise-request.service';
import { HyperlinkElementService } from '../../../../shared/src/lib/services/hyperlink-element.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { FooterService } from 'libs/web-user/shared/src/lib/services/footer.service';

@NgModule({
  imports: [
    CommonModule,
    WebUserSharedModule.forRoot({ templateId: 'temp-covid000001' }),
    RouterModule,
    SlickCarouselModule,
    TempCovid000001RoutingModule,
  ],
  declarations: [
    TempCovid000001RoutingModule.components,
    TempCovid000001Component,
  ],
  providers: [
    FaqService,
    SafeMeasuresService,
    RaiseRequestService,
    FooterService,
    HyperlinkElementService,
  ],
})
export class TempCovid000001Module {}
