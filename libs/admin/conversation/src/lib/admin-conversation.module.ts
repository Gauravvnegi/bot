import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversationComponent } from './components/conversation/conversation.component';
import { AdminConversationRoutingModule } from './admin-conversation.routing.module';

@NgModule({
  imports: [CommonModule, AdminConversationRoutingModule],
  declarations: [ConversationComponent],
})
export class AdminConversationModule {}
