import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ReservationService } from '../../../../../reservation/src/lib/services/reservation.service';

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

  downloadDocs() {

  }
}
