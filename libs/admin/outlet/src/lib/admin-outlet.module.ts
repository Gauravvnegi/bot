import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OutletComponent } from './components/outlet/outlet.component';
import { AdminOutletRoutingModule } from './admin-outlet.routing.module';

@NgModule({
  imports: [CommonModule, AdminOutletRoutingModule],
  declarations: [OutletComponent],
})
export class AdminOutletModule {}
