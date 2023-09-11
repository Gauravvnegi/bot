import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AdminMembersRoutingModule } from './admin-members.routing.module';
import { FormService } from './services/form.service';

@NgModule({
  imports: [CommonModule, AdminMembersRoutingModule],
  declarations: [...AdminMembersRoutingModule.components, MainComponent],
  providers: [FormService],
})
export class AdminMembersModule {}
