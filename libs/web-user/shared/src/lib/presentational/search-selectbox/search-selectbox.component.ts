import { Component, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseComponent } from '../base.component';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'web-user-search-selectbox',
  templateUrl: './search-selectbox.component.html',
  styleUrls: ['./search-selectbox.component.scss'],
})
export class SearchSelectboxComponent extends BaseComponent {
  private _onOpenedChange = new Subject();
  onOpenedChange = this._onOpenedChange.asObservable();
  @Output()
  optionChange = new EventEmitter();
  filteredOptions;

  ngOnInit() {
    this._setupFieldStyles();
    this.disableElement();
    this._setupMediaQueries();
    if (this.settings && this.name && this.parentForm) {
      this.attachValidators();
    }
    this.addValidators();
    this.listenForSearchChanges();
  }

  change(event) {
    const selectData = {
      index: this.index,
      selectEvent: { value: event.option.value },
      formControlName: this.name,
      formGroup: this.parentForm,
    };
    this.optionChange.emit(selectData);
  }

  ngOnChanges(): void {
    if (
      this.parentForm.get(this.name).value.trim().length &&
      this.settings.options
    ) {
      const list = this.settings.options.filter(
        (option) => option.key === this.parentForm.get(this.name).value
      );
      if (list.length)
        this.parentForm.patchValue({
          [this.name]: list[0].value,
        });
    }
  }

  openedChange(event) {
    this._onOpenedChange.next(event);
  }

  trackByFn(index, item) {
    return index;
  }

  listenForSearchChanges() {
    this.filteredOptions = this.parentForm.get(this.name)!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(value))
    );
  }

  private _filter(value: string) {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.settings.options?.filter((option) =>
      option.value.toLowerCase().includes(filterValue)
    );
  }
}
