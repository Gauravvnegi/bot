import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-empty-table',
  templateUrl: './empty-table.component.html',
  styleUrls: ['./empty-table.component.scss'],
})
export class EmptyTableComponent implements OnInit {
  imageSrc: string;
  description: string;
  actionName: string;
  @Input() link: string;
  @Input() isLoading: boolean;

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

  ngOnInit(): void {}

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
