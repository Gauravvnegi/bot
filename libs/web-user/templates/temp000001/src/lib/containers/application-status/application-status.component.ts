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
import { Subscription } from 'rxjs';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import * as FileSaver from 'file-saver';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';

@Component({
  selector: 'hospitality-bot-application-status',
  templateUrl: './application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent implements OnInit {
  protected _dialogRef: MatDialogRef<any>;
  summaryDetails: SummaryDetails = new SummaryDetails();
  protected regCardComponent = RegistrationCardComponent;
  summaryFG: FormGroup;

  @Input()
  context: any;

  $subscription = new Subscription();
  isLoaderVisible = true;
  regCardLoading = false;
  modalVisible = false;

  constructor(
    protected _modal: ModalService,
    protected _reservationService: ReservationService,
    protected _paymentDetailsService: PaymentDetailsService,
    protected _summaryService: SummaryService,
    protected _stepperService: StepperService,
    protected _templateService: TemplateService,
    protected _regCardService: RegCardService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService,
    protected _hotelService: HotelService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
    this.summaryFG = new FormGroup({
      privacyPolicy: new FormGroup({
        accept: new FormControl(false, Validators.required),
      }),
    });
    // this._stepperService.stepperSelectedIndex$.next(2);
  }

  ngOnChanges(): void {}

  registerListeners() {
    this.listenForSummaryDetails();
  }

  listenForSummaryDetails() {
    this.$subscription.add(
      this._stepperService.stepperSelectedIndex$.subscribe((index) => {
        if (
          this._templateService.templateData[this._templateService.templateId]
        ) {
          let data;
          this._templateService.templateData[
            this._templateService.templateId
          ].stepConfigs.find((item, ix) => {
            if (item.stepperName === 'Summary') {
              data = ix;
            }
          });
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
          this.summaryDetails = new SummaryDetails().deserialize(
            res,
            this._hotelService.hotelConfig.timezone
          );
          if (res.guestDetails.primaryGuest.privacy !== undefined) {
            this.privacyFG.patchValue({
              accept: res.guestDetails.primaryGuest.privacy,
            });
          }
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
    if (this.summaryDetails.guestDetails.guests[0].regcardUrl) {
      dialogConfig.data = {
        regcardUrl: this.summaryDetails.guestDetails.guests[0].regcardUrl,
        signatureImageUrl:
          this.summaryDetails.guestDetails.guests[0].signatureUrl || '',
      };
      this._dialogRef = this._modal.openDialog(
        this.regCardComponent,
        dialogConfig
      );
    } else {
      this.regCardLoading = true;
      this.$subscription.add(
        this._regCardService
          .getRegCard(this._reservationService.reservationId)
          .subscribe(
            (res: FileData) => {
              this.regCardLoading = false;
              dialogConfig.data = {
                regcardUrl:
                  this.summaryDetails.guestDetails.guests[0].regcardUrl ||
                  res.file_download_url,
                signatureImageUrl:
                  this.summaryDetails.guestDetails.guests[0].signatureUrl || '',
              };
              this._dialogRef = this._modal.openDialog(
                this.regCardComponent,
                dialogConfig
              );
            },
            ({ error }) => {
              this.regCardLoading = false;
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

  printSummary() {
    this.$subscription.add(
      this._summaryService
        .summaryDownload(this._reservationService.reservationId)
        .subscribe(
          (response) => {
            var blob = new Blob([response], { type: 'application/pdf' });
            const blobUrl = URL.createObjectURL(blob);
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = blobUrl;
            document.body.appendChild(iframe);
            iframe.contentWindow.print();
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

  downloadSummary() {
    this.$subscription.add(
      this._summaryService
        .summaryDownload(this._reservationService.reservationId)
        .subscribe(
          (response) => {
            FileSaver.saveAs(
              response,
              `${this.guestDetail.guests[0].firstName}_${this.guestDetail.guests[0].lastName}` +
                '_export_summary_' +
                new Date().getTime() +
                '.pdf'
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

  setPrivacyPolicy(event) {
    if (this.privacyFG.invalid) return;
    const values = {
      privacy: this.privacyFG.getRawValue()['accept'],
    };
    console.log(this._reservationService.reservationData);
    this._summaryService
      .updatePrivacyPolicy(
        this._reservationService.reservationData.guestDetails.primaryGuest.id,
        values
      )
      .subscribe(
        (response) => console.log('Privacy policy updated'),
        ({ error }) => this._snackBarService.openSnackBarAsText(error.message)
      );
  }

  get stayDetail() {
    return this.summaryDetails.stayDetails;
  }

  get guestDetail() {
    return this.summaryDetails['guestDetails'];
  }

  get currencyCode() {
    return this._paymentDetailsService.currencyCode;
  }

  get paymentDetails() {
    return this.summaryDetails.paymentSummary;
  }

  get privacyFG(): FormGroup {
    return this.summaryFG?.get('privacyPolicy') as FormGroup;
  }
}
