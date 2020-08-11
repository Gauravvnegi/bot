import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MainComponent } from '../main/main.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-temp000001',
  templateUrl: './temp000001.component.html',
  styleUrls: [
    './temp000001.component.scss',
    // '../../../../../../../../apps/web-user/src/sass/main.scss',
  ],
})
export class Temp000001Component implements OnInit, AfterViewInit {
  @Input() templateData;
  @Input() visibilityHidden = true;
  @Input() config;

  @ViewChild('mainComponent') mainComponent: MainComponent;

  constructor(
    private _reservationService: ReservationService,
    private _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig() {
    this._reservationService.reservationId = this.config['reservationId'];
    this._hotelService.currentJourney = this.config['journey'];
  }

  ngAfterViewInit() {
    this.setTemplateConfig();
  }

  private setTemplateConfig() {
    this.mainComponent.stepperData = this.templateData;
  }
}
