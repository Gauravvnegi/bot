import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminCreateWithRoutingModule } from './admin-create-with.routing.module';
import { CookieService } from 'ngx-cookie-service';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';

@NgModule({
  imports: [CommonModule, AdminCreateWithRoutingModule, AdminSharedModule],
  providers: [CookieService],
  declarations: [...AdminCreateWithRoutingModule.components],
})
export class AdminCreateWithModule {}
