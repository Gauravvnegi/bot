import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { Chip } from '../../../types/table.type';

@Component({
  selector: 'hospitality-bot-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
})
export class FilterChipsComponent implements OnInit {
  @Input() chips: Chip<string>[] = [
    {
      label: 'All',
      value: 'total',
      total: 0,
      isSelected: true,
      type: 'default',
    },
    {
      label: 'Active',
      value: 'active',
      total: 0,
      isSelected: false,
      type: 'new',
    },
    {
      label: 'In-Active ',
      value: 'inactive',
      total: 0,
      isSelected: false,
      type: 'failed',
    },
  ];

  /**
   * quickReplyActionFilters is used for Data table control
   */
  @Input() controlName = 'quickReplyActionFilters';
  @Output() onChange = new EventEmitter<{ chips: Chip<string>[] }>();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number): void {
    this.chips[0].isSelected = this.chips.reduce((value, chip, idx) => {
      if (!quickReplyTypeIdx) {
        chip.isSelected = chip.value === 'All';
      } else if (quickReplyTypeIdx === idx) {
        chip.isSelected = !chip.isSelected;
      }
      return value && !chip.isSelected;
    }, true);

    this.onChange.emit({ chips: this.chips });
  }
}
