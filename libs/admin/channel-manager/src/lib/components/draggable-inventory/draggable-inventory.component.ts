import { Component, OnInit } from '@angular/core';
import { restrictionsRecord } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-draggable-inventory',
  templateUrl: './draggable-inventory.component.html',
  styleUrls: ['./draggable-inventory.component.scss'],
})
export class DraggableInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  gridSize = 50;
  grids = [0, 50, 100, 150, 200];

  constructor() {}

  ngOnInit(): void {}
}
