import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MembersComponent } from './members/members.component';
import { AdminMembersRoutingModule } from './admin-members.routing.module';

@NgModule({
  imports: [CommonModule, AdminMembersRoutingModule],
  declarations: [MembersComponent]
})
export class AdminMembersModule {}
