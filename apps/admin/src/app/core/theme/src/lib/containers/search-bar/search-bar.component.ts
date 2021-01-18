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
import { Router } from '@angular/router';

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
    private snackbarService: SnackBarService,
    private router: Router
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

  openEditPackage(id: string) {
    this.searchDropdownVisible = false;
    this.router.navigateByUrl(`/pages/package/amenity/${id}`)
  }

  clearSearch() {
    this.searchOptions = [];
    this.parentForm.reset();
    this.searchDropdownVisible = false;
  }
}
