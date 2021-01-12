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
  documentsList;
  hotelId: string;
  constructor(
    private _reservationService: ReservationService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getLOV();
  }

  getLOV() {
    this.getHotelId();
  }

  getHotelId() {
    this._reservationService.getReservationDetails(this.bookingId)
      .subscribe((response)=> {
        this.hotelId = response.hotel.id;
        this.getCountriesList();
      }, ({ error }) => {
        this._snackbarService.openSnackBarAsText(error.message);
      })
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
    this.selectedGuestId = this.detailsData.guests.primaryGuest.id;
    this.onGuestChange(this.detailsData.guests.primaryGuest.id);
  }

  onGuestChange(value) {
    this.guestsFA.controls.forEach((guest) => {
      if (guest.get('id').value === value) {
        this.selectedGuestId = value;
        this.selectedGuestGroup = guest;
        this.getDocumentsByCountry(
          guest.get('nationality').value
        );
      }
    });
  }

  getDocumentsByCountry(nationality) {
    this._reservationService
      .getDocumentsByNationality(
        this.hotelId,
        nationality
      )
      .subscribe((response) => {
        this.documentsList = response.documentList;
        // this._adminDetailsService.guestNationality = response.verifyAllDocuments;
      });
  }

  downloadDocs(documents) {
    let urls = [];
    
    documents.forEach((doc) => {
      urls.push(doc.frontUrl);
      if (doc.documentType != 'VISA') {
        urls.push(doc.backUrl);
      }
    });
    const zipFile = new JSZip();
    let count = 0;
    urls.forEach((url, i) => {
      let fileName = urls[i];
      const index = fileName.lastIndexOf('/');
      fileName = fileName.slice(index + 1);
      fileName = decodeURIComponent(fileName);
      JSZipUtils.getBinaryContent(url, (err, data) => {
        zipFile.file(fileName, data, { binary: true });
        count++;
        if (count === urls.length) {
          zipFile.generateAsync({ type: 'blob' }).then(content => {
            saveAs(content, `${this.detailsData.guests.primaryGuest.firstName}.zip`);
          });
        }
      });
    });
  }
}
