import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { SharedMaterialModule } from 'libs/shared/material/src';
import { MessagesComponent } from './components/messages/messages.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminMessagesRoutingModule } from './admin-messages.routing.module';
import { SharedModule } from 'primeng/api';
import { AdminWhatsappModule } from 'libs/admin/whatsapp/src/lib/admin-whatsapp.module';
import { MessageService } from 'libs/admin/whatsapp/src/lib/services/messages.service';

@NgModule({
  imports: [
    CommonModule,
    AdminMessagesRoutingModule,
    AdminWhatsappModule,
    AdminSharedModule,
    SharedModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  declarations: [MessagesComponent],
  providers: [MessageService],
})
export class AdminMessagesModule {}
