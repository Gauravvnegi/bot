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
  isLoaderVisible: boolean = true;
  defaultBgColor = 'assets/bg.webp';

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
    this.getReservationDetails();
  }

  getReservationDetails(): void {
    //dev.botshot.in/?token=cg1jak6Id623uiUNGb1UOnRgMUTycRJO0kxLT2ceycybrpFaG6hcVNDnzgWxMY3zI5Vog_Ln5puJFItGajebaImQdO2yQF0N6aKjHBQ_AFC6cIAIVLF3UzAnr9-kU3k6aASl32qp0DhLF22IC-DlhA==
    this.$subscription.add(
      this.reservationService
        .getReservationDetails(this.reservationService.reservationId)
        .subscribe(
          (reservationData) => {
            this.titleService.setTitle(
              reservationData['hotel']
                ? reservationData['hotel'].name
                : 'Web-user'
            );
            let favicon = this.document.querySelector('#favicon');
            favicon['href'] = reservationData['hotel']['favIcon']
              ? reservationData['hotel']['favIcon'].trim()
              : 'favicon.ico';
          },
          ({ error }) => {
            if (error.type == 'BOOKING_CANCELED') {
              this.getHotelDataById();
            }
          }
        )
    );
  }

  getHotelDataById() {
    this.hotelService.getHotelConfigById(this.hotelService.hotelId).subscribe(
      (hotel) => {
        this.titleService.setTitle(hotel.name);
        let favicon = this.document.querySelector('#favicon');
        favicon['href'] = hotel['favIcon']
          ? hotel['favIcon'].trim()
          : 'favicon.ico';
      },
      ({ error }) => {}
    );
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

  get templateId() {
    return this.templateService.templateConfig.templateId;
  }
}
