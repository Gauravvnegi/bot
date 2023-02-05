import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Chip, Status } from '../../types/table.type';

@Component({
  selector: 'hospitality-bot-toggle-dropdown',
  templateUrl: './toggle-dropdown.component.html',
  styleUrls: ['./toggle-dropdown.component.scss'],
})
export class ToggleDropdownComponent {
  label = 'Active';
  value = 'active';
  styleClass = 'newButton';
  items: (MenuItem & { type: string; value: string })[] = [
    {
      label: 'Active',
      command: () => {
        this.onClick.emit('active');
      },
      value: 'active',
      type: 'new',
    },
    {
      label: 'Inactive',
      command: () => {
        this.onClick.emit('inactive');
      },
      value: 'rejected',
      type: 'rejected',
    },
  ];

  @Input() set status({ label, value }: { label: string; value: string }) {
    this.label = label;
    this.value = value;
    const selectedItem = this.items?.find((item) => item.value == this.value);
    if (selectedItem) this.styleClass = `${selectedItem.type}Button`;
  }

  @Input() set listItem(input: Status[]) {
    this.items = input.map((item) => ({
      label: item.label,
      command: () => {
        this.onClick.emit(item.value);
      },
      type: item.type,
      value: item.value,
    }));

    const selectedItem = input.find((item) => item.value == this.value);
    if (selectedItem) this.styleClass = `${selectedItem.type}Button`;
  }

  @Output() onClick = new EventEmitter<string>();

  constructor() {}

  toggleState() {
    const currentIdx = this.items.findIndex(
      (item) => item.value === this.value
    );

    this.onClick.emit(
      this.items[currentIdx < this.items.length - 1 ? currentIdx + 1 : 0].value
    );
  }
}
