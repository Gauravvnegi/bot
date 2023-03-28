import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  @Input() menuItems = [];
  @Input() selectedItems = [];
  @Output() itemSelection = new EventEmitter();

  handleItemSelection(event, item): void {
    event.stopPropagation();
    event.preventDefault();
    this.itemSelection.emit({ event, item });
  }
}
