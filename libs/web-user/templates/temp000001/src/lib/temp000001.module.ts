import { CommonModule } from '@angular/common';
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
import { FooterComponent } from './containers/footer/footer.component';
import { ButtonDirective } from './directives/button-renderer.directive';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { ComplimentaryServiceComponent } from './containers/complimentary-service/complimentary-service.component';
import { PaidServiceComponent } from './containers/paid-service/paid-service.component';
import { AirportPickupComponent } from './containers/airport-pickup/airport-pickup.component';
import { BreakfastComponent } from './containers/breakfast/breakfast.component';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';

@NgModule({
  imports: [
    CommonModule,
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
    FooterComponent,
    ComplimentaryServiceComponent,
    PaidServiceComponent,
    AirportPickupComponent,
    BreakfastComponent,
  ],
  providers: [
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
    AmenitiesService,
    ComplimentaryService,
    PaidService,
    AirportService
  ],
})
export class Temp000001Module {}
