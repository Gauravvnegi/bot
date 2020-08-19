import { Component, OnInit } from '@angular/core';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';

@Component({
  selector: 'hospitality-bot-paid-service',
  templateUrl: './paid-service.component.html',
  styleUrls: ['./paid-service.component.scss']
})
export class PaidServiceComponent implements OnInit {
 
  slides;

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
  };

  constructor(
    private _paidService: PaidService
  ) { }

  ngOnInit(): void {
    this.slides = this.hotelComplimentaryAmenities;
  }

  get hotelComplimentaryAmenities(){
    return this._paidService.paidAmenities && 
    this._paidService.paidAmenities.paidService;
  }

}
