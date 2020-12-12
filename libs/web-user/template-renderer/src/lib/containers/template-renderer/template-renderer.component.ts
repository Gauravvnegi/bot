import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { CryptoService } from '../../../../../shared/src/lib/services/crypto.service';
import { TemplateService } from '../../../../../shared/src/lib/services/template.service';

interface IConfigData {
  reservationId: string;
  journey: string;
  hotelId: string;
}
@Component({
  selector: 'hospitality-bot-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss'],
})
export class TemplateRendererComponent implements OnInit {
  templateId: string;
  config: IConfigData;

  constructor(
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private cryptoService: CryptoService,
    private reservationService: ReservationService,
    private hotelService: HotelService
  ) {}

  ngOnInit(): void {
    const token: string = this.checkForToken();
    this.decryptToken(token);
  }

  private checkForToken(): string {
    return this.route.snapshot.queryParamMap.get('token');
  }

  private decryptToken(token: string): void {
    this.cryptoService.decryptToken(token).subscribe(({ token }) => {
      const {
        templateId,
        expiry,
        journey,
        reservationId,
        hotelId,
      } = this.cryptoService.extractTokenInfo(token);
      //can set a general loader
      //set values in services
      this.getTemplateData(templateId, journey);
      this.config = { reservationId, journey, hotelId };
      this.reservationService.reservationId = reservationId;
      this.hotelService.currentJourney = journey;
      this.hotelService.hotelId = hotelId;
    });
  }

  private getTemplateData(templateId: string, journey?: string): void {
    this.templateService
      .getTemplateData(templateId, journey)
      .subscribe((response) => {
        this.templateId = response.template_id;
        this.templateService.templateData = response;
      });
  }
}
