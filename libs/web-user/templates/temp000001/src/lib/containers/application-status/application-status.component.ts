import { Component, Input, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { FileData } from 'libs/web-user/shared/src/lib/data-models/file';
import { SummaryDetails } from 'libs/web-user/shared/src/lib/data-models/summaryConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { SummaryService } from 'libs/web-user/shared/src/lib/services/summary.service';
import { TemplateService } from 'libs/web-user/shared/src/lib/services/template.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

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
    private _summaryService: SummaryService,
    private _stepperService: StepperService,
    private _templateService: TemplateService,
    private _regCardService: RegCardService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    // if (this._stepperService._selectedIndex) {
    this.getSummaryDetails();
    // }
  }

  ngOnChanges(): void {}

  registerListeners() {
    this.listenForSummaryDetails();
  }

  listenForSummaryDetails() {
    this.$subscription.add(
      this._stepperService.stepperSelectedIndex$.subscribe((index) => {
        if (this._templateService.templateData['temp000001']) {
          let data;
          this._templateService.templateData['temp000001'].stepConfigs.find(
            (item, ix) => {
              if (item.stepperName === 'Summary') {
                data = ix;
              }
            }
          );
          if (data === index) {
            this.getSummaryDetails();
          }
        }
      })
    );
  }

  getSummaryDetails() {
    this.$subscription.add(
      this._summaryService
        .getSummaryStatus(this._reservationService.reservationId)
        .subscribe((res) => {
          this.summaryDetails = new SummaryDetails().deserialize(res);
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
    if (this.summaryDetails.guestDetails.primaryGuest.regcardUrl) {
      dialogConfig.data = {
        regcardUrl: this.summaryDetails.guestDetails.primaryGuest.regcardUrl,
        signatureImageUrl:
          this.summaryDetails.guestDetails.primaryGuest.signatureUrl || '',
      };
      this._dialogRef = this._modal.openDialog(
        RegistrationCardComponent,
        dialogConfig
      );
    } else {
      this.$subscription.add(
        this._regCardService
          .getRegCard(this._reservationService.reservationId)
          .subscribe(
            (res: FileData) => {
              dialogConfig.data = {
                regcardUrl:
                  this.summaryDetails.guestDetails.primaryGuest.regcardUrl ||
                  res.file_download_url,
                signatureImageUrl:
                  this.summaryDetails.guestDetails.primaryGuest.signatureUrl ||
                  '',
              };
              this._dialogRef = this._modal.openDialog(
                RegistrationCardComponent,
                dialogConfig
              );
            },
            ({ error }) => {
              this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            }
          )
      );
    }
  }

  printSummary() {}

  downloadSummary() {}

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
