import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  private subscription: Subscription;

  constructor(
    private fireMessaging: AngularFireMessaging,
    private http: HttpClient
  ) {
    this.subscription = new Subscription();
    this.fireMessaging.tokenChanges.subscribe((response) => {
      console.log('Token Refreshed');
    });
  }

  //#region Private Methods
  requestPermission() {
    this.fireMessaging.requestToken.subscribe(
      (token) => {
        // Call API
        console.log(token);
        this.http.post(
          `http://afe37dbc08b5.ngrok.io/api/v1/notification/token`,
          {
            title: 'Put the push notification title here',
            message: 'Put here push notification body here',
            token: '74EFFF07-D2E6-41C7-B077-EE1A874E7214',
          }
        );
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  receiveMessage() {
    this.fireMessaging.messages.subscribe((payload) => {
      console.log('new message received. ', payload);
      this.currentMessage.next(payload);
    });
  }
  //#endregion Public Methods
}
