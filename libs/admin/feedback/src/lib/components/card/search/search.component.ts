import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { empty, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() hotelId: string;
  @Input() globalQueries;
  @Input() filterData;
  @Input() entityType: string;
  @Output() clear = new EventEmitter();
  @Output() search = new EventEmitter();
  searchValue = false;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.listenForSearchChanges();
  }

  listenForSearchChanges(): void {
    const formChanges$ = this.parentFG.valueChanges;
    const findSearch$ = ({ search }: { search: string }) => of([]);
    formChanges$
      .pipe(
        debounceTime(1000),
        switchMap((formValue) => {
          if (formValue.search.trim().length)
            return findSearch$(formValue).pipe(catchError((err) => empty()));
          else return of(null);
        })
      )
      .subscribe(
        (response) =>
          this.search.emit({
            status: this.parentFG.get('search').value.trim().length,
            response,
          }),
        ({ error }) => this.snackbarService.openSnackBarAsText(error.message)
      );
  }

  clearSearch() {
    this.clear.emit();
  }
}
