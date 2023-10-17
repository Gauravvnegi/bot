import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewNotAllowedComponent } from './component/view-not-allowed/view-not-allowed.component';
import { AdminViewNotAllowedRoutingModule } from './admin-view-not-allowed.routing.module';

@NgModule({
  imports: [CommonModule, AdminViewNotAllowedRoutingModule],
  declarations: [ViewNotAllowedComponent],
})
export class AdminViewNotAllowedModule {}
