import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './components/main/main.component';
import { AdminMembersRoutingModule } from './admin-members.routing.module';

@NgModule({
  imports: [CommonModule, AdminMembersRoutingModule],
  declarations: [...AdminMembersRoutingModule.components, MainComponent],
})
export class AdminMembersModule {}
