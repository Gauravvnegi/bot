import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import * as JSZipUtils from 'jszip-utils';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-registration-card',
  templateUrl: './registration-card.component.html',
  styleUrls: ['./registration-card.component.scss'],
})
export class RegistrationCardComponent implements OnInit, OnDestroy {
  regCard = {
    fileName: '',
    src: '',
  };
  protected _settings;
  protected $subscription: Subscription = new Subscription();
  protected _defaultValue = {
    label: 'Verify ',
    linkLabel: 'Registration Card',
    styles: {
      link: 'modal--link',
      regCardContainer: 'reg-card-container',
      signatureContainer: 'signature-container',
    },
    modal: {
      title: 'Registration Card',
      pdf: {
        companyLogo: '',
        icon: 'cloud_download',
      },
      style: {
        container: 'container',
        header: 'modal-header',
        title: 'modal-title',
        body: 'modal-body',
        footer: 'modal-footer',
        pdfHeader: 'pdf-header',
      },
    },
    signatureUploadAPI: '',
    regcardUrl: '',
    signatureImageUrl: '',
  };

  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }

  constructor(
    protected _sanitizer: DomSanitizer,
    protected _reservation: ReservationService,
    protected _docService: DocumentDetailsService,
    public dialogRef: MatDialogRef<RegistrationCardComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    protected _utilityService: UtilityService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService
  ) {
    this.settings = data;
  }

  ngOnInit() {
    this.setRegCardSRC();
  }

  setRegCardSRC() {
    const url = this.settings.regcardUrl;
    this.regCard.fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        throw err;
      }
      const blob = new Blob([data], { type: 'application/octet-stream' });
      this.regCard.src = this._sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      ) as string;
    });
  }

  signatureUploadFile(event) {
    const formData = new FormData();
    formData.append('doc_type', 'signature');
    formData.append('doc_page', 'front');
    formData.append('file', event.file);
    this.$subscription.add(
      this._docService
        .uploadDocumentFile(
          this._reservation.reservationData.id,
          this._reservation.reservationData.guestDetails.primaryGuest.id,
          formData
        )
        .subscribe(
          (res) => {
            this._utilityService.$signatureUploaded.next(true);
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._utilityService.$signatureUploaded.next(false);
          }
        )
    );
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
