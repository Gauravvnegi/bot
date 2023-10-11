import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-toggle-menu',
  templateUrl: './toggle-menu.component.html',
  styleUrls: ['./toggle-menu.component.scss'],
})
export class ToggleMenuComponent {
  _menuItems = [];
  @Input() set menuItems(values: MenuItem[]) {
    this._menuItems = values;
    this.initCommand();
  }
  get menuItems() {
    return this._menuItems;
  }

  @Input() selectedItems = [];
  @Input() type: 'checkbox' | 'button' = 'checkbox';
  @Input() alignment: 'horizontal' | 'vertical' = 'vertical';
  @Output() onClickItem = new EventEmitter();
  @Input() disabled = false;

  initCommand() {
    this._menuItems = this.menuItems.map((item, index) => ({
      ...item,
      command: () => {
        this.handleClick(index, item);
      },
    }));
  }

  handleClick(event, item) {
    this.onClickItem.emit({ event, item });
  }
}
