import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { MatDialogRef } from '@angular/material/dialog';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { forkJoin, of } from 'rxjs';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';

@Component({
  selector: 'hospitality-bot-header-summary',
  templateUrl: './header-summary.component.html',
  styleUrls: ['./header-summary.component.scss'],
})
export class HeaderSummaryComponent implements OnInit {
  showAppStatusForm: boolean = false;
  reservationData: ReservationDetails = new ReservationDetails();
  date: string;
  @Input() stepperIndex;
  context: any;

  @Output()
  isRenderedEvent = new EventEmitter<boolean>();

  constructor(
    private _stepperService: StepperService,
    private _date: DateService,
    public dialogRef: MatDialogRef<HeaderSummaryComponent>,
    private _reservationService: ReservationService,
    private _hotelService: HotelService,
    private _paymentDetailsService: PaymentDetailsService,
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.setCurrentDate();
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

  ngAfterViewInit() {
    this.isRenderedEvent.emit(true);
  }

  setCurrentDate() {
    this.date = this._date.currentDate().toString();
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }
}
