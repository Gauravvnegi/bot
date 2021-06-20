import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { MessagesComponent } from './components/messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminMessagesRoutingModule } from './admin-messages.routing.module';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { GuestInfoComponent } from './components/guest-info/guest-info.component';

@NgModule({
  imports: [
    CommonModule,
    AdminMessagesRoutingModule,
    AdminSharedModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    MessagesComponent,
    GuestInfoComponent,
    ChatListComponent,
    ChatComponent,
  ],
})
export class AdminMessagesModule {}
