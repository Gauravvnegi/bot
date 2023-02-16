import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { CookieService } from 'ngx-cookie-service';
import { AdminCreateWithRoutingModule } from './admin-create-with.routing.module';
import { CreateWithService } from './services/create-with.service';

@NgModule({
  imports: [CommonModule, AdminCreateWithRoutingModule, AdminSharedModule],
  providers: [CookieService, CreateWithService],
  declarations: [...AdminCreateWithRoutingModule.components],
})
export class AdminCreateWithModule {}
