import { Component, OnInit, ElementRef } from '@angular/core';
import { restrictionsRecord } from '../../constants/data';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IPosition } from 'angular2-draggable';

// <!-- [rzContainment]="getElementById(i)" -->
// <!-- [rzContainment]="myBounds" -->
// <!-- bound not working: need to  -->

@Component({
  selector: 'hospitality-bot-draggable-inventory',
  templateUrl: './draggable-inventory.component.html',
  styleUrls: ['./draggable-inventory.component.scss'],
})
export class DraggableInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  // all in pixels
  cellSize = 80;
  cellGap = 10;

  columnMapper = this.getArray(12);
  // columnMapper = ['18Mon', '19True', '20Wed', '21Thus'];

  get noOfColumn() {
    return this.columnMapper.length;
  }

  gridSize = 50;
  gridRows = [
    {
      label: '101',
      value: 101,
    },
    {
      label: '102',
      value: 102,
    },
    {
      label: '103',
      value: 103,
    },
    {
      label: '104',
      value: 104,
    },
    {
      label: '105',
      value: 105,
    },
  ];

  data = {
    101: {
      '18Mon': {
        cellOccupied: 3,
        label: 'Dhruv',
      },
      '21Thus': {
        cellOccupied: 2,
        label: 'Jag',
      },
    },
    103: {},
  };

  constructor(private el: ElementRef) {}

  ngOnInit(): void {}

  offset: IPosition = { x: 0, y: 0 };

  position: IResizeEvent['position'] = { top: 0, left: 0 };
  size: IResizeEvent['size'] = { height: 80, width: 80 };

  handleResizing(event: IResizeEvent) {
    console.log(event, 'resize event');
    this.size = event.size;
    this.position = event.position;
  }

  // [rzContainment]="getElementById(i)"
  // [id]="'myContainment_' + i"

  handleDrag(event: IPosition) {
    console.log(event, 'drag event');
    this.offset = event;
  }

  getElementById(id: string): HTMLElement | null {
    return this.el.nativeElement.querySelector(`#myContainment_${id}`);
  }

  getArray(length: number) {
    return Array.from({ length }, (_, index) => index);
  }
}
