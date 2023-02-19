import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-empty-view',
  templateUrl: './empty-view.component.html',
  styleUrls: ['./empty-view.component.scss'],
})
export class EmptyViewComponent {
  imageSrc: string;
  heading: string;
  description: string;
  actionName: string;

  /**
   * Set Content of the empty view.
   */
  @Input() set content(value: Content) {
    Object.entries(value).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Output() create = new EventEmitter();

  constructor() {}

  /**
   * Trigger create action
   */
  onActionClick() {
    this.create.emit();
  }
}

type Content = {
  imageSrc: string;
  heading: string;
  description: string;
  actionName: string;
};
