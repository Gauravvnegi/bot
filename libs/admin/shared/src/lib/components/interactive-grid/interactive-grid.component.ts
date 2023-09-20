import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { IPosition } from 'angular2-draggable';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

// handle method
// onEmptyCellClick onDragDrop onResize menuItem

@Component({
  selector: 'hospitality-bot-interactive-grid',
  templateUrl: './interactive-grid.component.html',
  styleUrls: ['./interactive-grid.component.scss'],
})
export class InteractiveGridComponent implements OnInit {
  // all in pixels
  cellSize = 80;
  cellGap = 5;

  // gridColumns will have the same keys in the that are in the per row data
  @Input() gridColumns = this.getArray(14);
  // gridColumns = ['18Mon', '19True', '20Wed', '21Thus'];

  get noOfColumn() {
    return this.gridColumns.length;
  }

  gridSize = 50;
  @Input() gridRows: IGRowData[] = exampleRowData;

  get noOfRow() {
    return this.gridRows.length;
  }

  @Input() set gridData(input: IGValue[]) {
    const inputPerRow: Record<IDKey, IGValue[]> = input.reduce(
      (value, item, idx) => {
        value = {
          ...value,
          [item.rowValue]: [...(value[item.rowValue] ?? []), item],
        };
        return value;
      },
      {}
    );

    const colIndices = this.gridColumns.reduce((p, c, i) => {
      p = { ...p, [c]: i };
      return p;
    }, {});

    let resultData: IGData = {};

    for (let item in inputPerRow) {
      const rowValues = inputPerRow[item];
      const { startPos, endPos } = rowValues.reduce(
        (value, item) => {
          value.endPos.add(item.endPos);
          value.startPos.add(item.startPos);
          return value;
        },
        {
          startPos: new Set(),
          endPos: new Set(),
        }
      );

      let rowResult: IGData[IDKey] = {};

      rowValues.forEach((item) => {
        const dataKey = item.startPos;
        const hasPrev = endPos.has(item.startPos);
        const hasNext = startPos.has(item.endPos);
        const cellOccupied =
          colIndices[item.endPos] - colIndices[item.startPos] + 1;

        rowResult = {
          ...(rowResult ?? {}),
          [dataKey]: {
            cellOccupied,
            hasNext,
            hasPrev,
            content: item.content,
          },
        };
      });

      resultData = { ...resultData, [item]: rowResult };
    }

    this.data = resultData;
  }

  // Below present is the example data
  data: IGData = exampleData;

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

  handleDrag(
    event: IPosition,
    query: {
      rv: IDKey;
      cv: IDKey;
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

export type IDKey = string | number;

export type IGCellData = {
  cellOccupied: number;
  content: string;
  hasNext: boolean;
  hasPrev: boolean;
  endPoint?: IDKey;
};

export type IGRowData = {
  value: IDKey;
  label: string;
};

export type IGData = Record<IDKey, Record<IDKey, IGCellData>>;

export type IGValue = {
  startPos: IDKey;
  endPos: IDKey;
  content: string;
  rowValue: IDKey;
};

const exampleData: IGData = {
  101: {
    1: {
      cellOccupied: 3,
      content: 'Dhruv 101',
      hasNext: true,
      hasPrev: false,
    },
    3: {
      cellOccupied: 2,
      content: 'Akash 101',
      hasNext: false,
      hasPrev: true,
    },
    6: {
      cellOccupied: 2,
      content: 'Jag 101',
      hasNext: false,
      hasPrev: false,
    },
  },
  102: {
    6: {
      cellOccupied: 2,
      content: 'Tony Stark 102',
      hasNext: false,
      hasPrev: false,
    },
  },
  103: {
    3: {
      cellOccupied: 4,
      content: 'Steve Rogers 103',
      hasNext: false,
      hasPrev: false,
    },
  },
};

const exampleRowData: IGRowData[] = [
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
