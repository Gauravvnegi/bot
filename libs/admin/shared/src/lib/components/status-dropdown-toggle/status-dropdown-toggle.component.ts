import { Component, EventEmitter, Input, Output } from '@angular/core';
import { defaultRecordJson } from '../../constants/datatable';
import { EntityStateRecord, FlagType } from '../../types/table.type';
import { convertToTitleCase } from '../../utils/valueFormatter';
import { Option } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-status-dropdown-toggle',
  templateUrl: './status-dropdown-toggle.component.html',
  styleUrls: ['./status-dropdown-toggle.component.scss'],
})
export class StatusDropdownToggleComponent {
  label = 'Active';
  value: string | boolean;
  styleClass = 'activeButton';
  items: (Status & { command: () => void })[] = [];

  booleanKeys: BooleanKeys = {
    forTrue: 'ACTIVE',
    forFalse: 'INACTIVE',
  };

  @Input() set booleanStatusKeys(input: BooleanKeys) {
    this.booleanKeys = {
      ...this.booleanKeys,
      ...(input ?? {}),
    };
  }

  records = defaultRecordJson;

  @Input() disabled: boolean = false;

  @Input() menuOptions: Option[] = [];

  @Input() set state(value: string) {
    this.value = value;
    this.setSettings();
  }

  @Input() set recordSetting(input: EntityStateRecord<string>) {
    if (!input) return;

    this.records = {
      ...this.records,
      ...input,
    };

    if (this.items.length) {
      this.nextStates = this.items.map((element) => element.value);
    }
  }

  @Input() set nextStates(input: string[]) {
    if (!input) return;
    this.items = input?.map((key) => {
      const data = {
        label: this.records[key]?.label ?? convertToTitleCase(key),
        command: () => {
          if (this.value !== key) this.onClick.emit(key);
        },
        type: this.records[key]?.type ?? 'active',
        value: key,
      };

      return data;
    });

    this.setSettings();
  }

  @Output() onClick = new EventEmitter<string | boolean>();
  @Output() onMenuItemClick = new EventEmitter<string>();

  constructor() {}

  setSettings() {
    const isBoolean = typeof this.value === 'boolean';
    if (!this.items.length && isBoolean) {
      this.nextStates = [this.booleanKeys.forTrue, this.booleanKeys.forFalse];
    }

    if (this.value !== undefined && this.items.length) {
      this.items.forEach((item) => {
        if (
          item.value == this.value ||
          (isBoolean &&
            ((item.value === this.booleanKeys.forTrue && this.value) ||
              (item.value === this.booleanKeys.forFalse && !this.value)))
        ) {
          this.label = item.label;
          this.styleClass = `${item.type}Button`;

          // handling boolean driven status
          const isActiveItem = item.value === this.booleanKeys.forTrue;
          const isInactiveItem = item.value === this.booleanKeys.forFalse;
          if (isBoolean && (isActiveItem || isInactiveItem)) {
            item.command = () => {
              if (this.value !== item.value) this.onClick.emit(isActiveItem);
            };
          }
          item['styleClass'] = 'activeClass';
        } else {
          item['styleClass'] = '';
        }
      });
    }
  }

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

  handleMenuClick(
    { item: { value } }: { item: { value: string } },
  ) {
    this.onMenuItemClick.emit(value);
  }
}

type BooleanKeys = { forTrue?: string; forFalse?: string };

type Status = {
  label: string;
  value: string;
  type: FlagType;
  disabled?: boolean;
};