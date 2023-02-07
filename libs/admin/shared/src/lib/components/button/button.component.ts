import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

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
  @Input() link: string = null;
  @Output() onClick = new EventEmitter();

  constructor(private router: Router) {}

  handleClick() {
    this.onClick.emit();
    if (this.link) this.router.navigate([this.link]);
  }
}
