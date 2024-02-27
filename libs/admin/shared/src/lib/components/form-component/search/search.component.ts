import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { EMPTY, of } from 'rxjs';
import { debounceTime, switchMap, catchError } from 'rxjs/operators';
import { ApiService } from '@hospitality-bot/shared/utils';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent extends FormComponent implements OnInit {
  @Input() searchApi: string;
  @Output() clear = new EventEmitter();
  @Output() search = new EventEmitter();

  @Input() searchKeyLabel = '&key';
  searchValue = false;
  @Input() textLimit = 3;
  constructor(
    private apiService: ApiService,
    public controlContainer: ControlContainer
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.listenForSearchChanges();
  }

  /**
   * @function listenForSearchChanges To listen for search field value change.
   */
  listenForSearchChanges(): void {
    const formChanges$ = this.inputControl.valueChanges;
    const findSearch$ = ({ search }: { search: string }) => {
      const searchKey = `${this.searchKeyLabel}=${search.trim()}`;
      return this.apiService.get(`${this.searchApi}${searchKey}`);
    };
    formChanges$
      .pipe(
        debounceTime(1000),
        switchMap((formValue) => {
          if (formValue?.trim().length >= this.textLimit)
            return findSearch$({ search: formValue }).pipe(
              catchError((err) => EMPTY)
            );
          else return of(null);
        })
      )
      .subscribe((response) =>
        this.search.emit({
          status: this.inputControl.value.trim().length >= this.textLimit,
          response,
        })
      );
  }

  /**
   * @function clearSearch To clear search field value.
   */
  clearSearch(): void {
    this.clear.emit();
  }
}
