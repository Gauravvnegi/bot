import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import * as moment from 'moment';
import { IChat } from '../models/message.model';

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

  filterMessagesByDate(messages: IChat[]) {
    const currentDate = moment();
    const filteredMsgObj = {};

    messages.forEach((message: IChat) => {
      const dateDiff = currentDate.diff(moment(message.timestamp), 'days');
      if (dateDiff === 0) {
        const currentDay = currentDate.format('DD');
        const messageDay = moment(message.timestamp).format('DD');
        if (currentDay === messageDay) {
          if (Object.keys(filteredMsgObj).includes('Today')) {
            filteredMsgObj['Today'].push(message);
          } else {
            filteredMsgObj['Today'] = [message];
          }
        } else {
          if (Object.keys(filteredMsgObj).includes('Yesterday')) {
            filteredMsgObj['Yesterday'].push(message);
          } else {
            filteredMsgObj['Yesterday'] = [message];
          }
        }
      } else if (dateDiff === 1) {
        if (Object.keys(filteredMsgObj).includes('Yesterday')) {
          filteredMsgObj['Yesterday'].push(message);
        } else {
          filteredMsgObj['Yesterday'] = [message];
        }
      } else {
        const date = moment(message.timestamp).format('DD/MM/YYYY');
        if (Object.keys(filteredMsgObj).includes(date)) {
          filteredMsgObj[date].push(message);
        } else {
          filteredMsgObj[date] = [message];
        }
      }
    });
    return filteredMsgObj;
  }
}
