import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
// import { HttpClient } from '@angular/common/http';
import { Subscription, BehaviorSubject } from 'rxjs';
import { SnackBarService } from '../../../../../../../../../libs/shared/material/src/lib/services/snackbar.service';
import { MessageTabService } from './messages-tab.service';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  liveRequestEnable = new BehaviorSubject(null);
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
          } else {
            this._snackbarService.openSnackBarAsText(
              `Please allow notification or else some of your features won't work properly.`,
              '',
              {
                panelClass: 'notification',
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

  showNotificationAsSnackBar(payload: any) {
    const title = payload.notification?.body.split(',')[0];
    this._snackbarService.openSnackBarAsText(
      `${payload.notification?.title}(${title}): ${decodeURIComponent(
        payload.notification?.body.substring(
          payload.notification?.body.indexOf(',') + 1
        )
      )}`,
      '',
      {
        panelClass: 'notification',
        horizontalPosition: 'center',
      }
    );
  }

  playNotificationSound() {
    let sound = new Howl({
      src: ['assets/audio/notification.mp3'],
    });

    sound.play();
  }
  //#endregion Public Methods

  destroySubscription() {
    this.subscription.unsubscribe();
  }
}
