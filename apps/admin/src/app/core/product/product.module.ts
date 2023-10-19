import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { ProductRoutingModule } from './product.routing.module';
import { RouterModule } from '@angular/router';
import { MainComponent } from './component/main/main.component';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, RouterModule, ProductRoutingModule],
  providers: [ReservationService],
})
export class ProductModule {}
