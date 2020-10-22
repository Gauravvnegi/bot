import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  mapper,
  FUNCTION_NAMES,
} from 'libs/web-user/shared/src/lib/utils/mapper';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { forkJoin, of } from 'rxjs';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';

@Component({
  selector: 'hospitality-bot-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  showAppStatusForm: boolean = false;
  @Input() stepperIndex;
  reservationData: ReservationDetails = new ReservationDetails();
  context: any;
  @Output()
  addFGEvent = new EventEmitter();

  constructor(
    private _stepperService: StepperService,
    private _modal: ModalService,
    private _fb: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _paymentDetailsService: PaymentDetailsService,
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.addFGEvent.next({ name: 'checkinSummary', value: this._fb.group({}) });
    this.getReservationDetails();
  }

  private initPaymentDS() {
    const journey = this._hotelService.getCurrentJourneyConfig();
    this._paymentDetailsService
      .getPaymentConfiguration(this.reservationData.hotel.id, journey.name)
      .subscribe((response) => {
        this._paymentDetailsService.initPaymentDetailDS(
          this.reservationData,
          response
        );
      });
  }

  private getReservationDetails() {
    forkJoin(
      this._reservationService.getReservationDetails(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([reservationData, val]) => {
      this._hotelService.hotelConfig = reservationData['hotel'];
      this.reservationData = reservationData;
      this._reservationService.reservationData = reservationData;
      this.initPaymentDS();
    });
  }
  ngAfterViewInit() {}

  openFeedback() {
    this.router.navigateByUrl(`/feedback?token=${this.route.snapshot.queryParamMap.get('token')}&entity=feedback`);
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
  }

  openRegCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '70vw';
    this._modal.openDialog(RegistrationCardComponent, dialogConfig);
  }
}
