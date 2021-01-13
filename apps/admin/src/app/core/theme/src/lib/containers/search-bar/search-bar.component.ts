import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { DetailsComponent } from 'libs/admin/reservation/src/lib/components/details/details.component';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { empty, Subscription } from 'rxjs';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { SearchResultDetail, SearchType } from '../../data-models/search-bar.config.model';
import { SearchService } from '../../services/search.service';
import { EditPackageComponent } from 'libs/admin/packages/src/lib/components/edit-package/edit-package.component';

@Component({
  selector: 'admin-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() name: string;

  @Output() selectedSearchOption = new EventEmitter();

  searchOptions: SearchResultDetail[];
  results: any;
  searchDropdownVisible: boolean = false;
  $subscription = new Subscription();

  constructor(
    private searchService: SearchService,
    private hotelDetailService: HotelDetailService,
    private modal: ModalService,
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
        search,this.hotelDetailService.hotelDetails.hotelAccess.chains[0].hotels[0].id
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
          if(this.results.searchResults.length > 0){
            this.searchOptions = this.results.searchResults.slice(0,3);
            this.searchDropdownVisible = true;
            this.searchValue = true;
          } else {
            this.searchOptions = [];
            this.searchDropdownVisible = false;
            this.searchValue = false;
          }
        },
        ({ error }) => {
          console.log(error.message);
        }
      );
  }

  getAllResults(){
    this.searchOptions = this.results.searchResults;
  }

  setOptionSelection(searchData) {
    this.searchDropdownVisible = false;
    this.selectedSearchOption.next(searchData);
    this.openDetails(searchData);
  }

  openDetails(searchData) {
    switch (searchData.type) {
      case SearchType.reservation: {
        this.openDetailsPage(searchData, DetailsComponent);
        break;
      }
      case SearchType.guest: {
        //statements; 
        break;
      }
      case SearchType.package: {
        this.openDetailsPage(searchData, EditPackageComponent);
        break;
      }
      default: {
        //statements; 
        break;
      }
    }
  }

  openDetailsPage(searchData, component) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modal.openDialog(
      component,
      dialogConfig
    );

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
