import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { empty } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { RequestService } from '../../services/request.service';

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
    private _requestService: RequestService,
    private _adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.listenForSearchChanges();
  }

  listenForSearchChanges(): void {
    const formChanges$ = this.parentFG.valueChanges;
    const findSearch$ = ({ search }: { search: string }) =>
      this._requestService.searchRequest(this.hotelId, {
        queryObj: this._adminUtilityService.makeQueryParams([
          ...this.globalQueries,
          {
            ...this.filterData,
            key: search,
            entityType: this.entityType,
          },
        ]),
      });
    formChanges$
      .pipe(
        debounceTime(1000),
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
          this.search.emit({ response });
        },
        ({ error }) => {
          if (error) {
            this.snackbarService.openSnackBarAsText(error.message);
          }
        }
      );
  }

  clearSearch() {
    this.clear.emit();
  }
}
