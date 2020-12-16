import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CryptoService } from 'libs/web-user/shared/src/lib/services/crypto.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss'],
})
export class TemplateRendererComponent implements OnInit, OnDestroy {
  private $subscription: Subscription = new Subscription();
  templateId: string;

  constructor(
    private route: ActivatedRoute,
    private templateService: TemplateService,
    private cryptoService: CryptoService
  ) {}

  ngOnInit(): void {
    const token: string = this.checkForToken();
    if (!!!token) {
      //Do something in future
      console.log('Not a valid token.');
      return;
    }
    this.decryptToken(token);
  }

  checkForToken(): string {
    return this.route.snapshot.queryParamMap.get('token');
  }

  decryptToken(token: string): void {
    this.$subscription.add(
      this.cryptoService.decryptToken(token).subscribe(({ token }) => {
        const {
          templateId,
          expiry,
          journey,
          reservationId,
          hotelId,
        } = this.cryptoService.extractTokenInfo(token);
        //can set a general loader
        this.getTemplateData(templateId, journey);
        this.templateService.templateConfig = {
          reservationId,
          journey,
          hotelId,
        };
      })
    );
  }

  getTemplateData(templateId: string, journey?: string): void {
    this.$subscription.add(
      this.templateService
        .getTemplateData(templateId, journey)
        .subscribe((response) => {
          this.templateId = response.template_id;
          this.templateService.templateData = response;
        })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
