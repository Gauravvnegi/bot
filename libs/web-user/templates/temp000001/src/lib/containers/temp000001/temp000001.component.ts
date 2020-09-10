import {
  Component,
  OnInit,
  Input,
  ViewChild,
  AfterViewInit,
  Inject,
} from '@angular/core';
import { MainComponent } from '../main/main.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { DOCUMENT } from '@angular/common';

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
    private _hotelService: HotelService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    this.initConfig();
  }

  private initConfig() {
    this._reservationService.reservationId = this.config['reservationId'];
    this._hotelService.currentJourney = this.config['journey'];
    this.loadStyle('taj.styles.css');
  }

  ngAfterViewInit() {
    this.setTemplateConfig();
  }

  private setTemplateConfig() {
    this.mainComponent.stepperData = this.templateData;
  }

  loadStyle(styleName: string) {
    const head = this.document.getElementsByTagName('head')[0];
    let themeLink = this.document.getElementById(
      'client-theme'
    ) as HTMLLinkElement;
    if (themeLink) {
      themeLink.href = styleName;
    } else {
      const style = this.document.createElement('link');
      style.id = 'client-theme';
      style.rel = 'stylesheet';
      style.href = `${styleName}`;

      head.appendChild(style);
    }
  }
}
