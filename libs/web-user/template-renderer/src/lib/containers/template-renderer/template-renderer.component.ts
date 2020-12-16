import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TemplateCode } from 'libs/web-user/shared/src/lib/constants/template';
import { CryptoService } from 'libs/web-user/shared/src/lib/services/crypto.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { TemplateCodes } from 'libs/web-user/shared/src/lib/types/template';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss'],
})
export class TemplateRendererComponent implements OnInit, OnDestroy {
  private $subscription: Subscription = new Subscription();
  templateId: TemplateCodes;

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
        //can set a general loader here
        //call to fetch template data for the given templateId
        this.getTemplateData(templateId as TemplateCodes, journey);
        this.templateService.templateConfig = {
          reservationId,
          journey,
          hotelId,
        };
      })
    );
  }

  getTemplateData(templateId: TemplateCodes, journey?: string): void {
    this.$subscription.add(
      this.templateService
        .getTemplateData(templateId, journey)
        .subscribe((response) => {
          this.templateId = response.template_id;
          this.templateService.setTemplateData(
            TemplateCode[this.templateId],
            response
          );
        })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
