import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Cols, FlagType } from '@hospitality-bot/admin/shared';
import { EmptyContent } from 'libs/admin/shared/src/lib/components/datatable/empty-table/empty-table.component';
import { ActionDataType, TableObjectData } from '../../types/table-view.type';
import { TableObjectStyleKeys } from '../../constants/table-view.const';
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
  @Input() loading = false;
  @Input() statusConfig: Record<string, { label: string; type: FlagType }>;

  // Style Keys
  styleKeys = Object.values(TableObjectStyleKeys) as string[];

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

  @Output() actionClicked = new EventEmitter<boolean>();
  @Output() dropDownChange = new EventEmitter<TableActionType>();
  @Output() quickChange = new EventEmitter<TableActionType>();

  constructor() {}

  ngOnInit(): void {}

  isExist(item) {
    return this.columns.find((data) => data.field == item.field);
  }

  /**
   *
   * @param data table <td>{{value}}</td>
   * @returns list of the [{key:'keys',value:'value',styleClass:'',icon:''}] for every item
   */
  getKeysValues(data: string | TableObjectData) {
    if (typeof data === 'object' && data !== null) {
      let objectData = Object.entries(data)
        .filter(([key, value]) => !this.styleKeys.includes(key))
        .map(([key, value]) => ({ key: key, value: value }));

      // adding all style in every items
      this.styleKeys.forEach((styleKey) => {
        if (data[styleKey]) {
          objectData = objectData.map((item) => ({
            ...item,
            [styleKey]: data[styleKey],
          }));
        }
      });
      return objectData;
    } else {
      return [{ key: data.toString(), value: data }];
    }
  }

  /**
   *
   * @param data value of data table
   * @returns check it is style or simple text
   */
  isStyle(data: string) {
    return this.styleKeys.find((item) => item == data);
  }

  onActionClicked() {
    this.actionClicked.emit(true);
  }

  handleStatus(event, data) {
    this.dropDownChange.emit({ value: event, details: data });
  }

  handleMenuClick(event, data) {
    this.quickChange.emit({ value: event, details: data });
  }
}

export type TableActionType = {
  value: string;
  details: { id: string; [key: string]: any };
};
type EmptyViewType = { link: string; content: EmptyContent };
