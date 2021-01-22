import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';

@Component({
  selector: 'hospitality-bot-header-summary',
  templateUrl: './header-summary.component.html',
  styleUrls: ['./header-summary.component.scss'],
})
export class HeaderSummaryComponent implements OnInit {
  showAppStatusForm: boolean = false;
  date: string;
  @Input() stepperIndex;
  context: any;

  @Output()
  isRenderedEvent = new EventEmitter<boolean>();

  constructor(
    protected _stepperService: StepperService,
    protected _date: DateService,
    public dialogRef: MatDialogRef<HeaderSummaryComponent>,
    protected router: Router,
    protected route: ActivatedRoute
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.setCurrentDate();
  }

  ngAfterViewInit() {
    this.isRenderedEvent.emit(true);
  }

  setCurrentDate() {
    this.date = DateService.currentDate().toString();
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
    this.closeModal();
  }

  closeModal() {
    this.dialogRef.close();
  }

  openFeedback() {
    this.closeModal();
    this.router.navigateByUrl(
      `/feedback?token=${this.route.snapshot.queryParamMap.get(
        'token'
      )}&entity=feedback`
    );
  }
}
