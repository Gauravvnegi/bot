import { Component, OnInit, Input } from '@angular/core';
import { BaseWrapperComponent } from '../../base/base-wrapper.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SummaryDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/billSummaryConfig.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { InputPopupComponent } from 'libs/web-user/shared/src/lib/presentational/input-popup/input-popup.component';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-summary-wrapper',
  templateUrl: './summary-wrapper.component.html',
  styleUrls: ['./summary-wrapper.component.scss'],
  providers: [SummaryService],
})
export class SummaryWrapperComponent extends BaseWrapperComponent {
  @Input() parentForm;
  @Input() reservationData;
  @Input() stepperIndex;
  @Input() buttonConfig;

  requestForm: FormGroup;
  summaryConfig: SummaryDetailsConfigI;
  summaryDetails;

  constructor(
    public dialog: MatDialog,
    private _summaryService: SummaryService,
    private _stepperService: StepperService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super();
    this.self = this;
  }

  addFGEvent(data) {
    this.parentForm.addControl(data.name, data.value);
  }
  ngOnInit(): void {
    super.ngOnInit();
    this.setFieldConfiguration();
    this.setDialogData();
  }

  setFieldConfiguration() {
    this.summaryConfig = this._summaryService.setFieldConfigForGuestDetails();
  }

  setDialogData() {
    this.summaryDetails = {
      heading: 'Are you sure you want to Check-In ?',
      requestConfig: this.summaryConfig.request,
      controlName: 'request',
      buttonText: 'Check-In',
    };
  }

  onCheckinSubmit() {
    const dialogRef = this.dialog.open(InputPopupComponent, {
      disableClose: true,
      autoFocus: true,
      height: '300px',
      width: '400px',
      data: { pageValue: this.summaryDetails },
    });

    dialogRef.afterClosed().subscribe((result) => {
      // this.submit(result);
      if(result.hasOwnProperty('state')){
        if(result.state === 'success'){
          this.openThankyouPage('checkin');
        }
      }
    });
  }

  openThankyouPage(state){
    this.router.navigateByUrl(`/thankyou?token=${this.route.snapshot.queryParamMap.get('token')}&entity=thankyou&state=${state}`);
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
