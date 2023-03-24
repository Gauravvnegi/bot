import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Cols, TableFieldSearch } from '../../../types/table.type';

@Component({
  selector: '[hospitality-bot-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
  @Input() showCheckbox: boolean;
  @Input() rowSpan = 2;
  @Input() columns: Cols[];
  @Output() search = new EventEmitter<TableFieldSearch>();

  constructor() {}

  onSearch(value: string, cols: Cols) {
    this.search.emit({
      value,
      field: cols.field,
      matchMode: cols.matchMode ?? 'startsWith',
    });
  }
}
