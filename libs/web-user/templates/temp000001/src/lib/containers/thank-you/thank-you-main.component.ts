import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { forkJoin, of } from 'rxjs';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-thank-you',
  templateUrl: './thank-you-main.component.html',
  styleUrls: ['./thank-you-main.component.scss']
})
export class ThankYouMain implements OnInit {
  journey: string;
  isReservationData = false;
  reservationData: ReservationDetails;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _templateLoadingService: TemplateLoaderService,
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
  ) { }

  ngOnInit(): void {
    this.getReservationDetails();
  }
  
  private getReservationDetails() {
    forkJoin(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([reservationData, val]) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.isReservationData = true;
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this._templateLoadingService.isTemplateLoading$.next(false);
      this.getState();
    });
  }

  getState(){
    const state = this.route.snapshot.queryParamMap.get('state')
    switch (state){
      case 'preCheckin':
        this.journey = 'Precheck-In';
        break;

      case 'checkin':
        this.journey = 'Check-In';
        break;

      case 'checkout': 
        this.journey = 'Check-Out';
        break;

      case 'feedback': 
        this.journey = 'Feedback';
        break;

      default:
        this.journey = 'Journey';
        break;

    }
  }

}
