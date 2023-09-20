import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPosition } from 'angular2-draggable';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

// handle method
// onEmptyCellClick onDragDrop onResize menuItem

@Component({
  selector: 'hospitality-bot-interactive-grid',
  templateUrl: './interactive-grid.component.html',
  styleUrls: ['./interactive-grid.component.scss'],
})
export class InteractiveGridComponent {
  /**
   * Data to map the interactive grid cell
   */
  data: IGData = exampleData;

  /**
   *Cell Size is grid height and width including the gap
   */
  @Input() cellSize: number = 80;

  /**
   * Cell gap will decide the spaces between the grid blocks
   */
  @Input() cellGap: number = 5;

  /**
   * Array of gird column value and also decide the no of column based on the length
   * @example ['18Mon', '19Tue', '20Wed', '21Thus'] or [1, 2, 3, 4]
   */
  @Input() gridColumns = this.getArray(14);

  /**
   * Return no of columns
   */
  get noOfColumn() {
    return this.gridColumns.length;
  }

  /**
   * Array of grid rows value and also decide the no of row based on the length
   * @example ['LU101', 'LU102', 'LU103', 'LU104', 'LU105'] or [101, 102, 103, 104]
   */
  @Input() gridRows: IGKey[] = exampleRowData;

  /**
   * Return no of rows
   */
  get noOfRow() {
    return this.gridRows.length;
  }

  /**
   * Array of data to be shown
   */
  @Input() set gridData(input: IGValue[]) {
    this.data = this.getModdedData(input);
  }

  @Output() onChange = new EventEmitter<IGOnChangeEvent>();

  console: any = {};
  offset: IPosition = { x: 0, y: 0 };
  position: IResizeEvent['position'] = { top: 0, left: 0 };
  size: IResizeEvent['size'] = { height: 80, width: 80 };

  handleResizing(event: IResizeEvent, query: IGQueryEvent) {
    const { rowValue, colValue } = query;
    const data = this.data[rowValue][colValue];
    const id = data.id;

    console.log('---resized----', id);

    console.log('event: ', {
      pos: event.position,
      size: event.size,
      direction: event.direction,
    });
    console.log('data: ', data);
    console.log('----------');

    this.size = event.size;
    this.position = event.position;

    this.onChange.emit({
      id: id,
      rowValue: rowValue,
      endPos: 1,
      startPos: 1,
    });

    this.console = {
      pos: event.position,
      size: event.size,
      direction: event.direction,
      query,
    };
  }

  handleDrag(event: IPosition, query: IGQueryEvent) {
    const { rowValue, colValue } = query;
    const data = this.data[rowValue][colValue];
    const id = data.id;

    console.log('---dragged----', id);
    console.log('current position: ', this.getPosition(query));
    console.log('event: ', event);
    console.log('data: ', data);
    console.log('----------');

    this.offset = event;

    this.console = {
      event,
      query,
    };
  }

  getPosition({ rowIdx, colIdx, rowValue, colValue }: IGQueryEvent): IPosition {
    return {
      x:
        colIdx * this.cellSize +
        (this.data[rowValue][colValue]?.hasPrev ? this.cellSize / 2 : 0),
      y: rowIdx * this.cellSize,
    };
  }

  /**
   * To get the desired formatted data
   */
  getModdedData(input: IGValue[]): IGData {
    const inputPerRow: Record<IGKey, IGValue[]> = input.reduce(
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

      let rowResult: IGData[IGKey] = {};

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
            id: item.id,
          },
        };
      });

      resultData = { ...resultData, [item]: rowResult };
    }

    return resultData;
  }

  getArray(length: number) {
    return Array.from({ length }, (_, index) => index + 1);
  }
}

export type IGKey = string | number;

export type IGCellData = Pick<IGValue, 'id' | 'content'> & {
  cellOccupied: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type IGOnChangeEvent = Omit<IGValue, 'content'>;

export type IGData = Record<IGKey, Record<IGKey, IGCellData>>;

export type IGValue = {
  id: string;
  content: string;
  startPos: IGKey;
  endPos: IGKey;
  rowValue: IGKey;
};

export type IGQueryEvent = {
  rowIdx: number;
  colIdx: number;
  rowValue: IGKey;
  colValue: IGKey;
};

const exampleData: IGData = {
  101: {
    1: {
      id: 'RES001',
      cellOccupied: 3,
      content: 'Dhruv 101',
      hasNext: true,
      hasPrev: false,
    },
    3: {
      id: 'RES002',
      cellOccupied: 2,
      content: 'Akash 101',
      hasNext: false,
      hasPrev: true,
    },
    6: {
      id: 'RES003',
      cellOccupied: 2,
      content: 'Jag 101',
      hasNext: false,
      hasPrev: false,
    },
  },
  102: {
    6: {
      id: 'RES004',
      cellOccupied: 2,
      content: 'Tony Stark 102',
      hasNext: false,
      hasPrev: false,
    },
  },
  103: {
    3: {
      id: 'RES005',
      cellOccupied: 4,
      content: 'Steve Rogers 103',
      hasNext: false,
      hasPrev: false,
    },
  },
};

const exampleRowData: IGKey[] = [101, 102, 103];
