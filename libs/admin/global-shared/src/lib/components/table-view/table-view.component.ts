import { Component, Input, OnInit } from '@angular/core';
import { Cols } from '@hospitality-bot/admin/shared';
import { EmptyContent } from 'libs/admin/shared/src/lib/components/datatable/empty-table/empty-table.component';
@Component({
  selector: 'hospitality-bot-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss'],
})
export class TableViewComponent implements OnInit {
  @Input() header: string;
  @Input() columns: Cols[];
  @Input() items;
  @Input() headerSticky = false;
  loading = false;

  // EmptyView config
  link: string;
  content: EmptyContent = {
    description: 'No Data Found',
    imageSrc: 'assets/images/empty-table-offer.png',
    actionName: '',
  };
  @Input() set emptyViewConfig(values: EmptyViewType) {
    Object.entries(values).forEach(([key, value]) => {
      if (key == 'content') {
        Object.entries(value).forEach(([contentKey, contentValue]) => {
          this.content[contentKey] = contentValue;
        });
      } else {
        this[key] = value;
      }
    });
  }

  constructor() {}

  ngOnInit(): void {}

  isExist(item) {
    return this.columns.find((data) => data.field == item.field);
  }

  getKeysValues(data) {
    if (typeof data === 'object' && data !== null) {
      return Object.entries(data).map(([key, value]) => ({ key, value }));
    } else {
      return [{ key: data.toString(), value: data }];
    }
  }
}

type EmptyViewType = { link: string; content: EmptyContent };
