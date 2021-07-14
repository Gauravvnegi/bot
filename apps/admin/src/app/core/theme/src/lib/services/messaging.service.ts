import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
// import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';
import { MessageTabService } from './messages-tab.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  private subscription: Subscription = new Subscription();

  constructor(
    private fireMessaging: AngularFireMessaging,
    private messageTabService: MessageTabService
  ) {
    this.fireMessaging.tokenChanges.subscribe((response) => {
      console.log('Token Refreshed');
    });
  }

  //#region Private Methods
  requestPermission(config) {
    this.subscription.add(
      this.fireMessaging.requestToken.subscribe(
        (token) => {
          // Call API

          if (token) {
            this.messageTabService
              .registerFirebaseMessage(config, {
                token: token,
                type: 'web',
              })
              .subscribe(
                (response) => {
                  console.log('Token stored on server');
                },
                ({ err }) => {
                  console.error(
                    'Unable to store token on server ==> ',
                    err.message
                  );
                }
              );
          }
        },
        (err) => {
          console.error('Unable to get permission to notify.', err);
        }
      )
    );
  }

  receiveMessage() {
    return this.fireMessaging.messages;
  }
  //#endregion Public Methods

  destroySubscription() {
    this.subscription.unsubscribe();
  }
}
