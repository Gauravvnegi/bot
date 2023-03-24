import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { CreateOfferComponent } from './components/create-offer/create-offer.component';
import { OffersDataTableComponent } from './components/offers-data-table/offers-data-table.component';
import { AdminOffersRoutingModule } from './admin-offers.routing.module';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';

@NgModule({
  imports: [
    CommonModule,
    AdminOffersRoutingModule,
    AdminSharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [MainComponent, CreateOfferComponent, OffersDataTableComponent],
  providers: [RoomService],
})
export class AdminOffersModule {}
