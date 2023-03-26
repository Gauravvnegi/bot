import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminOffersRoutingModule } from './admin-offers.routing.module';
import { CreateOfferComponent } from './components/create-offer/create-offer.component';
import { MainComponent } from './components/main/main.component';
import { OffersDataTableComponent } from './components/offers-data-table/offers-data-table.component';
import { OffersServices } from './services/offers.service';

@NgModule({
  imports: [
    CommonModule,
    AdminOffersRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [MainComponent, CreateOfferComponent, OffersDataTableComponent],
  providers: [OffersServices],
})
export class AdminOffersModule {}
