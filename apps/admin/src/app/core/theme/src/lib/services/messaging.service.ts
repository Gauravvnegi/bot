import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Subscription, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  private subscription: Subscription;

  constructor(private fireMessaging: AngularFireMessaging) {
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
