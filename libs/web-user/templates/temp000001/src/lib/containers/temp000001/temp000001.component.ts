import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG } from 'libs/web-user/shared/src/lib/constants/lang';
import { TemplateCode } from 'libs/web-user/shared/src/lib/constants/template';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-temp000001',
  templateUrl: './temp000001.component.html',
  styleUrls: ['./temp000001.component.scss'],
})
export class Temp000001Component implements OnInit, AfterViewInit {
  isLoaderVisible: boolean = true;
  $subscription: Subscription = new Subscription();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private templateLoadingService: TemplateLoaderService,
    private elementRef: ElementRef,
    private templateService: TemplateService,
    private reservationService: ReservationService,
    private hotelService: HotelService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.registerListeners();
  }

  initConfig(): void {
    this.initTemplateConfig();
    //this.loadStyle('taj.styles.css');
    this.initTranslationService();
  }

  initTemplateConfig(): void {
    const {
      journey,
      reservationId,
      hotelId,
    } = this.templateService.templateConfig;

    this.reservationService.reservationId = reservationId;
    this.hotelService.currentJourney = journey;
    this.hotelService.hotelId = hotelId;
  }

  initTranslationService(): void {
    this.translateService.use(DEFAULT_LANG);
  }

  registerListeners(): void {
    this.$subscription.add(
      this.templateLoadingService.isTemplateLoading$.subscribe((isLoading) => {
        if (isLoading === false) {
          this.isLoaderVisible = false;
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.initCssVariables();
  }

  private initCssVariables(): void {
    let cssText: string = '';
    // this.templateService.templateData.layout_variables = {
    //   '--stepper-background-color': 'blue',
    //   '--header-background-color': 'red',
    //   '--primary-button-background-color': 'red',
    // };
    for (let stepperLayoutVariable in this.templateService.templateData[
      TemplateCode.temp000001
    ].layout_variables) {
      cssText +=
        stepperLayoutVariable +
        ':' +
        this.templateService.templateData[TemplateCode.temp000001]
          .layout_variables[stepperLayoutVariable] +
        ';';
    }
    this.elementRef.nativeElement.ownerDocument.body.style.cssText = cssText;
  }

  loadStyle(styleName: string): void {
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

  updateTran(lan) {
    this.translateService.use(lan);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
