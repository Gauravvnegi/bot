import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { Template } from 'libs/web-user/shared/src/lib/types/template';

@Component({
  selector: 'hospitality-bot-tabbed-sidebar',
  templateUrl: './tabbed-sidebar.component.html',
  styleUrls: ['./tabbed-sidebar.component.scss'],
})
export class TabbedSidebarComponent implements OnInit {
  @Output() onCloseSidebar: any = new EventEmitter<string>();
  @Output() selectedTabFilterChange: any = new EventEmitter<string>();
  @Input() loading: boolean = false;
  @Input() header: string = '';
  @Input() tabFilterItems: TabbedSidebarTabFilterItem[] = [];
  @Input() tabFilterIdx: number = 0;
  @Input() options: any[] = [];
  @Input() template: TemplateRef<any>;
  type = 'pre';
  constructor() {}

  ngOnInit(): void {
    this.selectedTabFilterChange.emit(0);
    this.emptyMessage = this.tabFilterItems[this.tabFilterIdx]?.emptyMessage;
  }

  ngOnChanges(): void {}

  emptyMessage: {
    title: string;
    description: string;
    img: string;
  };

  setEmptyMessage(index) {
    this.emptyMessage = this.tabFilterItems[index].emptyMessage;
  }
}

export type TabbedSidebarTabFilterItem = {
  label: string;
  value: string;
  emptyMessage: {
    title: string;
    description: string;
    img: string;
  };
};
