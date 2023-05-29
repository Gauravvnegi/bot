import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { DEFAULT_LANG } from 'libs/web-user/shared/src/lib/constants/lang';
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
  isLoaderVisible = true;
  hotelImageUrl: string;
  mobileImage: string;
  webImage: string;
  tabletImage: string;

  constructor(
    @Inject(DOCUMENT) protected document: Document,
    protected templateLoadingService: TemplateLoaderService,
    protected elementRef: ElementRef,
    protected templateService: TemplateService,
    protected reservationService: ReservationService,
    protected hotelService: HotelService,
    protected titleService: Title,
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
    // this.setWebUserTitle();
  }

  listenForTitleConfig() {
    this.hotelService.titleConfig$.subscribe((response) => {
      if (response) {
        this.titleService.setTitle(response.name);
        let favicon = this.document.querySelector('#favicon');
        favicon['href'] = response['favIcon']?.trim() ?? 'favicon.ico';
        this.hotelImageUrl = this.hotelService.hotelConfig.imageUrl;
      }
    });
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
    this.listenForTitleConfig();
  }

  ngAfterViewInit(): void {
    this.initCssVariables();
  }

  protected initCssVariables(): void {
    let cssText = '';
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

  get templateId() {
    return this.templateService.templateConfig.templateId;
  }
}
