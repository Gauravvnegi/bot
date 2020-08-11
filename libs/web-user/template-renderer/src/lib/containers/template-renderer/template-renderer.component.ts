import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../../../../shared/src/lib/services/template.service';
import { CryptoService } from '../../../../../shared/src/lib/services/crypto.service';

@Component({
  selector: 'hospitality-bot-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss'],
})
export class TemplateRendererComponent implements OnInit {
  templateId: string;
  templateLoaderId: string;
  templateData;
  config;

  constructor(
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private _cryptoService: CryptoService
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

      this.templateLoaderId = templateId;
      this.getTemplateData(templateId, journey);
      this.config = { reservationId, journey, hotelId };
    });
  }

  private getTemplateData(templateId, journey?) {
    this.templateService
      .getTemplateData(templateId, journey)
      .subscribe((response) => {
        this.templateData = response;
        this.templateId = response.template_id;
      });
  }
}

// Image formats like JPEG 2000, JPEG XR, and WebP often provide better compression than PNG or JPEG, which means faster downloads and less data consumption. Learn more.
