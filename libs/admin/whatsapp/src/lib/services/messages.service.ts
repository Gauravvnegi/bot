import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { DateService } from 'libs/shared/utils/src/lib/services/date.service';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { IChat } from '../models/message.model';

@Injectable({ providedIn: 'root' })
export class MessageService extends ApiService {
  refreshData$ = new BehaviorSubject(false);
  refreshRequestList$ = new BehaviorSubject(false);
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

  sendMessage(hotelId: string, data, queryObj) {
    return this.post(
      `/api/v1/hotel/${hotelId}/conversations/send${queryObj}`,
      data
    );
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

  downloadDocuments(url) {
    return this.get(`/api/v1/download?url=${url}`, {
      responseType: 'blob',
    });
  }

  getLiveChat(hotelId, conversationId, phone) {
    return this.get(
      `/api/v1/hotel/${hotelId}/conversations/${conversationId}/live-chat?phoneNumber=${phone}`
    );
  }

  updateLiveChat(hotelId, conversationId, data) {
    return this.put(
      `/api/v1/hotel/${hotelId}/conversations/${conversationId}/live-chat`,
      data
    );
  }

  getRequestByConfNo(config) {
    return this.get(`/api/v1/request/created-jobs${config.queryObj}`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/guest/${guestId}/reservations`);
  }

  updatePreArrivalRequest(id, data) {
    return this.patch(`/api/v1/request/pre-arrival/${id}`, data);
  }

  closeRequest(config, data) {
    return this.post(
      `/api/v1/reservation/cms-close-job${config.queryObj}`,
      data
    );
  }

  exportChat(hotelId: string, id: string) {
    return this.get(`/api/v1/hotel/${hotelId}/conversations/${id}/export`, {
      responseType: 'blob',
    });
  }

  filterMessagesByDate(messages: IChat[], timezone = '+05:30') {
    const currentDate = moment().utcOffset(timezone);
    const filteredMsgObj = {};

    messages.forEach((message: IChat) => {
      const dateDiff = currentDate.diff(
        moment(message.timestamp).utcOffset(timezone),
        'days'
      );
      if (dateDiff === 0) {
        const currentDay = currentDate.format('DD');
        const messageDay = moment(message.timestamp)
          .utcOffset(timezone)
          .format('DD');
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
        const date = DateService.getDateFromTimeStamp(
          message.timestamp,
          'DD/MM/YYYY',
          timezone
        );
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
}
