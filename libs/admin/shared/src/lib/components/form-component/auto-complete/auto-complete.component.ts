import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-auto-complete',
  templateUrl: './auto-complete.component.html',
  styleUrls: ['./auto-complete.component.scss'],
})
export class AutoCompleteComponent extends FormComponent {
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  multiple = true;
  freeSolo = false;
  showEmptyMessage = true;

  /**
   * @Input to change default date setting
   */
  @Input() set settings(value: AutoCompleteSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  searchData(event: { originalEvent: InputEvent; query: string }) {
    this.onSearch.emit(event.query);
  }
}

type AutoCompleteSettings = {
  multiple: boolean;
  freeSolo: boolean;
  showEmptyMessage: boolean;
};
