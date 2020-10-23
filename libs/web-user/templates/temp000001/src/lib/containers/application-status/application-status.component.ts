import {
  Component,
  OnInit,
  Input,
} from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { SummaryDetails } from 'libs/web-user/shared/src/lib/data-models/summaryConfig.model';

@Component({
  selector: 'hospitality-bot-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
  private _dialogRef: MatDialogRef<any>;
  summaryDetails: SummaryDetails = new SummaryDetails();

  @Input()
  context: any;

  $subscription = new Subscription();
  isLoaderVisible = true;

  constructor(
    private _modal: ModalService,
    private _reservationService: ReservationService,
    private _paymentDetailsService: PaymentDetailsService,
    private _summaryService: SummaryService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    this.getStepsStatus();
  }

  registerListeners() {
    this.listenForSummaryDetails();
  }

  listenForSummaryDetails() {
    this._summaryService.$summaryDetailRefreshed
      .subscribe(res => {
        if (res) {
          this.summaryDetails = this._summaryService.SummaryDetails;
          this._summaryService.$summaryDetailRefreshed.next(false);
        }
      })
  }

  getStepsStatus() {
    this.$subscription.add(
        this._summaryService.getSummaryStatus(
          this._reservationService.reservationId
      ).subscribe((res) => {
        this._summaryService.initSummaryDS(res);
        this._summaryService.$summaryDetailRefreshed.next(true);
        this.isLoaderVisible = false;
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  closeModal() {
    if (this._dialogRef) {
      this._dialogRef.close();
    }
  }

  openRegCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '70vw';
    dialogConfig.data = {
      regcardUrl: this.summaryDetails.guestDetails.primaryGuest.regcardUrl || '',
      signatureImageUrl: this.summaryDetails.guestDetails.primaryGuest.signatureUrl || ''
    };
    this._dialogRef = this._modal.openDialog(RegistrationCardComponent, dialogConfig);
  }

  printSummary() { }

  downloadSummary() { }

  get stayDetail() {
    return this.summaryDetails.stayDetails;
  }

  get guestDetail() {
    return this.summaryDetails['guestDetails'];
  }

  get contactDetails() {
    return this.summaryDetails.guestDetails.primaryGuest.contactDetails;
  }

  get currencyCode() {
    return this._paymentDetailsService.currencyCode;
  }

  get paymentDetails() {
    return this.summaryDetails.paymentSummary;
  }
}
