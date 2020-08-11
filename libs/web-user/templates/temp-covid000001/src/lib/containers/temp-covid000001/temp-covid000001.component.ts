import { Component, OnInit, Input } from '@angular/core';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
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

  hotelConfig;

  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this._hotelService.covidHotelId = this.config['hotelId'];
    this._hotelService
      .getHotelConfigById(this._hotelService.covidHotelId)
      .subscribe((hotel) => {
        this._hotelService.hotelConfig = hotel;
        this.hotelConfig = hotel;
      });
  }
}
