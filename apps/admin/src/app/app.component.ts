import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private readonly translate: TranslateService) {}

  ngOnInit() {
    this.configTranslator();
  }

  configTranslator() {
    this.translate.addLangs(['en-us', 'fr']);
    this.translate.setDefaultLang('en-us');
    this.translate.use('en-us');
  }
}
