import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import appConstants from './constants';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private _translateService: TranslateService) {}

  ngOnInit() {
    this.configTranslator();
  }

  /**
   * @function configTranslator Initialize translate configuration.
   */
  configTranslator(): void {
    this._translateService.addLangs(appConstants.locales);
    this._translateService.setDefaultLang(appConstants.defaultLocale);
    this._translateService.use(appConstants.defaultLocale);
  }
}
