import { Component, Input, OnInit } from '@angular/core';
import { Instructions } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { Config } from '../../types/kot-card.type';

@Component({
  selector: 'hospitality-bot-kot-card',
  templateUrl: './kot-card.component.html',
  styleUrls: ['./kot-card.component.scss'],
})
export class KotCardComponent implements OnInit {
  constructor() {}

  @Input() config: Config;

  ngOnInit(): void {}

  toggleInstruction(index: number): void {
    this.config.menuItem[index].isExpandedInstruction = !this.config.menuItem[
      index
    ].isExpandedInstruction;
  }

  markFoodIsReady() {}
}
