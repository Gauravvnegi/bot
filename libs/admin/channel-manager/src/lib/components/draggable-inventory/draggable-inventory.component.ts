import { Component, OnInit } from '@angular/core';
import { restrictionsRecord } from '../../constants/data';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IPosition } from 'angular2-draggable';

@Component({
  selector: 'hospitality-bot-draggable-inventory',
  templateUrl: './draggable-inventory.component.html',
  styleUrls: ['./draggable-inventory.component.scss'],
})
export class DraggableInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  gridSize = 50;
  gridRows = [1, 2, 3, 4, 5];
  gridsCols = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor() {}

  ngOnInit(): void {}

  offset: IPosition = { x: 0, y: 0 };
  size: IResizeEvent['size'] = { height: 80, width: 80 };

  handleResizing(event: IResizeEvent) {
    console.log(event, 'resize event');
    this.size = event.size;
  }

  handleDrag(event: IPosition) {
    console.log(event, 'drag event');
    this.offset = event;
  }
}
