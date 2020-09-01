import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { AccessTokenService } from 'libs/web-user/shared/src/lib/services/access-token.service';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { FeedbackDetailsService } from 'libs/web-user/shared/src/lib/services/feedback-details.service';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { ReservationSummaryService } from 'libs/web-user/shared/src/lib/services/reservation-summary.service';
import { SignatureService } from 'libs/web-user/shared/src/lib/services/signature.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ButtonDirective } from './directives/button-renderer.directive';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { TokenRetievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { BreakfastService } from 'libs/web-user/shared/src/lib/services/breakfast.service';
import { SpaService } from 'libs/web-user/shared/src/lib/services/spa.service';
import { CakeService } from 'libs/web-user/shared/src/lib/services/cake.service';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    WebUserSharedModule,
    RouterModule,
    Temp000001RoutingModule,
    SignaturePadModule,
    PdfViewerModule,
    SlickCarouselModule,
  ],
  declarations: [
    Temp000001RoutingModule.components,
    StepperContentRendererDirective,
    ButtonDirective,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRetievalInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    HotelService,
    ReservationService,
    ParentFormService,
    StepperService,
    StayDetailsService,
    GuestDetailsService,
    DateService,
    DocumentDetailsService,
    PaymentDetailsService,
    FeedbackDetailsService,
    ReservationSummaryService,
    BillSummaryService,
    HealthDetailsService,
    RegCardService,
    SummaryService,
    SignatureService,
    AccessTokenService,
    AmenitiesService,
    ComplimentaryService,
    PaidService,
    AirportService,
    BreakfastService,
    SpaService,
    CakeService,
    DefaultAmenityService,
  ],
})
export class Temp000001Module {}
