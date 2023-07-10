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
  getChatList(entityId: string, queryObj) {
    return this.get(`/api/v1/entity/${entityId}/conversations/${queryObj}`);
  }

  searchChatList(entityId: string, queryObj) {
    return this.get(`/api/v1/entity/${entityId}/conversations/search${queryObj}`);
  }

  getChat(entityId, receiverId, queryObj) {
    return this.get(
      `/api/v1/entity/${entityId}/conversations/${receiverId}${queryObj}`
    );
  }

  sendMessage(entityId: string, data, queryObj) {
    return this.post(
      `/api/v1/entity/${entityId}/conversations/send${queryObj ?? ''}`,
      data
    );
  }

  updateGuestDetail(entityId: string, conversationId: string, data) {
    return this.patch(
      `/api/v1/entity/${entityId}/conversations/${conversationId}/guest-associate`,
      data
    );
  }

  searchBooking(queryObj) {
    return this.get(`/api/v1/search${queryObj}`);
  }

  getReservationDetails(reservationId): Observable<any> {
    return this.get(`/api/v1/reservation/${reservationId}?raw=true`);
  }

  markAsRead(entityId: string, contactId: string, data) {
    return this.patch(
      `/api/v1/entity/${entityId}/conversations/${contactId}/guest-associate`,
      data
    );
  }

  downloadDocuments(url) {
    return this.get(`/api/v1/download?url=${url}`, {
      responseType: 'blob',
    });
  }

  getLiveChat(entityId, conversationId, phone) {
    return this.get(
      `/api/v1/entity/${entityId}/conversations/${conversationId}/live-chat?phoneNumber=${phone}`
    );
  }

  updateLiveChat(entityId, conversationId, data) {
    return this.put(
      `/api/v1/entity/${entityId}/conversations/${conversationId}/live-chat`,
      data
    );
  }

  getRequestByConfNo(config) {
    return this.get(`/api/v1/request/created-jobs${config.queryObj}`);
  }

  getGuestReservations(guestId: string): Observable<any> {
    return this.get(`/api/v1/members/${guestId}/reservations`);
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

  exportChat(entityId: string, id: string) {
    return this.get(`/api/v1/entity/${entityId}/conversations/${id}/export`, {
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
