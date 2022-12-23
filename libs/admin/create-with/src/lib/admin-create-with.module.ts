import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCreateWithRoutingModule } from './admin-create-with.routing.module';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  imports: [CommonModule, AdminCreateWithRoutingModule],
  providers: [CookieService],
  declarations: [...AdminCreateWithRoutingModule.components],
})
export class AdminCreateWithModule {}
