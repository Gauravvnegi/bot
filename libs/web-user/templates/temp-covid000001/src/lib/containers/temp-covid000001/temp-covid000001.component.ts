import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';

@Component({
  selector: 'hospitality-bot-temp-covid000001',
  templateUrl: './temp-covid000001.component.html',
  styleUrls: ['./temp-covid000001.component.scss'],
})
export class TempCovid000001Component implements OnInit {
  @Input() templateData;
  @Input() visibilityHidden = true;
  @Input() config;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected titleService: Title,
    private _templateService: TemplateService,
    private _hotelService: HotelService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.getHotelConfig();
  }

  private initConfig() {
    this.initTemplateConfig();
    //this.loadStyle('taj.styles.css');
    this.initTranslationService();
  }

  initTemplateConfig() {
    const { journey, entityId } = this._templateService.templateConfig;

    this._hotelService.currentJourney = journey;
    this._hotelService.entityId = entityId;
  }

  private initTranslationService() {
    this._translateService.use('en-us');
  }

  private getHotelConfig() {
    this._hotelService
      .getHotelConfigById(this._hotelService.entityId)
      .subscribe((hotel) => {
        this._hotelService.hotelConfig = hotel;
        this.titleService.setTitle(hotel.name);
        let favicon = this.document.querySelector('#favicon');
        favicon['href'] = hotel['favIcon']
          ? hotel['favIcon'].trim()
          : 'favicon.ico';
      });
  }

  updateTran(lan) {
    this._translateService.use(lan);
  }
}
