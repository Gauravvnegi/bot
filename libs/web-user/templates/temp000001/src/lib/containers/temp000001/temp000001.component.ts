import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
export class Temp000001Component implements OnInit, AfterViewInit, OnDestroy {
  protected $subscription: Subscription = new Subscription();
  templateId = TemplateCode.temp000001;
  isLoaderVisible: boolean = true;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected templateLoadingService: TemplateLoaderService,
    protected elementRef: ElementRef,
    protected templateService: TemplateService,
    protected reservationService: ReservationService,
    protected hotelService: HotelService,
    protected translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.initConfig();
    this.registerListeners();
  }

  protected initConfig(): void {
    this.initTemplateConfig();
    //this.loadStyle('taj.styles.css');
    this.initTranslationService();
  }

  protected initTemplateConfig(): void {
    const {
      journey,
      reservationId,
      hotelId,
    } = this.templateService.templateConfig;

    this.reservationService.reservationId = reservationId;
    this.hotelService.currentJourney = journey;
    this.hotelService.hotelId = hotelId;
  }

  protected initTranslationService(): void {
    this.translateService.use(DEFAULT_LANG);
  }

  protected registerListeners(): void {
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

  protected initCssVariables(): void {
    let cssText: string = '';
    // this.templateService.templateData.layout_variables = {
    //   '--stepper-background-color': 'blue',
    //   '--header-background-color': 'red',
    //   '--primary-button-background-color': 'red',
    // };
    for (let stepperLayoutVariable in this.templateService.templateData[
      this.templateId
    ].layout_variables) {
      cssText +=
        stepperLayoutVariable +
        ':' +
        this.templateService.templateData[this.templateId].layout_variables[
          stepperLayoutVariable
        ] +
        ';';
    }
    this.elementRef.nativeElement.ownerDocument.body.style.cssText = cssText;
  }

  protected loadStyle(styleName: string): void {
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

  protected updateTran(lan): void {
    this.translateService.use(lan);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
