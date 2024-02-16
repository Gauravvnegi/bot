import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { defaultRecordJson } from '../../constants/datatable';
import { EntityStateRecord, FlagType } from '../../types/table.type';
import { convertToTitleCase } from '../../utils/valueFormatter';
import { Option } from '../../types/form.type';
import { SplitButton } from 'primeng/splitbutton';

@Component({
  selector: 'hospitality-bot-status-dropdown-toggle',
  templateUrl: './status-dropdown-toggle.component.html',
  styleUrls: ['./status-dropdown-toggle.component.scss'],
})
export class StatusDropdownToggleComponent implements OnInit {
  label = 'Active';
  value: string | boolean;
  styleClass = 'activeButton';
  @Input() isDisabledMenuCta = false;
  items: (Status & { command: () => void })[] = [];
  @Input() toggleMenu: boolean;

  booleanKeys: BooleanKeys = {
    forTrue: 'ACTIVE',
    forFalse: 'INACTIVE',
  };

  isBoolean = false;

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
      this.nextStates = this.items.map((element) => {
        if (typeof element.value === 'boolean') {
          return this.booleanKeys[element.value ? 'forTrue' : 'forFalse'];
        }
        return element.value;
      });
    }
  }

  @Input() set nextStates(input: string[]) {
    if (!input) return;
    this.items = input?.map((key) => {
      const value = this.isBoolean ? this.booleanKeys.forTrue === key : key;
      const data = {
        label: this.records[key]?.label ?? (key && convertToTitleCase(key)),
        command: () => {
          if (this.value !== value) this.onClick.emit(value);
        },
        type: this.records[key]?.type ?? 'active',
        value: value,
        styleClass: this.records[key]?.styleClass ?? '',
      };

      return data;
    });

    this.setSettings();
  }

  @Output() onClick = new EventEmitter<string | boolean>();
  @Output() onMenuItemClick = new EventEmitter<string>();

  @ViewChild('splitButton') splitButtonMenu: SplitButton;
  documentClickHandler: (event: Event) => void;

  constructor(private elementRef: ElementRef) {}

  setSettings() {
    this.isBoolean = typeof this.value === 'boolean';
    if (!this.items.length && this.isBoolean) {
      this.nextStates = [this.booleanKeys.forTrue, this.booleanKeys.forFalse];
    }

    if (this.value !== undefined && this.items.length) {
      this.items.forEach((item) => {
        if (
          item.value == this.value ||
          (this.isBoolean &&
            ((item.value === this.booleanKeys.forTrue && this.value) ||
              (item.value === this.booleanKeys.forFalse && !this.value)))
        ) {
          this.label = item.label;
          this.styleClass = `${item.type}Button`;

          // handling boolean driven status
          const isActiveItem = item.value === this.booleanKeys.forTrue;
          const isInactiveItem = item.value === this.booleanKeys.forFalse;
          if (this.isBoolean && (isActiveItem || isInactiveItem)) {
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

  ngOnInit(): void {
    // this.menuOptions;
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

  /**
   * Track click event while clicking status dropdown toggle button
   * @param event The click event
   * @problem When using multiple status dropdown toggle buttons, menu options may not close properly.
   */
  onOuterDivClick(event) {
    event.stopPropagation();

    //creating new MouseClick event and dispatching
    const newEvent = new MouseEvent('click');
    document.dispatchEvent(newEvent);

    this.documentClickHandler = (event: Event) => this.onDocumentClick(event);
    document.body.addEventListener('click', this.documentClickHandler);
  }

  handleMenuClick({ item: { value } }: { item: { value: string } }) {
    this.onMenuItemClick.emit(value);
  }

  /**
   *
   * @param event clicked area Event, which have HTMLElement
   * @function removeEventListener will remove the event after closing menu,
   * it will prevent to hamper the other click operation
   */
  onDocumentClick(event: Event) {
    const clickedTarget = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.splitButtonMenu.menu.hide();
      document.body.removeEventListener('click', this.documentClickHandler);
    }
  }
}

type BooleanKeys = { forTrue?: string; forFalse?: string };

type Status = {
  label: string;
  value: string | boolean;
  type: FlagType;
  styleClass?: string;
  disabled?: boolean;
};
