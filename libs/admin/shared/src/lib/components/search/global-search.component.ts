import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form-component/form.components';
import { debounceTime } from 'rxjs/operators';
import { MemberSortTypes } from 'libs/admin/agent/src/lib/types/agent';

@Component({
  selector: 'hospitality-bot-global-search',
  templateUrl: './global-search.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/form-component/search/search.component.scss',
    './global-search.component.scss',
  ],
})
export class GlobalSearchComponent extends FormComponent {
  scattered = false;
  hasSuggestion = false;
  @Input() selectedItem: MemberSortTypes;
  @Input() suggestionList: string[];
  @Output() onSearch = new EventEmitter<string>();
  @Output() onSuggestClick = new EventEmitter<MemberSortTypes>();
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

  get isInputEmpty() {
    return (
      this.controlContainer.control.get(this.controlName).value.length == 0
    );
  }

  suggestClick(key: MemberSortTypes) {
    this.selectedItem = key;
    this.onSuggestClick.emit(key);
    setTimeout(() => {
      this.isClearShow = false;
    }, 500);
  }

  //TODO: For collapsed searchbar
  isClearShow = false;
  onBlurSearch(event: Event) {
    this.isClearShow = !this.isClearShow;
  }

  // valueChange(event, data) {
  //   data.length > 3 &&
  //     this.controlContainer.control.get(this.controlName).patchValue(data);
  // }
}
