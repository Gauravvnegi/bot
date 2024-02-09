import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Event } from '@angular/router';

@Component({
  selector: 'hospitality-bot-empty-table',
  templateUrl: './empty-table.component.html',
  styleUrls: ['./empty-table.component.scss'],
})
export class EmptyTableComponent implements OnInit {
  imageSrc: string;
  description: string;
  actionName: string;
  isError = false;
  @Input() disabledAction: boolean;
  @Input() link: string;
  @Input() href: string;
  @Input() isLoading: boolean;
  @Output() action = new EventEmitter();
  @Input() height: string;

  /**
   * Set Content of the empty view.
   */
  @Input() set content(value: EmptyContent) {
    Object.entries(value).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Output() create = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {
    console.log(this.disabledAction, 'action');
  }

  /**
   * Trigger create action
   */
  onActionClick() {
    this.create.emit();
  }
}

export type EmptyContent = {
  imageSrc?: string;
  heading?: string;
  description?: string;
  actionName?: string;
  isError?: boolean;
};
