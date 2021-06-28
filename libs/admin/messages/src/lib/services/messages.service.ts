import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import * as moment from 'moment';

@Injectable()
export class MessageService extends ApiService {
  getChatList(hotelId: string) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/?hotelId=${hotelId}`
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
