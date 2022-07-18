import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChatListComponent } from './components/chat-list/chat-list.component';
import { ChatComponent } from './components/chat/chat.component';
import { ContactSortFilterComponent } from './components/contact-sort-filter/contact-sort-filter.component';
import { GuestBookingInfoComponent } from './components/guest-booking-info/guest-booking-info.component';
import { GuestDetailMapComponent } from './components/guest-detail-map/guest-detail-map.component';
import { GuestInfoComponent } from './components/guest-info/guest-info.component';
import { GuestPersonalInfoComponent } from './components/guest-personal-info/guest-personal-info.component';
import { GuestRequestsComponent } from './components/guest-requests/guest-requests.component';
import { GuestTicketsComponent } from './components/guest-tickets/guest-tickets.component';
import { MediaChatComponent } from './components/media-chat/media-chat.component';
import { MessageBoxComponent } from './components/message-box/message-box.component';
import { WhatsappComponent } from './components/whatsapp/whatsapp.component';
import { MessageService } from 'primeng/api';
import { RequestService } from 'libs/admin/request/src/lib/services/request.service';
import { LinkDetector } from 'libs/admin/shared/src/lib/pipes/linkDetector.pipe';

@NgModule({
  imports: [
    CommonModule,
    AdminSharedModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [
    ChatListComponent,
    ChatComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    GuestTicketsComponent,
    GuestRequestsComponent,
    WhatsappComponent,
    ContactSortFilterComponent,
    GuestDetailMapComponent,
    MediaChatComponent,
    MessageBoxComponent,
  ],
  exports: [
    ChatListComponent,
    ChatComponent,
    GuestInfoComponent,
    GuestPersonalInfoComponent,
    GuestBookingInfoComponent,
    GuestTicketsComponent,
    GuestRequestsComponent,
    WhatsappComponent,
    ContactSortFilterComponent,
    GuestDetailMapComponent,
    MediaChatComponent,
    MessageBoxComponent,
  ],
  providers: [MessageService, RequestService],
})
export class AdminWhatsappModule {}
