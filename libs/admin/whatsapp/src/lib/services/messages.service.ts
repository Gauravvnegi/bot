import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { IChat } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService extends ApiService {
  refreshData$ = new BehaviorSubject(false);
  private whatsappUnreadContacts$ = new BehaviorSubject(0);
  chatList = {
    messages: {},
    receiver: {},
  };
  getChatList(hotelId: string, queryObj) {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/${queryObj}`);
  }

  searchChatList(hotelId: string, queryObj) {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/search${queryObj}`);
  }

  getChat(hotelId, receiverId, queryObj) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/${receiverId}${queryObj}`
    );
  }

  sendMessage(hotelId: string, data) {
    return this.post(`/api/v1/hotel/${hotelId}/conversations/send`, data);
  }

  updateGuestDetail(hotelId: string, conversationId: string, data) {
    return this.patch(
      `/api/v1/hotel/${hotelId}/conversations/${conversationId}/guest-associate`,
      data
    );
  }

  searchBooking(queryObj) {
    return this.get(`/api/v1/search${queryObj}`);
  }

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  markAsRead(hotelId: string, contactId: string, data) {
    return this.patch(
      `/api/v1/hotel/${hotelId}/conversations/${contactId}/guest-associate`,
      data
    );
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

  getWhatsappUnreadContactCount() {
    return this.whatsappUnreadContacts$.asObservable();
  }

  setWhatsappUnreadContactCount(value) {
    this.whatsappUnreadContacts$.next(value);
  }

  downloadDocuments(url) {
    return this.get(`/api/v1/download?url=${url}`, {
      responseType: 'blob',
    });
  }
}
