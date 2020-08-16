import { Component, Input, OnInit } from '@angular/core';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-temp-covid000001',
  templateUrl: './temp-covid000001.component.html',
  styleUrls: ['./temp-covid000001.component.scss'],
})
export class TempCovid000001Component implements OnInit {
  @Input() templateData;
  @Input() visibilityHidden = true;
  @Input() config;

  constructor(private _hotelService: HotelService) {}

  ngOnInit(): void {
    this._hotelService.hotelId = this.config['hotelId'];
    this.getHotelConfig();
  }

  private getHotelConfig() {
    this._hotelService
      .getHotelConfigById(this._hotelService.hotelId)
      .subscribe((hotel) => {
        this._hotelService.hotelConfig = hotel;
      });
  }
}
