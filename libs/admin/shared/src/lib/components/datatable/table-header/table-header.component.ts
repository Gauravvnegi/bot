import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Cols, TableFieldSearch } from '../../../types/table.type';

@Component({
  selector: '[hospitality-bot-table-header]',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
})
export class TableHeaderComponent {
  @Input() showCheckbox: boolean;
  @Input() showSearch: boolean;
  @Input() rowSpan = 2;
  @Input() columns: Cols[];
  @Input() isSearchActive = true;
  @Output() search = new EventEmitter<TableFieldSearch>();

  constructor() {}

  onSearch(value: string, cols: Cols) {
    this.search.emit({
      value,
      field: cols.searchField ?? cols.field,
      matchMode: cols.matchMode ?? 'contains',
    });
  }
}

/**
 * Match Modes
 * "startsWith" | "contains" | "endsWith" | "equals"
 */