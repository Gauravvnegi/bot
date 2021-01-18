import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AddGstComponent } from './containers/add-gst/add-gst.component';
import { AmenitiesComponent } from './containers/amenities/amenities.component';
import { ApplicationStatusComponent } from './containers/application-status/application-status.component';
import { BillSummaryDetailsComponent } from './containers/bill-summary-details/bill-summary-details.component';
import { BillSummaryDetailsWrapperComponent } from './containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { ComplimentaryAmenitiesComponent } from './containers/complimentary-amenities/complimentary-amenities.component';
import { DocumentsDetailsComponent } from './containers/documents-details/documents-details.component';
import { DocumentDetailsWrapperComponent } from './containers/document-details-wrapper/document-details-wrapper.component';
import { FeedbackDetailsComponent } from './containers/feedback-details/feedback-details.component';
import { FeedbackDetailsWrapperComponent } from './containers/feedback-details-wrapper/feedback-details-wrapper.component';
import { FeedbackMainComponent } from './containers/feedback-main/feedback-main.component';
import { FooterComponent } from './containers/footer/footer.component';
import { GuestDetailsComponent } from './containers/guest-details/guest-details.component';
import { GuestDetailsWrapperComponent } from './containers/guest-details-wrapper/guest-details-wrapper.component';
import { HeaderComponent } from './containers/header/header.component';
import { HeaderSummaryComponent } from './containers/header-summary/header-summary.component';
import { HealthDeclarationComponent } from './containers/health-declaration/health-declaration.component';
import { HealthDeclarationWrapperComponent } from './containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { MainComponent } from './containers/main/main.component';
import { PackageRendererComponent } from './containers/package-renderer/package-renderer.component';
import { PaidAmenitiesComponent } from './containers/paid-amenities/paid-amenities.component';
import { PaymentDetailsWrapperComponent } from './containers/payment-details-wrapper/payment-details-wrapper.component';
import { PaymentMainComponent } from './containers/payment-main/payment-main.component';
import { PaymentSummaryComponent } from './containers/payment-summary/payment-summary.component';
import { RegistrationCardComponent } from './containers/registration-card/registration-card.component';
import { SpecialCommentsComponent } from './containers/special-comments/special-comments.component';
import { StatusComponent } from './containers/status/status.component';
import { StayDetailsComponent } from './containers/stay-details/stay-details.component';
import { StayDetailsWrapperComponent } from './containers/stay-details-wrapper/stay-details-wrapper.component';
import { SummaryComponent } from './containers/summary/summary.component';
import { SummaryMainComponent } from './containers/summary-main/summary-main.component';
import { SummaryWrapperComponent } from './containers/summary-wrapper/summary-wrapper.component';
import { TempLoader000002Component } from './containers/temp-loader000002/temp-loader000002.component';
import { Temp000002Component } from './containers/temp000002/temp000002.component';
import { ThankYouMainComponent } from './containers/thank-you-main/thank-you-main.component';
import { AirportFacilitiesComponent } from './containers/packages/airport-facilities/airport-facilities.component';
import { DefaultAmenityComponent } from './containers/packages/default-amenity/default-amenity.component';
import { Temp000002TextareaComponent } from './presentational/temp000002-textarea/temp000002-textarea.component';


export const sharedAuthRoutes: Route[] = [
  {
    path: '',
    component: Temp000002Component,
    children: [
      {
        path: '',
        component: MainComponent,
      },
    ],
  },
  {
    path: 'payment',
    component: Temp000002Component,
    children: [
      {
        path: '',
        component: PaymentMainComponent,
      },
    ],
  },
  {
    path: 'feedback',
    component: Temp000002Component,
    children: [
      {
        path: '',
        component: FeedbackMainComponent,
      },
    ],
  },
  {
    path: 'thankyou',
    component: Temp000002Component,
    children: [
      {
        path: '',
        component: ThankYouMainComponent,
      },
    ],
  },
  {
    path: 'summary',
    component: Temp000002Component,
    children: [
      {
        path: '',
        component: SummaryMainComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(sharedAuthRoutes)],
  exports: [RouterModule],
})
export class Temp000002RoutingModule {
  static readonly components: any[] = [
    AddGstComponent,
    AmenitiesComponent,
    ApplicationStatusComponent,
    BillSummaryDetailsComponent,
    BillSummaryDetailsWrapperComponent,
    ComplimentaryAmenitiesComponent,
    DocumentsDetailsComponent,
    DocumentDetailsWrapperComponent,
    FeedbackDetailsComponent,
    FeedbackDetailsWrapperComponent,
    FeedbackMainComponent,
    FooterComponent,
    GuestDetailsComponent,
    GuestDetailsWrapperComponent,
    HeaderComponent,
    HeaderSummaryComponent,
    HealthDeclarationComponent,
    HealthDeclarationWrapperComponent,
    MainComponent,
    PackageRendererComponent,
    PaidAmenitiesComponent,
    PaymentDetailsWrapperComponent,
    PaymentMainComponent,
    PaymentSummaryComponent,
    RegistrationCardComponent,
    SpecialCommentsComponent,
    StatusComponent,
    StayDetailsComponent,
    StayDetailsWrapperComponent,
    SummaryComponent,
    SummaryMainComponent,
    SummaryWrapperComponent,
    TempLoader000002Component,
    Temp000002Component,
    ThankYouMainComponent,
    AirportFacilitiesComponent,
    DefaultAmenityComponent,
    Temp000002TextareaComponent,
  ];
}
