import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { empty } from 'rxjs';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'admin-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() name: string;

  @Output() selectedSearchOption = new EventEmitter();

  searchOptions = [];
  searchDropdownVisible: boolean = false;
  constructor(
    private searchService: SearchService,
  ) { }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForSearchChanges();
  }

  listenForSearchChanges(): void {
    const formChanges$ = this.parentForm.valueChanges;

    const findSearch$ = ({ search }) =>
      this.searchService.search({
        search,
      });

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
      .subscribe((response) => {
        if (response.length) {
          this.searchOptions = response;
          this.searchDropdownVisible = true;
        } else {
          this.searchOptions = [];
          this.searchDropdownVisible = false;
        }
      }, ({ error }) => {
        console.log(error.message);
      });
  }

  setOptionSelection(value) {
    this.searchDropdownVisible = false;
    this.selectedSearchOption.next(value);
  }
}
