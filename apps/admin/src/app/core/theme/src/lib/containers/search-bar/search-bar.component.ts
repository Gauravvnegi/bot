import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent as GuestDetailComponent } from 'libs/admin/guests/src/lib/components/details/details.component';
import { DetailsComponent as BookingDetailComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { empty, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { SnackBarService } from '../../../../../../../../../../libs/shared/material/src/lib/services/snackbar.service';
import { SearchResultDetail } from '../../data-models/search-bar-config.model';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'admin-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() name: string;

  // @Output() selectedSearchOption = new EventEmitter();

  componentInstances = {
    RESERVATIONS: BookingDetailComponent,
    GUEST: GuestDetailComponent,
  };

  searchOptions: SearchResultDetail[];
  results: any;
  searchDropdownVisible: boolean = false;
  $subscription = new Subscription();

  constructor(
    private searchService: SearchService,
    private hotelDetailService: HotelDetailService,
    private modal: ModalService,
    private snackbarService: SnackBarService
  ) {}

  searchValue = false;

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForSearchChanges();
  }

  listenForSearchChanges(): void {
    const formChanges$ = this.parentForm.valueChanges;
    console.log('');
    const findSearch$ = ({ search }) =>
      this.searchService.search(
        search,
        this.hotelDetailService.hotelDetails.hotelAccess.chains[0].hotels[0].id
      );
    formChanges$
      .pipe(
        debounceTime(500),
        switchMap((formValue) =>
          findSearch$(formValue).pipe(
            catchError((err) => {
              return empty();
            })
          )
        )
      )
      .subscribe(
        (response) => {
          response = {
            reservations: [
              {
                id: '9d0adcc7-9f1a-42f7-9dd4-bf6936cc84ca',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12151',
                stateCompletedSteps: 2,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: '9d0adcc7-9f1a-42f7-9dd4-bf6936cc84ca',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12151',
                stateCompletedSteps: 2,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: '9d0adcc7-9f1a-42f7-9dd4-bf6936cc84ca',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12151',
                stateCompletedSteps: 2,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: '9d0adcc7-9f1a-42f7-9dd4-bf6936cc84ca',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12151',
                stateCompletedSteps: 2,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: '8cf8793a-21da-4d0a-862b-357cb7ea8607',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12153',
                stateCompletedSteps: 0,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: '09335387-1fd6-484d-a5b5-91a7c823d2d0',
                arrivalTime: 1609854305000,
                departureTime: 1603756800000,
                number: '12154',
                stateCompletedSteps: 1,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: 'de96599c-b5d4-42e5-ab36-45ac11dbaa80',
                arrivalTime: 1603584000000,
                departureTime: 1603756800000,
                number: '12155',
                stateCompletedSteps: 0,
                primaryGuestName: 'SANDEEP RAI',
                searchType: 'RESERVATIONS',
              },
              {
                id: 'd48fbf7e-0288-494f-9e77-8fa3a7a26d97',
                arrivalTime: 1609221600000,
                departureTime: 1603756800000,
                number: '12152',
                stateCompletedSteps: 5,
                primaryGuestName: 'vijay RAI',
                searchType: 'RESERVATIONS',
              },
            ],
            packages: [
              {
                id: 'a6ea885b-9c89-409b-964e-5001c6f14859',
                name: 'Breakfast test1245',
                description: 'Breakfast test',
                rate: 0.0,
                startDate: 1576627200000,
                endDate: 1892332800000,
                active: true,
                currency: 'INR',
                packageCode: 'BF12345',
                imageUrl:
                  'https://nyc3.digitaloceanspaces.com/craterzone-backup/bot/hotel/5ef958ce-39a7-421c-80e8-ee9973e27b8d/static-content/packages//MAP.png',
                searchType: 'PACKAGES',
              },
            ],
          };
          this.results = new SearchResultDetail().deserialize(response);

          this.searchOptions = [];
          this.searchDropdownVisible = true;
          this.searchValue = true;
          if (
            this.results.searchResults &&
            this.results.searchResults.length > 0
          ) {
            this.searchOptions = this.results.searchResults.slice(0, 5);
          } else if (response && response.reservations !== undefined) {
            this.searchDropdownVisible = false;
            this.searchValue = false;
          }
        },
        ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        }
      );
  }

  getAllResults() {
    this.searchOptions = this.results.searchResults;
  }

  setOptionSelection(searchData) {
    this.searchDropdownVisible = false;
    // this.selectedSearchOption.next(searchData);
    this.openDetailsPage(searchData, this.componentInstances[searchData.type]);
  }

  openDetailsPage(searchData, component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modal.openDialog(component, dialogConfig);

    detailCompRef.componentInstance.bookingId = searchData.id;

    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        // TODO statements
        detailCompRef.close();
      })
    );
  }

  clearSearch() {
    this.searchOptions = [];
    this.parentForm.reset();
    this.searchDropdownVisible = false;
  }
}
