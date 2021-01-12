import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { SearchService } from '../../services/search.service';
import { HotelDetailService } from '../../../../../../../../../../libs/admin/shared/src/lib/services/hotel-detail.service';
import { SearchResultDetail } from '../../data-models/search-bar.config.model';

@Component({
  selector: 'admin-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() name: string;

  @Output() selectedSearchOption = new EventEmitter();

  searchOptions: any;
  searchDropdownVisible: boolean = false;
  constructor(
    private searchService: SearchService,
    private hotelDetailService: HotelDetailService
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
          if (response) {
            this.searchOptions = new SearchResultDetail().deserialize(response);
            console.log(this.searchOptions);
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

  setOptionSelection(value) {
    this.searchDropdownVisible = false;
    this.selectedSearchOption.next(value);
  }

  clearSearch() {
    this.searchOptions = [];
    this.parentForm.reset();
    this.searchDropdownVisible = false;
  }
}
