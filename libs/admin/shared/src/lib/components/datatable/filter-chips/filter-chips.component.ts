import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { defaultFilterChipValue } from '../../../constants/datatable';
import { Chip } from '../../../types/table.type';

@Component({
  selector: 'hospitality-bot-filter-chips',
  templateUrl: './filter-chips.component.html',
  styleUrls: ['./filter-chips.component.scss'],
})
export class FilterChipsComponent implements OnInit {
  @Input() chips: Chip<string>[] = [];

  /**
   * quickReplyActionFilters is used for Data table control
   */
  @Input() controlName = 'quickReplyActionFilters';
  @Input() selectedChips = new Set<string>();

  // --chips will be removed from type (only index)
  @Output() onChange = new EventEmitter<{
    chips: Chip<string>[];
    selectedChips: Set<string>;
  }>();

  constructor(public controlContainer: ControlContainer) {}

  ngOnInit(): void {}

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number): void {
    // Refactor
    // old implementation (will be removed)
    // also removed the isSelected in template
    this.chips[0].isSelected = this.chips.reduce((value, chip, idx) => {
      if (!quickReplyTypeIdx) {
        chip.isSelected = chip.value === defaultFilterChipValue.value;
      } else if (quickReplyTypeIdx === idx) {
        chip.isSelected = !chip.isSelected;
      }
      return value && !chip.isSelected;
    }, true); // remove

    const defaultSelectedChip = new Set([defaultFilterChipValue.value]);
    const clickedChip = this.chips[quickReplyTypeIdx].value;
    
    if (clickedChip !== defaultFilterChipValue.value) {
      this.selectedChips.delete(defaultFilterChipValue.value);
      this.selectedChips.has(clickedChip)
        ? this.selectedChips.delete(clickedChip)
        : this.selectedChips.add(clickedChip);
    } else {
      this.selectedChips = defaultSelectedChip;
    }

    this.onChange.emit({
      chips: this.chips, // remove
      selectedChips: this.selectedChips.size
        ? this.selectedChips
        : defaultSelectedChip,
    });
  }
}
