import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
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
    private _fb: FormBuilder,
    private route:ActivatedRoute,
    private router: Router,
    private _reservationService: ReservationService,
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.addFGEvent.next({ name: 'checkinSummary', value: this._fb.group({}) });
    this.reservationData = this._reservationService.reservationData;
  }

  openFeedback() {
    this.router.navigateByUrl(`/feedback?token=${this.route.snapshot.queryParamMap.get('token')}&entity=feedback`);
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
  }
}
