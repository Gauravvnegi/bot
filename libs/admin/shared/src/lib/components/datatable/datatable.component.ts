import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TableService } from '../../services/table.service';
import { Chip, Cols } from '../../types/table.type';
import { BaseDatatableComponent } from './base-datatable.component';
import { filters, columns, TableValue, rowValues } from './constant/datatable';
interface Import {
  name: string;
  code: string;
}

enum Status {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Component({
  selector: 'hospitality-bot-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent extends BaseDatatableComponent
  implements OnInit {
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  tableName: string;
  cols: Cols[] = columns.users;
  tabFilterItems = filters;
  tabFilterIdx: number = 0;
  selectedTable: TableValue;
  filterChips: Chip<string>[] = filters[0].chips;
  dataSource = [];

  isActionButtons = true;
  isQuickFilters = true;

  emptyViewContent = {
    imageSrc: 'assets/images/empty-view.png',
    heading: 'Redirect visitors to the right page',
    description:
      'Changed a URL or want to send traffic somewhere else?  Set up a 301 redirect so your visitors don’t get lost.',
    actionName: '+ Create New Redirect',
  };

  additionalActionItems = [
    {
      icon: 'assets/svg/Download.svg',
      value: 'DOWNLOAD',
    },
    {
      icon: 'assets/svg/google-docs.svg',
      value: 'DOCS',
    },
    {
      icon: 'assets/svg/card.svg',
      value: 'CARDS',
    },
  ];

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   *
   */
  toggleQuickReplyFilter({ chips }: { chips: Chip<string>[] }): void {
    this.tabFilterItems[this.tabFilterIdx].chips = chips;
    this.changePage(0);
  }

  addEntry() {
    this.values = rowValues.users;
  }

  handleStatus = (status, name: string): void => {
    this.values.find((item) => item.name === name).action = {
      label: Status[status],
      value: status,
    };
  };
}
