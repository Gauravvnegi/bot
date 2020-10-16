import { Component, Input } from '@angular/core';

import * as JSZipUtils from 'jszip-utils';
import { DomSanitizer } from '@angular/platform-browser';
import { RegCardService } from 'libs/web-user/shared/src/lib/services/reg-card.service';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { Subscription } from 'rxjs';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { MatDialogRef } from '@angular/material/dialog';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';

@Component({
  selector: 'hospitality-bot-registration-card',
  templateUrl: './registration-card.component.html',
  styleUrls: ['./registration-card.component.scss'],
})
export class RegistrationCardComponent {
  regCardSrc;
  regCard = {
    fileName: '',
    URL: '',
  };
  private _settings;
  private _subscription: Subscription = new Subscription();
  private _defaultValue = {
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
  };

  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }

  constructor(
    private _sanitizer: DomSanitizer,
    private _regCardService: RegCardService,
    private _reservation: ReservationService,
    private _docService: DocumentDetailsService,
    private _snackbar: SnackBarService,
    public dialogRef: MatDialogRef<RegistrationCardComponent>,
    private _utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.setRegCardSRC();
  }

  setRegCardSRC() {
    //TO-DO: Uncomment once data gets corrected at back-end (API giving bad request as the data from PMS isn't correct)
    this._subscription.add(
      this._regCardService.getRegCard(this._reservation.reservationId).subscribe((res) => {
        this.regCard.URL = res.file_download_url;
      }, (err) => {
        throw(err);
      })
    );
    if (this.regCard.URL === '') {
      this.regCard.URL =
        'https://nyc3.digitaloceanspaces.com/craterzone-backup/MINDLABZ-37238/regcard/MINDLABZ-37238_regcard.pdf';
    }
    const url = this.regCard.URL;
    this.regCard.fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        throw err;
      }
      const blob = new Blob([data], { type: 'application/octet-stream' });
      this.regCardSrc = this._sanitizer.bypassSecurityTrustResourceUrl(
        window.URL.createObjectURL(blob)
      );
    });
  }

  signatureUploadFile(event) {
    const formData = new FormData();
    formData.append('doc_type', 'signature');
    formData.append('doc_page', 'front');
    formData.append('file', event.file);
    this._docService
      .uploadDocumentFile(
        this._reservation.reservationData.id,
        this._reservation.reservationData.guestDetails.primaryGuest.id,
        formData
      )
      .subscribe((res) => {
        this._utilityService.$signatureUploaded.next(true);
      }, (err) => {
        this._snackbar.openSnackBarAsText(err.message);
        this._utilityService.$signatureUploaded.next(false);
      });
  }

  onClose() {
    this.dialogRef.close();
  }

  onDestroy() {
    this._subscription.unsubscribe();
  }
}
