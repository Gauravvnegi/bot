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
   *Cell Size is grid height and width including the gap
   */
  @Input() cellSize: number = 80;

  /**
   * Cell gap will decide the spaces between the grid blocks
   */
  @Input() cellGap: number = 5;

  /**
   * Grid Data setter
   */
  @Input() set gridData(data: {
    rows: IGKey[];
    columns: IGKey[];
    values: IGValue[];
  }) {
    console.log(data, 'data');
    this.gridColumns = data.columns;
    this.gridRows = data.rows;
    this.colIndices = this.gridColumns.reduce((p, c, i) => {
      p = { ...p, [c]: i };
      return p;
    }, {});

    this.data = this.getModdedData(data.values);
  }

  /**
   * Data to map the interactive grid cell
   */
  data: IGData = {};

  colIndices: Record<IGKey, number> = {};

  /**
   * Array of gird column value and also decide the no of column based on the length
   * @example ['18Mon', '19Tue', '20Wed', '21Thus'] or [1, 2, 3, 4]
   */
  gridColumns: IGKey[] = [];

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
  gridRows: IGKey[] = [];

  /**
   * Return no of rows
   */
  get noOfRow() {
    return this.gridRows.length;
  }

  @Output() onChange = new EventEmitter<IGOnChangeEvent>();

  console: any = {};
  offset: IPosition = { x: 0, y: 0 };
  position: IResizeEvent['position'] = { top: 0, left: 0 };
  size: IResizeEvent['size'] = { height: 80, width: 80 };

  getCurrentDataInfo(
    query: IGQueryEvent
  ): {
    data: IGCellData;
    id: string;
  } {
    const { rowValue, colValue } = query;
    const data = this.data[rowValue][colValue];

    return {
      data,
      id: data.id,
    };
  }

  /**
   * Handle resize change and emit onChange
   */
  handleResizing(event: IResizeEvent, query: IGQueryEvent) {
    const { data, id } = this.getCurrentDataInfo(query);

    console.log('---resized----', id);

    const width = event.size.width;
    const left = event.position.left;
    const isLeft = !event.direction.e;

    const currentPos = this.getPosition(query);
    const currentWidth = this.getWidth(query);

    console.log('event: ', {
      width,
      left,
      isLeft,
      currentPos,
      currentWidth,
    });

    console.log('----------');

    this.size = event.size;
    this.position = event.position;

    this.onChange.emit({
      id: id,
      rowValue: query.rowValue,
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
    const { data, id } = this.getCurrentDataInfo(query);

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

  getWidth({ rowValue, colValue }: IGQueryEvent): number {
    const width =
      this.cellSize * this.data[rowValue][colValue]?.cellOccupied -
      (this.data[rowValue][colValue]?.hasNext ? this.cellSize / 2 : 0) -
      (this.data[rowValue][colValue]?.hasPrev ? this.cellSize / 2 : 0);

    return width;
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
          this.colIndices[item.endPos] - this.colIndices[item.startPos] + 1;

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
