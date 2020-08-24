import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ApplicationStatusComponent } from './containers/application-status/application-status.component';
import { BillSummaryDetailsWrapperComponent } from './containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { BillSummaryDetailsComponent } from './containers/bill-summary-details/bill-summary-details.component';
import { DocumentsDetailsWrapperComponent } from './containers/documents-details-wrapper/documents-details-wrapper.component';
import { DocumentsDetailsComponent } from './containers/documents-details/documents-details.component';
import { FeedbackDetailsWrapperComponent } from './containers/feedback-details-wrapper/feedback-details-wrapper.component';
import { FeedbackDetailsComponent } from './containers/feedback-details/feedback-details.component';
import { FooterComponent } from './containers/footer/footer.component';
import { GuestDetailsWrapperComponent } from './containers/guest-details-wrapper/guest-details-wrapper.component';
import { GuestDetailsComponent } from './containers/guest-details/guest-details.component';
import { HeaderSummaryComponent } from './containers/header-summary/header-summary.component';
import { HeaderComponent } from './containers/header/header.component';
import { HealthDeclarationWrapperComponent } from './containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { HealthDeclarationComponent } from './containers/health-declaration/health-declaration.component';
import { MainComponent } from './containers/main/main.component';
import { PaymentDetailsWrapperComponent } from './containers/payment-details-wrapper/payment-details-wrapper.component';
import { PaymentDetailsComponent } from './containers/payment-details/payment-details.component';
import { PaymentSummaryComponent } from './containers/payment-summary/payment-summary.component';
import { RegistrationCardComponent } from './containers/registration-card/registration-card.component';
import { SpecialCommentsComponent } from './containers/special-comments/special-comments.component';
import { StatusComponent } from './containers/status/status.component';
import { StayDetailsWrapperComponent } from './containers/stay-details-wrapper/stay-details-wrapper.component';
import { StayDetailsComponent } from './containers/stay-details/stay-details.component';
import { SummaryWrapperComponent } from './containers/summary-wrapper/summary-wrapper.component';
import { SummaryComponent } from './containers/summary/summary.component';
import { Temp000001Component } from './containers/temp000001/temp000001.component';
import { AmenitiesComponent } from './containers/amenities/amenities.component';

export const sharedAuthRoutes: Route[] = [
  { path: '', component: Temp000001Component },
];

@NgModule({
  imports: [RouterModule.forChild(sharedAuthRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class Temp000001RoutingModule {
  static components = [
    Temp000001Component,
    MainComponent,
    StayDetailsComponent,
    SpecialCommentsComponent,
    StayDetailsWrapperComponent,
    GuestDetailsComponent,
    GuestDetailsWrapperComponent,
    HealthDeclarationComponent,
    HealthDeclarationWrapperComponent,
    PaymentDetailsComponent,
    PaymentSummaryComponent,
    PaymentDetailsWrapperComponent,
    DocumentsDetailsComponent,
    DocumentsDetailsWrapperComponent,
    HeaderComponent,
    StatusComponent,
    FeedbackDetailsComponent,
    FeedbackDetailsWrapperComponent,
    FooterComponent,
    BillSummaryDetailsComponent,
    BillSummaryDetailsWrapperComponent,
    RegistrationCardComponent,
    SummaryWrapperComponent,
    SummaryComponent,
    ApplicationStatusComponent,
    HeaderSummaryComponent,
    AmenitiesComponent
  ];
}
