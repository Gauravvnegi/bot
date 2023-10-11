import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
  @Input() action: string;
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

  @Output() actionClicked = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  isExist(item) {
    return this.columns.find((data) => data.field == item.field);
  }

  getKeysValues(data) {
    if (typeof data === 'object' && data !== null) {
      let objectData = Object.entries(data)
        .filter(([key, value]) => !['icon', 'styleClass'].includes(key))
        .map(([key, value]) => ({ key: key, value: value }));
      if (data?.icon) {
        objectData = objectData.map((item) => ({ ...item, icon: data.icon }));
      }

      if (data?.styleClass) {
        objectData = objectData.map((item) => ({
          ...item,
          styleClass: data.styleClass,
        }));
      }

      console.log(objectData);
      return objectData;
    } else {
      return [{ key: data.toString(), value: data }];
    }
  }

  onActionClicked() {
    this.actionClicked.emit(true);
  }
}

type EmptyViewType = { link: string; content: EmptyContent };
