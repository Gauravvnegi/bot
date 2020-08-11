import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { Temp000001RoutingModule } from './temp000001-routing.module';
import { WebUserSharedModule } from '@hospitality-bot/web-user/shared';
import { StepperContentRendererDirective } from './directives/stepper-content-renderer.directive';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { GuestDetailsService } from 'libs/web-user/shared/src/lib/services/guest-details.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { FeedbackDetailsService } from 'libs/web-user/shared/src/lib/services/feedback-details.service';
import { FooterComponent } from './containers/footer/footer.component';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SignaturePadModule } from 'angular2-signaturepad';
import { ButtonDirective } from './directives/button-renderer.directive';
import { BillSummaryService } from 'libs/web-user/shared/src/lib/services/bill-summary.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';

@NgModule({
  imports: [
    CommonModule,
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
    FooterComponent,
  ],
  providers: [
    ApiService,
    ReservationService,
    StayDetailsService,
    GuestDetailsService,
    DateService,
    DocumentDetailsService,
    FeedbackDetailsService,
    BillSummaryService,
    HealthDetailsService,
    RegCardService,
  ],
})
export class Temp000001Module {}
