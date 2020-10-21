import {
  Component,
  OnInit,
  Input,
  ViewContainerRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ParentFormService } from 'libs/web-user/shared/src/lib/services/parentForm.service';
import { FormArray, FormGroup } from '@angular/forms';
import { skipWhile, debounce } from 'rxjs/operators';
import { Subscription, timer, forkJoin, of } from 'rxjs';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { ReservationDetails } from 'libs/web-user/shared/src/lib/data-models/reservationDetails';

@Component({
  selector: 'hospitality-bot-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
  private _formValues: any;
  stepsStatus;
  @Input() reservationData: ReservationDetails;

  @Input()
  settings = [];

  @Input()
  context: any;

  @ViewChild('healthDiv', { static: false }) healthDiv: ElementRef;
  @ViewChild('content', { static: false }) content: ElementRef;

  @Input()
  parentForm: FormArray;

  currentParentContainer: ViewContainerRef;

  $subscription = new Subscription();
  isLoaderVisible = true;

  constructor(
    private _parentFormService: ParentFormService,
    private _matDialog: MatDialog,
    private _modal: ModalService,
    private _reservationService: ReservationService,
    private _paymentDetailsService: PaymentDetailsService,
    private _summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    // this.listenForParentFormValues();
    this.getStepsStatus();
  }

  listenForParentFormValues() {
    this.$subscription.add(
      this._parentFormService.parentFormValueAndValidity$
        .pipe(
          debounce(() => {
            this.isLoaderVisible = true;
            return timer(2000);
          }),
          skipWhile((data) => {
            let controlMap = {};
            let counter = 0;
            data['parentForm'].controls.forEach((fg: FormGroup) => {
              if (
                Object.keys(fg.controls).length &&
                !controlMap[Object.keys(fg.controls)[0]]
              ) {
                controlMap[Object.keys(fg.controls)[0]] = true;
                ++counter;
              }
            });

            return counter == data['parentForm'].controls.length ? false : true;
          })
        )
        .subscribe((data) => {
          this.parentForm = data['parentForm'];
          this._formValues = this.parentForm.getRawValue();
          this.isLoaderVisible = false;
        })
    );
  }

  private getStepsStatus() {
    forkJoin(
      this._summaryService.getSummaryStatus(
        this._reservationService.reservationId
      ),
      of(true)
    ).subscribe(([res, val]) => {
      this.stepsStatus = res;
      this.isLoaderVisible = false;
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  closeModal() {
    this._matDialog.closeAll();
  }

  openRegCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    
  
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '70vw';
    this._modal.openDialog(RegistrationCardComponent, dialogConfig);
  }

  printSummary() { }

  downloadSummary() { }

  get stayDetail() {
    return this.reservationData['stayDetails'];
  }

  get guestDetail() {
    return this.reservationData['guestDetails'];
  }

  get currencyCode() {
    return this._paymentDetailsService.currencyCode;
  }

  get paymentDetails() {
    return this._paymentDetailsService.paymentSummaryDetails.paymentDetail;
  }
}
