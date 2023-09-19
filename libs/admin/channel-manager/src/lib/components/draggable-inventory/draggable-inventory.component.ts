import { Component, OnInit, ElementRef, Input } from '@angular/core';
import { restrictionsRecord } from '../../constants/data';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { IPosition } from 'angular2-draggable';

// drag-grid props
// <!-- [rzContainment]="getElementById(i)" -->
// <!-- [rzContainment]="myBounds" -->
// <!-- bound not working: need to  -->

// Below are also causing issue
// [bounds]="myBounds"
// [inBounds]="true"

// above is working now

// handle method
// onEmptyCellClick onDragDrop onResize menuItem

@Component({
  selector: 'hospitality-bot-draggable-inventory',
  templateUrl: './draggable-inventory.component.html',
  styleUrls: ['./draggable-inventory.component.scss'],
})
export class DraggableInventoryComponent implements OnInit {
  readonly restrictionsRecord = restrictionsRecord;

  // all in pixels
  cellSize = 80;
  cellGap = 5;

  @Input() columnMapper = this.getArray(14);
  // columnMapper = ['18Mon', '19True', '20Wed', '21Thus'];

  get noOfColumn() {
    return this.columnMapper.length;
  }

  gridSize = 50;
  @Input() gridRows = [
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
  ];

  get noOfRow() {
    return this.gridRows.length;
  }

  @Input() set value(input) {
    this.data = input;
  }

  data: Record<Key, Record<Key, CellData>> = {
    101: {
      1: {
        cellOccupied: 3,
        name: 'Dhruv',
        hasNext: false,
        hasPrev: false,
        endCell: 4,
      },
      6: {
        cellOccupied: 2,
        name: 'Jag',
        endCell: 8,
        hasNext: false,
        hasPrev: false,
      },
    },
    102: {
      6: {
        cellOccupied: 2,
        name: 'Tony Stark',
        endCell: 8,
        hasNext: false,
        hasPrev: false,
      },
    },
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

  handleDrag(
    event: IPosition,
    query: {
      rv: Key;
      cv: Key;
    }
  ) {
    const { rv, cv } = query;
    console.log(event, 'drag event', this.data[rv][cv]);
    this.offset = event;
  }

  getElementById(id: string): HTMLElement | null {
    return this.el.nativeElement.querySelector(`#myContainment_${id}`);
  }

  getArray(length: number) {
    return Array.from({ length }, (_, index) => index + 1);
  }
}

type Key = string | number;
type CellData = {
  cellOccupied: number;
  name: string;
  hasNext: boolean;
  hasPrev: boolean;
  endCell?: Key;
};
