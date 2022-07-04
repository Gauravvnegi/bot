import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';

@Component({
  selector: 'hospitality-bot-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  showAppStatusForm = false;
  @Input() stepperIndex;
  reservationData: ReservationDetails = new ReservationDetails();
  context: any;
  @Output()
  addFGEvent = new EventEmitter();
  @Output() termsStatus = new EventEmitter();

  constructor(
    protected _stepperService: StepperService,
    protected _fb: FormBuilder,
    protected route: ActivatedRoute,
    protected router: Router,
    protected _reservationService: ReservationService
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.addFGEvent.next({ name: 'checkinSummary', value: this._fb.group({}) });
    this.reservationData = this._reservationService.reservationData;
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
  }

  emitTermsStatus(event) {
    this.termsStatus.emit(event);
  }
}
