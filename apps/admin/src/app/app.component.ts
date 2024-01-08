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

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [SnackBarService, MessageService],
})
export class AppComponent implements OnInit {
  readonly toastKeys = ToastKeys;

  snackbarConfig: MessageSnackbarConfig;
  title = '';

  constructor(
    private _translateService: TranslateService,
    public messageService: MessageService,
    public snackbarService: SnackBarService,
    public progressSpinner: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.configTranslator();
    this.listenProgress();
    this.listenSnackbar();
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

  listenProgress() {
    this.progressSpinner.$snackbarChange.subscribe(
      (res: MessageSnackbarConfig) => {
        this.messageService.add({ ...res });
      }
    );
  }
}
