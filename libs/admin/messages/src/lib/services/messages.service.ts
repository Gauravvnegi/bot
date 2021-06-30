import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class MessageService extends ApiService {
  getChatList(hotelId: string, config) {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/${config}`);
  }

  searchChatList(hotelId: string, config) {
    return this.get(
      `/api/v1/hotel/d63974e6-9d37-4eff-bf93-81b26f6751ee/conversations/search${config}`
    );
  }

  getChat(hotelId, receiverId, config) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/${receiverId}${config}`
    );
  }

  sendMessage(hotelId: string, data) {
    return this.post(`/api/v1/hotel/${hotelId}/conversations/send`, data);
  }
}
