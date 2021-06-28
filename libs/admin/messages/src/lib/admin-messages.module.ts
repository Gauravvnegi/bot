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
import { GuestPersonalInfoComponent } from './components/guest-personal-info/guest-personal-info.component';
import { GuestBookingInfoComponent } from './components/guest-booking-info/guest-booking-info.component';
import { GuestTicketsComponent } from './components/guest-tickets/guest-tickets.component';
import { GuestRequestsComponent } from './components/guest-requests/guest-requests.component';
import { MessageService } from './services/messages.service';
import { SharedModule } from 'primeng/api';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@NgModule({
  imports: [
    CommonModule,
    AdminMessagesRoutingModule,
    AdminSharedModule,
    SharedModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    InfiniteScrollModule,
  ],
  declarations: [
    MessagesComponent,
    ChatListComponent,
    ChatComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    GuestTicketsComponent,
    GuestRequestsComponent,
  ],
  providers: [MessageService],
})
export class AdminMessagesModule {}
