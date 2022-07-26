import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SignaturePadModule } from 'angular2-signaturepad';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { DefaultAmenityService } from 'libs/web-user/shared/src/lib/services/default-amenity.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
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
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { GSTService } from 'libs/web-user/shared/src/lib/services/gst.service';
import { Temp000001ButtonComponent } from './presentational/temp000001-button/temp000001-button.component';
import { Temp000001InputPopupComponent } from './presentational/temp000001-input-popup/temp000001-input-popup.component';
import { ButtonTemplateSwitchDirective } from './directives/button-template-switch.directive';
import { Temp000001SignatureCaptureWrapperComponent } from './presentational/temp000001-signature-capture-wrapper/temp000001-signature-capture-wrapper.component';
import { TokenInterceptor } from 'libs/web-user/templates/temp000001/src/lib/interceptors/token.interceptor';
import { QuestionnaireComponent } from './containers/questionnaire/questionnaire.component';

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
    Temp000001ButtonComponent,
    Temp000001InputPopupComponent,
    ButtonTemplateSwitchDirective,
    Temp000001SignatureCaptureWrapperComponent,
    QuestionnaireComponent,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimezoneInterceptor,
      multi: true,
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenRetievalInterceptor,
    //   multi: true,
    // },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    ReservationService,
    HotelService,
    ParentFormService,
    StepperService,
    StayDetailsService,
    GuestDetailsService,
    DocumentDetailsService,
    PaymentDetailsService,
    ReservationSummaryService,
    BillSummaryService,
    HealthDetailsService,
    RegCardService,
    SummaryService,
    SignatureService,
    // AccessTokenService,
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
