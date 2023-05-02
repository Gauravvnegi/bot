import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonVariant } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'contained';
  @Input() severity: 'reset' | 'secondary' | 'primary' = 'primary';
  @Input() label: string;
  @Input() target: '_blank' | '_self' = '_blank';
  @Input() type: string = 'button';
  @Input() disabled: boolean = false;
  @Input() link: string = null;
  @Input() href: string = null;
  @Output() onClick = new EventEmitter<Event>();
  @Input() showLoader: boolean = false;
  @Input() icon: string;

  constructor(private router: Router) {}

  handleClick(event) {
    this.onClick.emit(event);
    if (this.href) window.open(this.href, this.target);
    if (this.link) this.router.navigate([this.link]);
  }
}
