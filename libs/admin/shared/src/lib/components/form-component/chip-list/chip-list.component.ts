import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  Input,
  AfterViewInit,
} from '@angular/core';
import { FormComponent } from '../form.components';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-chip-list',
  templateUrl: './chip-list.component.html',
  styleUrls: ['./chip-list.component.scss'],
})
export class ChipListComponent extends FormComponent
  implements OnInit, AfterViewInit {
  @Output() onRemove = new EventEmitter();
  @Input() id: string;
  @Input() maxLength: number;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
  }

  handleRemove(event: { originalEvent: PointerEvent; value: string }) {
    event.originalEvent.stopPropagation();
    this.onRemove.emit(event.value);
  }
  ngAfterViewInit(): void {
    const inputElement = document.getElementById(this.id);
    inputElement &&
      inputElement?.setAttribute('maxlength', this.maxLength?.toString());
  }
}
