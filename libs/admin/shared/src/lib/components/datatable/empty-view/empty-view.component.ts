import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: '[hospitality-bot-empty-view]',
  templateUrl: './empty-view.component.html',
  styleUrls: ['./empty-view.component.scss'],
})
export class EmptyViewComponent {
  imageSrc: string;
  heading: string;
  description: string;
  actionName: string;
  @Input() noOfColumns: number;

  @Input() variant: 'default' | 'standard' = 'default';

  /**
   * Set Content of the empty view.
   */
  @Input() set content(value: Content) {
    Object.entries(value).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Output() create = new EventEmitter();

  constructor() {
    this.imageSrc = 'assets/images/empty-view.png';
    this.heading = 'Redirect visitors to the right page';
    this.description =
      'Changed a URL or want to send traffic somewhere else? Set up a 301 redirect so your visitors don’t get lost.';
    this.actionName = 'Redirect button';
  }

  /**
   * Trigger create action
   */
  onActionClick() {
    this.create.emit();
  }
}

type Content = {
  imageSrc?: string;
  heading?: string;
  description?: string;
  actionName?: string;
};
