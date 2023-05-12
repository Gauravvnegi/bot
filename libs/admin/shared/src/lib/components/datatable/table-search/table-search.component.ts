import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cols, TableFieldSearch } from '../../../types/table.type';

@Component({
  selector: '[hospitality-bot-table-search]',
  templateUrl: './table-search.component.html',
  styleUrls: ['./table-search.component.scss'],
})
export class TableSearchComponent {
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
