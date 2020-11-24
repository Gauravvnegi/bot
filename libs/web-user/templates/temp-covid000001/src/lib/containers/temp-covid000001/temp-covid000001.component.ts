import { Component, Input, OnInit } from '@angular/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-temp-covid000001',
  templateUrl: './temp-covid000001.component.html',
  styleUrls: ['./temp-covid000001.component.scss'],
})
export class TempCovid000001Component implements OnInit {
  @Input() templateData;
  @Input() visibilityHidden = true;
  @Input() config;

  constructor(private _hotelService: HotelService,
    private _translateService: TranslateService) {}

  ngOnInit(): void {
    this.getHotelConfig();
    this.initConfig();
  }

  private initConfig() {
    //this.loadStyle('taj.styles.css');
    this.initTranslationService();
  }

  private initTranslationService() {
    this._translateService.use('en-us');
  }

  private getHotelConfig() {
    this._hotelService
      .getHotelConfigById(this._hotelService.hotelId)
      .subscribe((hotel) => {
        this._hotelService.hotelConfig = hotel;
      });
  }

  updateTran(lan) {
    this._translateService.use(lan);
  }
}
