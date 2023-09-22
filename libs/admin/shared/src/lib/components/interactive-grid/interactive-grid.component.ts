import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPosition } from 'angular2-draggable';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';

/**
 * @class InteractiveGridComponent
 * @todo data reinitialize handle function (reset functionality)
 * @todo empty cell event
 * @todo Progress spinner (onChange event in progress loading)
 * @todo Tool tip on content
 * @todo Handle edge (drag event on click is an issue)
 */
@Component({
  selector: 'hospitality-bot-interactive-grid',
  templateUrl: './interactive-grid.component.html',
  styleUrls: ['./interactive-grid.component.scss'],
})
export class InteractiveGridComponent {
  /**
   * Set true to see the column data in last cell
   * Only for development purpose
   */
  @Input() devMode = false;

  @Input() calc = (value) => {};

  /**
   * To show the spinner
   */
  @Input() isProcessing = false;

  /**
   *Cell Size is grid height and width including the gap
   */
  @Input() cellSize: number = 80;

  /**
   * Cell gap will decide the spaces between the grid blocks
   */
  @Input() cellGap: number = 5;

  /**
   * Props to show extra information
   * @todo Need to handle label for col and row to show information
   */
  @Input() props: {
    createNewToolTipInfo?: string;
    rowName?: string;
    colName?: string;
  } = {
    createNewToolTipInfo: 'Create New Entry',
  };

