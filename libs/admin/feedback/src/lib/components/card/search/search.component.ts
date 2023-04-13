import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { empty, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() globalQueries;
  @Input() feedbackType: string;
  @Input() filterData;
  @Output() clear = new EventEmitter();
  @Output() search = new EventEmitter();
  searchValue = false;
  constructor(
    private snackbarService: SnackBarService,
    private cardService: CardService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForSearchChanges();
  }

  listenForSearchChanges(): void {
    const formChanges$ = this.parentFG.get('search')?.valueChanges;
    const findSearch$ = ({ search }: { search: string }) =>
      this.cardService.searchFeedbacks({
        queryObj: this._adminUtilityService.makeQueryParams([
          ...this.globalQueries,
          { key: search, feedbackType: this.feedbackType, ...this.filterData },
        ]),
      });
    formChanges$
      .pipe(
        debounceTime(1000),
        switchMap((formValue) => {
          if (formValue.trim().length)
            return findSearch$({ search: formValue }).pipe(
              catchError((err) => empty())
            );
          else return of(null);
        })
      )
      .subscribe(
        (response) => {
          this.search.emit({
            status: this.parentFG.get('search').value.trim().length,
            response,
          });
        });
  }

  clearSearch() {
    this.clear.emit();
  }
}
