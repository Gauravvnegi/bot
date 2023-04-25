import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Status } from '../../types/table.type';

@Component({
  selector: 'hospitality-bot-toggle-dropdown',
  templateUrl: './toggle-dropdown.component.html',
  styleUrls: ['./toggle-dropdown.component.scss'],
})
export class ToggleDropdownComponent {
  label = 'Active';
  value: string | boolean = true;
  styleClass = 'newButton';   
  items: (Status & { command: () => void })[] = [
    {
      label: 'Active',
      command: () => {
        if (!this.value) this.onClick.emit(true);
      },
      value: true,
      type: 'new',
    },
    {
      label: 'Inactive',
      command: () => {
        if (this.value) this.onClick.emit(false);
      },
      value: false,
      type: 'failed',
    },
  ];
  @Input() disabled: boolean = false;

  @Input() set status(value: string) {
    this.value = value; 
    this.items.forEach((item) => {
      if (item.value == this.value) {
        this.label = item.label;
        this.styleClass = `${item.type}Button`;
        item['styleClass'] = 'activeClass';
      } else {
        item['styleClass'] = '';
      }
    }); 
  }

  @Input() set listItem(input: Status[]) {
    this.items = input.map((item) => ({
      label: item.label,
      command: () => {
        if (this.value !== item.value) this.onClick.emit(item.value);
      },
      type: item.type,
      value: item.value,
      styleClass: item.value === this.value ? 'activeClass' : '',
      disabled: item.disabled,
    }));

    const selectedItem = input.find((item) => item.value == this.value);
    if (selectedItem) this.styleClass = `${selectedItem.type}Button`;
  }

  @Output() onClick = new EventEmitter<string | boolean>();

  constructor() {}

  stopEvent(event: Event) {
    event.stopPropagation();
  }

  /**
   * @function getNextIndex To skip index which are disabled
   * @param currentIdx index
   * @returns next index
   */
  getNextIndex = (currentIdx: number) => {
    const newIndex = currentIdx < this.items.length - 1 ? currentIdx + 1 : 0;
    if (this.items[newIndex].disabled) {
      return this.getNextIndex(newIndex);
    } else return newIndex;
  };

  toggleState() {
    const currentIdx = this.items.findIndex(
      (item) => item.value === this.value
    );

    // If Current state is disabled (then no toggle)
    if (this.items[currentIdx].disabled) return;
    const nextIndex = this.getNextIndex(currentIdx);

    if (currentIdx !== nextIndex) {
      this.onClick.emit(this.items[nextIndex].value);
    }
  }
}
