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
import { Temp000002RoutingModule } from './temp000002-routing.module';
import { Temp000002TextareaComponent } from './presentational/temp000002-textarea/temp000002-textarea.component';
import { TemplateLoaderDirective } from './directives/template-loader.directive';
import { Temp000002StepperComponent } from './presentational/temp000002-stepper/temp000002-stepper.component';
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { TimezoneInterceptor } from './interceptors/timezone.interceptor';
import { TokenRetrievalInterceptor } from './interceptors/token-retrieval.interceptor';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ButtonDirective } from './directives/button-renderer.directive';
import { Temp000002ButtonComponent } from './presentational/temp000002-button/temp000002-button.component';
import { Temp000002InputPopupComponent } from './presentational/temp000002-input-popup/temp000002-input-popup.component';
import { ButtonTemplateSwitchDirective } from './directives/button-template-switch.directive';
import { Temp000002SignatureCaptureWrapperComponent } from './presentational/temp000002-signature-capture-wrapper/temp000002-signature-capture-wrapper.component';
import { GSTService } from 'libs/web-user/shared/src/lib/services/gst.service';
import { CancelBookingComponent } from './containers/cancel-booking/cancel-booking.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    WebUserSharedModule.forRoot({ templateId: 'temp000002' }),
    Temp000002RoutingModule,
    SignaturePadModule,
    PdfViewerModule,
    SlickCarouselModule,
    MatTabsModule,
    MatIconModule,
    AngularSvgIconModule.forRoot(),
  ],
  declarations: [
    ...Temp000002RoutingModule.components,
    TemplateLoaderDirective,
    Temp000002StepperComponent,
    StepperContentRendererDirective,
    ButtonDirective,
    Temp000002ButtonComponent,
    Temp000002InputPopupComponent,
    ButtonTemplateSwitchDirective,
    Temp000002SignatureCaptureWrapperComponent,
    CancelBookingComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimezoneInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenRetrievalInterceptor,
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
    GSTService,
  ],
})
export class Temp000002Module {}
