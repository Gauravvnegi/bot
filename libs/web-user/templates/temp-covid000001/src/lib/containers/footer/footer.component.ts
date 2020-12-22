import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FooterService } from 'libs/web-user/shared/src/lib/services/footer.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { HyperlinkElementService } from 'libs/web-user/shared/src/lib/services/hyperlink-element.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {

  slides;
  // slides = [
    
  //   {
  //     id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
  //     url: 'assets/video1.png',
  //     type: 'IMAGE',
  //     title: 'Testing of Hotel Staff',
  //   },
  //   {
  //     id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
  //     url: 'assets/video2.png',
  //     type: 'IMAGE',
  //     title: 'Thermal Screening at Checkpoint',
  //   },
  //   {
  //     id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
  //     url: 'assets/video3.png',
  //     type: 'IMAGE',
  //     title: 'Daily Sanitation of Hotel',
  //   },
  //   {
  //     id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
  //     url:
  //       'https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg',
  //     type: 'IMAGE',
  //     title: 'Testing of Hotel Staff',
  //   },
  //   {
  //     id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
  //     url: 'assets/video3.png',
  //     type: 'IMAGE',
  //     title: 'Thermal Screening at Checkpoint',
  //   },
  // ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
  };
  @ViewChild("safety") hyperlinkElement: ElementRef;
  $subscription: Subscription = new Subscription();

  constructor(
    public _hyperlink: HyperlinkElementService,
    private _footerService: FooterService,
    private _hotelService: HotelService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
    ) {}

  ngOnInit(): void {
    this.listenForElementClicked();
    this.getCovidGalleries();
  }

  getCovidGalleries(){
    this.$subscription.add(
      this._footerService.getCovidGallery(this._hotelService.hotelId)
      .subscribe(response =>{
        this.slides = response;
      }, ({error})=>{
        this._translateService
          .get(`MESSAGES.ERROR.${error.type}`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
      })
    );
  }

  listenForElementClicked() {
    this.$subscription.add(
      this._hyperlink.$element.subscribe((res) => {
        if(res && res['element'] && res['element'] === 'safety') {
          this.scrollIntoView(this.hyperlinkElement.nativeElement);
        }
      })
    );
  }

  scrollIntoView($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    this._hyperlink.setSelectedElement('');
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
