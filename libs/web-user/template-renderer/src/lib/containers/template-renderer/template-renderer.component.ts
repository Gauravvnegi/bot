import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateService } from '../../../../../shared/src/lib/services/template.service';
import { CryptoService } from '../../../../../shared/src/lib/services/crypto.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss'],
})
export class TemplateRendererComponent implements OnInit {
  templateId: string;
  config;

  constructor(
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private _cryptoService: CryptoService,
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _templateService: TemplateService
  ) {}

  ngOnInit(): void {
    const token = this.checkForToken();
    this.decryptToken(token);
  }

  private checkForToken() {
    return this.route.snapshot.queryParamMap.get('token');
  }

  private decryptToken(token: string) {
    this._cryptoService.decryptToken(token).subscribe(({ token }) => {
      const {
        templateId,
        expiry,
        journey,
        reservationId,
        hotelId,
      } = this._cryptoService.extractTokenInfo(token);
      //can set a general loader
      //set values in services
      this.getTemplateData(templateId, journey);
      this.config = { reservationId, journey, hotelId };
      this._reservationService.reservationId = reservationId;
      this._hotelService.currentJourney = journey;
      this._hotelService.hotelId = hotelId;
    });
  }

  private getTemplateData(templateId, journey?) {
    this.templateService
      .getTemplateData(templateId, journey)
      .subscribe((response) => {
        this.templateId = response.template_id;
        this._templateService.templateData = response;
      });
  }
}

// Image formats like JPEG 2000, JPEG XR, and WebP often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. Learn more.