  /**
   * Grid Data setter to set he grid rows and column data with the available value
   * @example
   * const gridData = {
   *    rows: [101, 102, 103 ,104, 105],
   *    column: ['18Mon', '19Tue', '20Wed', '21Thus'],
   *    values: [
   *      {
   *        id: 'RES001',
   *        content: 'Guest 001',
   *        startPos: '01Mon',
   *        endPos: '03Wed',
   *        rowValue: 101,
   *      },
   *      {
   *        id: 'RES002',
   *        content: 'Guest 002',
   *        startPos: '03Wed',
   *        endPos: '04Thu',
   *        rowValue: 102,
   *      },
   *    ]
   *  }
   */
  @Input() set gridData(data: {
    rows: IGKey[];
    columns: IGKey[];
    values: IGValue[];
  }) {
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
   * @example
   * const data = {
   *   101: {
   *     1: {
   *       id: 'RES001',
   *       cellOccupied: 3,
   *       content: 'Guest 1',
   *       hasNext: true,
   *       hasPrev: false,
   *     },
   *     3: {
   *       id: 'RES002',
   *       cellOccupied: 2,
   *       content: 'Guest 2',
   *       hasNext: false,
   *       hasPrev: true,
   *     },
   *   },
   *   103: {
   *     3: {
   *       id: 'RES005',
   *       cellOccupied: 4,
   *       content: 'Guest 3',
   *       hasNext: false,
   *       hasPrev: false,
   *     },
   *   },
   * };
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

  /**
   * When gird info cell is moved or resized
   */
  @Output() onChange = new EventEmitter<IGChangeEvent>();

  /**
   * When grid info cell is clicked
   */
  @Output() onEdit = new EventEmitter<IGEditEvent>();

  /**
   * When empty grid cell is clicked
   */
  @Output() onCreate = new EventEmitter<IGCreateEvent>();

  getCurrentDataInfo(
    query: IGQueryEvent
  ): {
    data: IGCellInfo;
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
    const { rowValue } = query;

    const isLeft = !event.direction.e;

    const currentPos = this.getPosition(query).x;
    const currentStartIdx = currentPos / this.cellSize + 1;
    const startPos = Math.trunc(currentStartIdx) - 1;
    const endPos = startPos + data.cellOccupied - 1;

    // Current Data - which will be update as per calculation below
    let currentData: IGChangeEvent = {
      id: id,
      rowValue,
      endPos: this.gridColumns[endPos],
      startPos: this.gridColumns[startPos],
    };

    const width = event.size.width;
    const currentWidth = this.getWidth(query);

    if (isLeft) {
      // left is already negative
      const left = event.position.left;
      const newStartIdx = currentStartIdx + left / this.cellSize;
      const newStartPos = Math.trunc(newStartIdx) - 1;

      /**
       * Updating new start data
       */
      currentData = {
        ...currentData,
        startPos: this.gridColumns[newStartPos],
      };
    } else {
      const isEndHalf = data.hasNext;
      const newEndPos = Math.round(
        endPos + (width - currentWidth) / this.cellSize - (isEndHalf ? 0.5 : 0)
      );

      /**
       * Updating new end data
       */
      currentData = {
        ...currentData,
        endPos: this.gridColumns[newEndPos],
      };
    }

    this.onChange.emit(currentData);
  }

  /**
   * @function handleDrag To handle drag and drop event
   * @summary If cell is dropped half-way (in-between row) then next bottom row value will be considered
   */
  handleDrag(event: IPosition, query: IGQueryEvent) {
    const { data, id } = this.getCurrentDataInfo(query);
    const { x: currentPosX, y: currentPosY } = this.getPosition(query);
    const { x: newPosX, y: newPosY } = event;
    const { rowValue } = query;

    const startPos = Math.trunc(currentPosX / this.cellSize);
    const endPos = startPos + data.cellOccupied - 1;

    // Current Data - which will be update as per calculation below
    let currentData: IGChangeEvent = {
      id: id,
      rowValue,
      endPos: this.gridColumns[endPos],
      startPos: this.gridColumns[startPos],
    };

    // Calculating new row value
    const currentYIdx = Math.round(currentPosY / this.cellSize);
    const yDiff = newPosY - currentPosY; // Vertical change
    const yDiffIdx = Math.round(yDiff / this.cellSize);
    const newYIdx = currentYIdx + yDiffIdx;

    const xDiffIdx = (newPosX - currentPosX) / this.cellSize;

    // Calculating new start and end pos
    const interimStartPos = startPos + (data.hasPrev ? 0.5 : 0);
    const interimEndPos = endPos - (data.hasNext ? 0.5 : 0);

    const newStartPosInDecimal = interimStartPos + xDiffIdx; // can be in decimal (0.5)
    const newStartPos = Math.trunc(newStartPosInDecimal); // removed 0.5 as 2 or 2.5 will always be 2

    const newEndPosInDecimal = interimEndPos + xDiffIdx; // can be in decimal (0.5)
    const newEndPos = Math.round(newEndPosInDecimal); // round of as 2.5 or 3 is same for the end that will be 3

    /**
     * Drag event is emitted even if it is not moved (on click)
     * So emit onChange if something is changed else trigger onClick event
     */
    if (
      endPos !== newEndPos ||
      startPos !== newStartPos ||
      rowValue !== this.gridRows[newYIdx]
    ) {
      currentData = {
        ...currentData,
        rowValue: this.gridRows[newYIdx],
        startPos: this.gridColumns[newStartPos],
        endPos: this.gridColumns[newEndPos],
      };
      this.onChange.emit(currentData);
    } else {
      this.onEdit.emit({ id: currentData.id });
    }
  }

  /**
   * Handle emission of new data to be created
   */
  handleCreate(event: IGCreateEvent) {
    this.onCreate.emit(event);
  }

  getPosition({ rowIdx, colIdx, rowValue, colValue }: IGQueryEvent): IPosition {
    // cannot use this in template as it reset the position
    return {
      x:
        colIdx * this.cellSize +
        (this.data[rowValue][colValue]?.hasPrev ? this.cellSize / 2 : 0),
      y: rowIdx * this.cellSize,
    };
  }

  /**
   * To get the width of interactive cell
   */
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
      (value, item) => {
        value = {
          ...value,
          [item.rowValue]: [
            ...(value[item.rowValue] ?? []),
            {
              ...item,
              startPos: item.startPos,
              endPos: item.endPos,
            },
          ],
        };
        return value;
      },
      {} as Record<IGKey, IGValue[]>
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
        const hasStart = this.gridColumns.includes(item.startPos);
        const hasEnd = this.gridColumns.includes(item.endPos);
        const dataKey = hasStart ? item.startPos : this.gridColumns[0];
        const hasPrev = endPos.has(item.startPos);
        const hasNext = startPos.has(item.endPos);
        const cellOccupied =
          1 +
          // if end position is out of bound
          this.colIndices[
            hasEnd ? item.endPos : this.gridColumns[this.gridColumns.length - 1]
          ] -
          this.colIndices[item.startPos];
        rowResult = {
          ...(rowResult ?? {}),
          [dataKey]: {
            content: item.content,
            id: item.id,
            cellOccupied,
            hasNext, // if end position has new item with same point as start
            hasPrev, // if start position has new item with same point as end
            hasStart, // if start point is out of bound (left)
            hasEnd, // if end point is out of bound (right)
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

/**
 * @type Defines grid column or row value
 */
export type IGKey = string | number;

/**
 * @type Defines Cell data to create interactive gird cell
 */
export type IGCellInfo = Pick<IGValue, 'id' | 'content'> & {
  cellOccupied: number;
  hasNext: boolean;
  hasPrev: boolean;
  hasStart: boolean;
  hasEnd: boolean;
};

/**
 * @type Defines On Change event data
 */
export type IGChangeEvent = Omit<IGValue, 'content'>;

/**
 * @type Defines on create event data
 */
export type IGCreateEvent = {
  rowValue: IGKey;
  colValue: IGKey;
};

/**
 * @type Define on edit event data
 */
export type IGEditEvent = Pick<IGValue, 'id'>;

/**
 * @type Defines Grid data structure
 */
type IGData = Record<IGKey, Record<IGKey, IGCellInfo>>;

/**
 * @type Defines Input Grid value
 */
export type IGValue = {
  id: string;
  content: string;
  startPos: IGKey;
  endPos: IGKey;
  rowValue: IGKey;
};

/**
 * @type Query Event type
 */
type IGQueryEvent = {
  rowIdx: number;
  colIdx: number;
} & IGCreateEvent;
