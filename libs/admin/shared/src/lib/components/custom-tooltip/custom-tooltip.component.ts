import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'hospitality-bot-custom-tooltip',
  templateUrl: './custom-tooltip.component.html',
  styleUrls: ['./custom-tooltip.component.scss'],
})
export class CustomTooltipComponent implements OnChanges {
  @Input() text: string;
  @Input() orientation: 'Right' | 'Left' = 'Right';
  @Input() onlyContent: boolean = false;

  textMsg: String;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.textMsg = this.text;
  }
}
