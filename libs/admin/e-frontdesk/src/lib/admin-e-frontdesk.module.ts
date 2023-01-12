import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EFrontDeskComponent } from './components/e-front-desk/e-front-desk.component';
import { AdminEFrontdeskRoutingModule } from './admin-e-frontdesk.routing.module';

@NgModule({
  imports: [CommonModule, AdminEFrontdeskRoutingModule],
  declarations: [EFrontDeskComponent],
})
export class AdminEFrontdeskModule {}
