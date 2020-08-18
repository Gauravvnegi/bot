import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { SignaturePadModule } from 'angular2-signaturepad';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
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
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { TokenRetievalInterceptor } from './interceptors/token-retrieval.interceptor';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    WebUserSharedModule,
    RouterModule,
    Temp000001RoutingModule,
    SignaturePadModule,
    PdfViewerModule,
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
  ],
})
export class Temp000001Module {}
