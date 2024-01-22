import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-chips',
  templateUrl: './chips.component.html',
  styleUrls: ['./chips.component.scss'],
})
export class ChipsComponent implements OnInit {
  @Input() chips: Option[];
  @Input() activeIndex = 0;
  @Output() changeChips = new EventEmitter<Option>();

  constructor() {}

  ngOnInit(): void {}

  clicked(item: Option, index: number) {
    if (index !== this.activeIndex) {
      this.activeIndex = index;
      this.changeChips.emit(item);
    }
  }
}
