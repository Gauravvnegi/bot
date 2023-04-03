import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() menuItems = [];
  @Input() selectedItems = [];
  @Input() type: 'checkbox' | 'button' = 'checkbox';
  @Input() alignment: 'horizontal' | 'vertical' = 'vertical';
  @Output() itemSelection = new EventEmitter();
  @Output() onClickItem = new EventEmitter();

  handleItemSelection(event, item): void {
    event.stopPropagation();
    event.preventDefault();
    this.itemSelection.emit({ event, item });
  }

  handleClick(event, item) {
    this.onClickItem.emit({ event, item });
  }
}
