import { Component, EventEmitter, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form-component/form.components';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: [
    '../../../../../../admin/request/src/lib/components/search/search.component.scss',
    './global-search.component.scss',
  ],
})
export class GlobalSearchComponent extends FormComponent {
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
    this.controlContainer.control.get(this.controlName).setValue('');
  }

  //TODO: For collapsed searchbar
  // isClearShow = false;
  // onBlurSearch(event: Event) {
  //   this.isClearShow = !this.isClearShow;
  // }

  // valueChange(event, data) {
  //   data.length > 3 &&
  //     this.controlContainer.control.get(this.controlName).patchValue(data);
  // }
}
