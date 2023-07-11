import { Component, EventEmitter, Output } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { FormComponent } from '../form-component/form.components';
import { catchError, debounceTime } from 'rxjs/operators';
import { empty } from 'rxjs';

@Component({
  selector: 'hospitality-bot-search',
  templateUrl: './search.component.html',
  styleUrls: [
    './search.component.scss',
    '../../../../../../admin/request/src/lib/components/search/search.component.scss',
  ],
})
export class SearchComponent extends FormComponent {
  @Output() onSearch = new EventEmitter<string>();
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.listenSearch();
  }

  listenSearch() {
    this.controlContainer.control
      .get(this.controlName)
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((searchKey) => {
        this.onSearch.emit(searchKey.trim());
      });
  }

  clearSearch() {
    this.controlContainer.control.get(this.controlName).reset();
  }
}
