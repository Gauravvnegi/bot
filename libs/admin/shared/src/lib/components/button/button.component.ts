import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: 'text' | 'contained' = 'contained';
  @Input() color: string;
  @Input() label: string;
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Output() onClick = new EventEmitter();

  constructor() {}

  handleClick() {
    this.onClick.emit();
  }
}
