import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import appConstants from './constants';
import { MessageService } from 'primeng/api';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {
  MessageSnackbarConfig,
  ToastKeys,
} from 'libs/shared/material/src/lib/types/snackbar.type';
import { ProgressSpinnerService } from './core/theme/src/lib/services/progress-spinner.service';
import { DialogService } from 'primeng/dynamicdialog';
import { FirebaseMessagingService } from './core/theme/src/lib/services/messaging.service';
import { ModalConfig, openModal } from '@hospitality-bot/admin/shared';
import { NotificationPopupComponent } from './core/theme/src/lib/containers/notification-popup/notification-popup.component';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SnackBarService, MessageService, DialogService],
})
export class AppComponent implements OnInit {
  readonly toastKeys = ToastKeys;

  snackbarConfig: MessageSnackbarConfig;
  title = '';

  constructor(
    private _translateService: TranslateService,
    public messageService: MessageService,
    public snackbarService: SnackBarService,
    public progressSpinner: ProgressSpinnerService,
    private dialogService: DialogService,
    private firebaseMessagingService: FirebaseMessagingService
  ) {}

  ngOnInit() {
    this.configTranslator();
    this.listenProgress();
    this.listenSnackbar();
    this.listenFirebase();
  }

  /**
   * @function configTranslator Initialize translate configuration.
   */
  configTranslator(): void {
    this._translateService.addLangs(appConstants.locales);
    this._translateService.setDefaultLang(appConstants.defaultLocale);
    this._translateService.use(appConstants.defaultLocale);
  }

  /**
   * @function listenSnackbar every message changes listener
   */
  listenSnackbar() {
    this.messageService.messageObserver.subscribe(
      (res: MessageSnackbarConfig) => {
        this.snackbarConfig = res;
      }
    );
  }

  /**
   * @function listenProgress listening interceptor
   * progress service
   */
  listenProgress() {
    this.progressSpinner.$snackbarChange.subscribe(
      (res: MessageSnackbarConfig) => {
        this.messageService.clear();
        this.messageService.add({ ...res });
      }
    );
  }

  /**
   * @function  listenFirebase notification
   * on/off from the firebaseMessagingService dialog
   */
  listenFirebase() {
    this.firebaseMessagingService.$newNotification.subscribe(
      (res: ModalConfig) => {
        if (res) {
          const dialogRef = openModal({
            config: { ...res },
            component: NotificationPopupComponent,
            dialogService: this.dialogService,
          });
        }
      }
    );
  }
}
