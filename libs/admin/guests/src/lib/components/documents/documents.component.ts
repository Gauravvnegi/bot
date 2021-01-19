import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationService } from '../../../../../reservation/src/lib/services/reservation.service';
import { SnackBarService } from 'libs/shared/material/src';
import * as JSZipUtils from 'jszip-utils';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';

@Component({
  selector: 'hospitality-bot-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.scss'],
})
export class DocumentsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input('data') detailsData;
  @Input() guestsFA;
  @Input() bookingId: string;

  selectedGuestId;
  countriesLOV;
  selectedGuestGroup;
  constructor(
    private _reservationService: ReservationService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getLOV();
  }

  getLOV() {
    this.getCountriesList();
  }

  getCountriesList() {
    this._reservationService.getCountryList().subscribe((countriesList) => {
      this.countriesLOV = countriesList.map((country) => {
        return {
          label: country.name,
          value: country.nationality,
          id: country.id,
          nationality: country.nationality,
        };
      });
      this.setDefaultGuestForDocument();
    });
  }

  setDefaultGuestForDocument() {
    this.selectedGuestId = this.detailsData.id;
  }

  downloadDocs(documents) {
    let urls = [];
    let fileNames = [];
    const name = `${this.detailsData.firstName}_${this.detailsData.lastName}`;
    documents.forEach((doc) => {
      urls.push(doc.frontUrl);
      fileNames.push(`${name}_${doc.documentType}_frontURL`);
      if (doc.documentType != 'VISA') {
        urls.push(doc.backUrl);
        fileNames.push(`${name}_${doc.documentType}_backURL`);
      }
    });
    const zipFile = new JSZip();
    let count = 0;
    urls.forEach((url, i) => {
      let fileName = urls[i];
      const index = fileName.lastIndexOf('/');
      fileName = fileName.slice(index + 1);
      fileName = decodeURIComponent(fileName);
      fileName = `${fileNames[i]}_${fileName}`;
      JSZipUtils.getBinaryContent(url, (err, data) => {
        if (err) {
          this._snackbarService.openSnackBarAsText(err);
          throw err;
        }
        zipFile.file(fileName, data, { binary: true });
        count++;
        if (count === urls.length) {
          zipFile.generateAsync({ type: 'blob' }).then((content) => {
            saveAs(
              content,
              `${this.detailsData.firstName}.zip`
            );
          });
        }
      });
    });
  }
}
