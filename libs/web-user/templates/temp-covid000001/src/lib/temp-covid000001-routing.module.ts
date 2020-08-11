import { RouterModule, Route } from '@angular/router';
import { NgModule } from '@angular/core';
import { TempCovid000001Component } from './containers/temp-covid000001/temp-covid000001.component';
import { HeaderComponent } from './containers/header/header.component';
import { AboutSectionComponent } from './containers/about-section/about-section.component';
import { StaySafeComponent } from './containers/stay-safe/stay-safe.component';
import { FooterComponent } from './containers/footer/footer.component';
import { FaqComponent } from './containers/faq/faq.component';
import { FaqWrapperComponent } from './containers/faq-wrapper/faq-wrapper.component';
import { RaiseRequestComponent } from './containers/raise-request/raise-request.component';
import { RaiseRequestWrapperComponent } from './containers/raise-request-wrapper/raise-request-wrapper.component';

export const sharedAuthRoutes: Route[] = [
  { path: '', component: TempCovid000001Component },
];

@NgModule({
  imports: [RouterModule.forChild(sharedAuthRoutes)],
  exports: [RouterModule],
  providers: [],
})
export class TempCovid000001RoutingModule {
  static components = [
    TempCovid000001Component,
    HeaderComponent,
    AboutSectionComponent,
    StaySafeComponent,
    FooterComponent,
    FaqComponent,
    FaqWrapperComponent,
    RaiseRequestComponent,
    RaiseRequestWrapperComponent
  ];
}
