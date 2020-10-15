import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { AdminReservationRoutingModule } from './admin-reservation.routing.module';
import { ReservationService } from './services/reservation.service';
import { DetailsComponent } from './components/details/details.component';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { DropdownModule } from 'primeng/dropdown';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminGuestDetailsComponent } from './components/admin-guest-details/admin-guest-details.component';
import { AdminPackageDetailsComponent } from './components/admin-package-details/admin-package-details.component';
import { AdminDocumentsDetailsComponent } from './components/admin-documents-details/admin-documents-details.component';
import { AdminPaymentDetailsComponent } from './components/admin-payment-details/admin-payment-details.component';
import { AdminDetailsService } from './services/admin-details.service';
import { DefaultPackageComponent } from './components/packages/default-package/default-package.component';

export const adminReservationRoutes: Route[] = [];

@NgModule({
  imports: [
    CommonModule,
    AdminReservationRoutingModule,
    SharedMaterialModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
  ],
  providers: [ReservationService, AdminDetailsService],
  declarations: [
    DetailsComponent,
    AdminGuestDetailsComponent,
    AdminDocumentsDetailsComponent,
    AdminPackageDetailsComponent,
    AdminPaymentDetailsComponent,
    DefaultPackageComponent,
  ],
  exports: [
    DetailsComponent,
    AdminGuestDetailsComponent,
    AdminDocumentsDetailsComponent,
    AdminPackageDetailsComponent,
    AdminPaymentDetailsComponent,
    DefaultPackageComponent,
  ],
})
export class AdminReservationModule {}
