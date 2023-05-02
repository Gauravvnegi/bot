import { Component, EventEmitter, Output } from '@angular/core';
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

  searchData(event: { originalEvent: InputEvent; query: string }) {
    this.onSearch.emit(event.query);
  }
}
