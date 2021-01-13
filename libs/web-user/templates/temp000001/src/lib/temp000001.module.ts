import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AccessTokenService } from 'libs/web-user/shared/src/lib/services/access-token.service';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { FeedbackDetailsService } from 'libs/web-user/shared/src/lib/services/feedback-details.service';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { ReservationSummaryService } from 'libs/web-user/shared/src/lib/services/reservation-summary.service';
import { SignatureService } from 'libs/web-user/shared/src/lib/services/signature.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { ThankYouService } from 'libs/web-user/shared/src/lib/services/thank-you.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { ButtonDirective } from './directives/button-renderer.directive';
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { TemplateLoaderDirective } from './directives/template-loader.directive';
import { TimezoneInterceptor } from './interceptors/timezone.interceptor';
import { TokenRetievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { GSTService } from 'libs/web-user/shared/src/lib/services/gst.service';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    WebUserSharedModule.forRoot({ templateId: 'temp000001' }),
    Temp000001RoutingModule,
    SignaturePadModule,
    PdfViewerModule,
    SlickCarouselModule,
    MatTabsModule,
    MatIconModule,
    AngularSvgIconModule.forRoot(),
  ],
  declarations: [
    ...Temp000001RoutingModule.components,
    StepperContentRendererDirective,
    TemplateLoaderDirective,
    ButtonDirective,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimezoneInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRetievalInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ReservationService,
    HotelService,
    ParentFormService,
    StepperService,
    StayDetailsService,
    GuestDetailsService,
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
    DefaultAmenityService,
    ThankYouService,
    UtilityService,
    GSTService,
  ],
})
export class Temp000001Module {}
