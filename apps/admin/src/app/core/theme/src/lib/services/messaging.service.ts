import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
// import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';
import { SnackBarService } from '../../../../../../../../../libs/shared/material/src/lib/services/snackbar.service';
import { MessageTabService } from './messages-tab.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  private subscription: Subscription = new Subscription();
  tabActive = new BehaviorSubject(false);

  constructor(
    private fireMessaging: AngularFireMessaging,
    private messageTabService: MessageTabService,
    private _snackbarService: SnackBarService
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

  showNotificationAsSnackBar(payload) {
    const title = payload.notification?.body.split(',')[0];
    this._snackbarService.openSnackBarAsText(
      `${
        payload.notification?.title
      }(${title}): ${payload.notification?.body.substring(
        payload.notification?.body.indexOf(',') + 1
      )}`,
      '',
      {
        panelClass: 'notification',
        horizontalPosition: 'center',
      }
    );
  }
  //#endregion Public Methods

  destroySubscription() {
    this.subscription.unsubscribe();
  }
}
