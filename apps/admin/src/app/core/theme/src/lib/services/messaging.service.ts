import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { Subscription, BehaviorSubject } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { MessageTabService } from './messages-tab.service';
import { Howl } from 'howler';
import { ToastKeys } from 'libs/shared/material/src/lib/types/snackbar.type';
import { ModalConfig } from '@hospitality-bot/admin/shared';

@Injectable({
  providedIn: 'root',
})
export class FirebaseMessagingService {
  currentMessage = new BehaviorSubject(null);
  liveRequestEnable = new BehaviorSubject(null);
  newInhouseRequest = new BehaviorSubject(null);
  private subscription: Subscription = new Subscription();
  tabActive = new BehaviorSubject(false);

  $receivedNewNotification = new BehaviorSubject(false);
  $newNotification = new BehaviorSubject<ModalConfig>(null);

  constructor(
    private fireMessaging: AngularFireMessaging,
    private messageTabService: MessageTabService,
    private _snackbarService: SnackBarService
  ) {
    this.subscription.add(
      this.fireMessaging.tokenChanges.subscribe((response) =>
        console.log('Messaging token Refreshed')
      )
    );
  }

  receivedNewNotification() {
    this.$receivedNewNotification.next(true);
  }

  //#region Private Methods
  requestPermission(config) {
    this.subscription.add(
      this.fireMessaging.requestToken.subscribe(
        (token) => {
          if (token)
            this.messageTabService
              .registerFirebaseMessage(config, {
                token: token,
                type: 'web',
              })
              .subscribe(
                (response) => console.log('Token stored on server'),
                ({ error }) =>
                  console.error(
                    'Unable to store token on server ==> ',
                    error.message
                  )
              );
          else this.openNotificationAlert();
        },
        (error) => console.error('Unable to get permission to notify.', error)
      )
    );
  }

  /**
   * @remarks $newNotification is subscribed in app.component for showing dialog
   */
  openNotificationAlert() {
    this.$newNotification.next({
      styleClass: 'confirm-dialog',
      width: 'unset',
    });
  }

  /**
   *
   * @remarks Subscribe this only in layout (main-code).
   * If subscribed in any other places than that will override the main one
   * use $receivedNewNotification for it. It will get triggered from receiveMessage subscription
   */
  receiveMessage() {
    return this.fireMessaging.messages;
  }

  showNotificationAsSnackBar(payload: any) {
    if (payload?.data?.notificationType === 'WHATSAPP') {
      this._snackbarService.openSnackBarAsText(payload.data?.message, '', {
        duration: 5000,
        title: payload.data?.nickName ?? payload.data?.phoneNumber,
        key: ToastKeys.whatsappNotification,
      });
    } else if (payload.notification?.body) {
      const title = payload.notification?.body.split('\n')[0];
      this._snackbarService.openSnackBarAsText(
        `${payload.notification?.title}: ${decodeURIComponent(
          payload.notification?.body.substring(
            payload.notification?.body.split('\n').join(' | ')
          )
        )}`,
        '',
        {
          panelClass: 'notification',
          horizontalPosition: 'center',
        }
      );
    }
  }

  playNotificationSound(notificationType, isBuzz: string) {
    const sound =
      notificationType === 'BOT'
        ? new Howl({
            src: ['assets/audio/notification-buzzer.mp3'],
          })
        : new Howl({
            src: ['assets/audio/notification.mp3'],
          });
    if (isBuzz === 'true') sound.play();
  }
  //#endregion Public Methods

  destroySubscription() {
    this.subscription.unsubscribe();
  }
}
