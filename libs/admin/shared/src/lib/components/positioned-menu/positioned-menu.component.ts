import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Option } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-positioned-menu',
  templateUrl: './positioned-menu.component.html',
  styleUrls: ['./positioned-menu.component.scss'],
})
export class PositionedMenuComponent {
  @Input() set showMenu(event: MouseEvent) {
    console.log('hello set', event);

    this.onRightClick(event);
  }
  @Input() options: Option[] = [];

  @Output() onMenuClick = new EventEmitter<Option>();

  toggleMenuPos: 'SE' | 'SW' | 'NE' | 'NW' = 'SE';
  openMenu = false;

  onRightClick(event?: MouseEvent): void {
    console.log('hello');
    if (!event) {
      return;
    }

    event.preventDefault();

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate distance from the right
    const distanceFromRight = viewportWidth - event.clientX;
    // Calculate distance from the bottom
    const distanceFromBottom = viewportHeight - event.clientY;

    // No of option to calculate the minimum menu distance and whether menu is to be opened
    const noOfOptions = this.options?.length;

    if (noOfOptions) {
      const menuHeight = 50 + noOfOptions * 41;
      if (distanceFromBottom < menuHeight) {
        if (distanceFromRight < 200) {
          this.toggleMenuPos = 'NW';
        } else {
          this.toggleMenuPos = 'NE';
        }
      } else {
        if (distanceFromRight < menuHeight) {
          this.toggleMenuPos = 'SW';
        } else {
          this.toggleMenuPos = 'SE';
        }
      }

      this.openMenu = true;
    }
  }

  /**Emit selected menu option */
  handleMenuClick(event: MouseEvent, value: Option) {
    event.stopPropagation();
    this.onMenuClick.emit(value);
    this.openMenu = false;
  }
}
