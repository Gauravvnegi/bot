import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
})
export class ChipListComponent extends FormComponent implements OnInit {
  @Output() onRemove = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}

  handleRemove(event: { originalEvent: PointerEvent; value: string }) {
    event.originalEvent.stopPropagation();
    this.onRemove.emit(event.value);
  }
}
