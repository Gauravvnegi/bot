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
    this.heading = 'No Data';
    this.description = 'No list found!. Add new entries';
    this.actionName = '+ Create New';
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
