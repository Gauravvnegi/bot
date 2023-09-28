import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IPosition } from 'angular2-draggable';
import { IResizeEvent } from 'angular2-draggable/lib/models/resize-event';
import { FlagType } from '../../types/table.type';

/**
 * @class InteractiveGridComponent
 * @todo data reinitialize handle function (reset functionality)
 * @todo Tool tip on content - need to refactor
 * @todo [sameStartEndPos] need to handle same start and end pos (breaking single cell grid data)
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

  /**
   * To show the spinner
   */
  @Input() isProcessing = false;

  cellSize: IGProps['cellSize'] = 90; //Cell Size is grid height and width including the gap
  cellGap: IGProps['cellGap'] = 5; // Cell gap will decide the spaces between the grid blocks
  createNewToolTipInfo: IGProps['createNewToolTipInfo'] = 'Create New Entry';
  rowName: IGProps['rowName'];
  colName: IGProps['colName'];
  minWidth: IGProps['minWidth'] = 'half';
  resizeWidth: IGProps['resizeWidth'] = 'half';
  gridHeight: IGProps['resizeWidth'] = 'half';

  /**
   * Props to show extra information
   * @todo Need to handle label for col and row to show information
   */
  @Input() set props(value: IGProps) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
  }

  get resizeDelimiter() {
    return this.resizeWidth === 'half' ? 2 : 1;
  }

  get heightDelimiter() {
    return this.gridHeight === 'half' ? 2 : 1;
  }

  get height() {
    return this.cellSize / this.heightDelimiter;
  }

  /**
   * Grid Data setter to set he grid rows and column data with the available value
   * @example
   * const gridData = {
   *    rows: [101, 102, 103 ,104, 105],
   *    column: [110, 120, 130, 140],
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
    rows: IGRow[];
    columns: IGCol[];
    values: IGValue[];
  }) {
    this.gridColumns = data.columns;
    this.gridRows = data.rows;
    this.colStart = this.gridColumns[0];
    this.colDiff = this.gridColumns[1] - this.gridColumns[0];
    this.colIndices = this.gridColumns.reduce((p, c, i) => {
      p = { ...p, [c]: i };
      return p;
    }, {});

    this.data = this.getModdedData(data.values ?? []);
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

  /**
   * Array of gird column value and also decide the no of column based on the length
   * @example  or [110, 120, 130, 140]
   */
  gridColumns: IGCol[] = [];
  colStart: IGCol;
  colDiff: number;
  colIndices: Record<IGCol, number> = {}; // One time mapping of index (to reduce find of index)

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
  gridRows: IGRow[] = [];

  /**
   * Return no of rows
   */
  get noOfRow() {
    return this.gridRows.length;
  }

  /**
   * Information about the out of bound records
   */
  outOfBoundRecord: OutOfBoundRecord = {};

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
    const startPosIdx = Math.trunc(currentStartIdx) - 1;
    const endPosIdx = startPosIdx + data.cellOccupied - 1;

    // Current Data - which will be update as per calculation below
    let currentData: IGChangeEvent = {
      id: id,
      rowValue,
      startPos: data.hasStart ? this.gridColumns[startPosIdx] : data.oStartPos,
      endPos: data.hasEnd ? this.gridColumns[endPosIdx] : data.oEndPos,
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
        endPosIdx +
          (width - currentWidth) / this.cellSize -
          (isEndHalf ? 0.5 : 0)
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

    const startPosIdx = data.startPosIdx;
    const endPosIdx = data.endPosIdx;

    // Current Data - which will be update as per calculation below
    let currentData: IGChangeEvent = {
      id: id,
      rowValue,
      endPos: this.gridColumns[endPosIdx],
      startPos: this.gridColumns[startPosIdx],
    };

    // Calculating new row value
    const currentYIdx = Math.round(currentPosY / this.height);
    const yDiff = newPosY - currentPosY; // Vertical change
    const yDiffIdx = Math.round(yDiff / this.height);
    const newYIdx = currentYIdx + yDiffIdx;

    const xDiffIdx = (newPosX - currentPosX) / this.cellSize;

    // Calculating new start and end pos
    const interimStartPos = startPosIdx + (data.hasPrev ? 0.5 : 0);
    const interimEndPos = endPosIdx - (data.hasNext ? 0.5 : 0);

    const newStartPosInDecimal = interimStartPos + xDiffIdx; // can be in decimal (0.5)
    const newStartPosIdx = Math.trunc(newStartPosInDecimal); // removed 0.5 as 2 or 2.5 will always be 2

    const newEndPosInDecimal = interimEndPos + xDiffIdx; // can be in decimal (0.5)
    const newEndPosIdx = Math.round(newEndPosInDecimal); // round of as 2.5 or 3 is same for the end that will be 3

    /**
     * Drag event is emitted even if it is not moved (on click)
     * So emit onChange if something is changed else trigger onClick event
     */
    if (
      endPosIdx !== newEndPosIdx ||
      startPosIdx !== newStartPosIdx ||
      rowValue !== this.gridRows[newYIdx]
    ) {
      currentData = {
        ...currentData,
        rowValue: this.gridRows[newYIdx],
        startPos: this.gridColumns[newStartPosIdx],
        endPos: this.gridColumns[newEndPosIdx],
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
      y: rowIdx * this.height,
    };
  }

  /**
   * To get the width of interactive cell
   */
  getWidth(query: IGQueryEvent): number {
    const { data } = this.getCurrentDataInfo(query);

    const currentOutOfBoundRecord = this.outOfBoundRecord[data.id];
    const width =
      this.cellSize * data.cellOccupied -
      (data?.hasNext ? this.cellSize / 2 : 0) -
      (data.hasPrev ? this.cellSize / 2 : 0);

    // Left margin is used in the html for start of bound
    return (
      width + currentOutOfBoundRecord.lSpace + currentOutOfBoundRecord.rSpace
    );
  }

  onMoving(event: IPosition, query: IGQueryEvent) {
    const { data } = this.getCurrentDataInfo(query);

    const startOOB = !data.hasStart;
    const endOOB = !data.hasEnd;

    const cPos = this.getPosition(query).x;
    const qPos = event.x;

    /**
     * If IGCell is out of bound to the left
     */
    if (startOOB) {
      const diff = qPos - cPos;

      const noOfCell =
        (this.gridColumns[data.startPosIdx] - data.oStartPos) / this.colDiff;

      this.outOfBoundRecord[data.id].hasLeftBorder =
        diff >= noOfCell * this.cellSize;

      if (diff <= noOfCell * this.cellSize) {
        this.outOfBoundRecord[data.id].lSpace = diff;
      }
    }

    /**
     * If IGCell is out of bound to the right
     */
    if (endOOB) {
      const diff = cPos - qPos;

      const noOfCell =
        (data.oEndPos - this.gridColumns[data.endPosIdx]) / this.colDiff;

      this.outOfBoundRecord[data.id].hasRightBorder =
        diff >= noOfCell * this.cellSize;

      if (diff <= noOfCell * this.cellSize) {
        this.outOfBoundRecord[data.id].rSpace = diff;
      }
    }
  }

  /**
   * To get the desired formatted data
   */
  getModdedData(input: IGValue[]): IGData {
    const inputPerRow: Record<IGRow, IGValue[]> = input.reduce(
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
      {} as Record<IGRow, IGValue[]>
    );

    let resultData: IGData = {};

    for (let item in inputPerRow) {
      const rowValues = inputPerRow[item];
      const { startPos, endPos } = rowValues.reduce(
        (value, item) => {
          // todo - sameStartEndPos
          value.startPos.add(item.startPos);
          // if (item.startPos !== item.endPos) {
          //   // not pushing for same start and
          value.endPos.add(item.endPos);
          // }
          return value;
        },
        {
          startPos: new Set(),
          endPos: new Set(),
        }
      );

      let rowResult: IGData[IGRow] = {};

      rowValues.forEach((item) => {
        const hasStart = this.gridColumns.includes(item.startPos); // if start is within the bound
        const hasEnd = this.gridColumns.includes(item.endPos); // if end is within the bound

        const boundStartPos = hasStart ? item.startPos : this.gridColumns[0];
        const boundEndPos = hasEnd
          ? item.endPos
          : this.gridColumns[this.gridColumns.length - 1];

        const hasPrev = endPos.has(item.startPos);
        const hasNext = startPos.has(item.endPos);

        this.outOfBoundRecord = {
          ...this.outOfBoundRecord,
          [item.id]: {
            lSpace: 0,
            rSpace: 0,
            hasLeftBorder: hasStart,
            hasRightBorder: hasEnd,
          },
        };

        // Start and end position could be out of bound
        const cellOccupied =
          1 + this.colIndices[boundEndPos] - this.colIndices[boundStartPos];

        rowResult = {
          ...(rowResult ?? {}),
          [boundStartPos]: {
            ...item,
            id: item.id,
            cellOccupied,
            startPosIdx: this.colIndices[boundStartPos],
            endPosIdx: this.colIndices[boundEndPos],
            oStartPos: item.startPos,
            oEndPos: item.endPos,
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
export type IGRow = string | number;

/**
 * @type Defines grid column or row value
 */
export type IGCol = number;

/**
 * @type Defines Cell data to create interactive gird cell
 */
export type IGCellInfo = Pick<IGValue, 'id' | ExtraGridInformationKeys> & {
  cellOccupied: number;
  hasNext: boolean;
  hasPrev: boolean;
  hasStart: boolean;
  hasEnd: boolean;
  startPosIdx: number;
  endPosIdx: number;
  oStartPos: IGCol;
  oEndPos: IGCol;
};

/**
 * @type Defines On Change event data
 */
export type IGChangeEvent = Omit<IGValue, ExtraGridInformationKeys>;

/**
 * @type Defines on create event data
 */
export type IGCreateEvent = {
  rowValue: IGRow;
  colValue: IGCol;
};

/**
 * @type Define on edit event data
 */
export type IGEditEvent = Pick<IGValue, 'id'>;

/**
 * @type Defines Grid data structure
 */
type IGData = Record<IGRow, Record<IGRow, IGCellInfo>>;

/**
 * @type Defines Input Grid value
 */
export type IGValue = {
  id: string;
  startPos: IGCol;
  endPos: IGCol;
  rowValue: IGRow;
} & ExtraGridInformation;

export type IGProps = {
  createNewToolTipInfo?: string;
  rowName?: string;
  colName?: string;
  minWidth?: GridBreakPoints;
  resizeWidth?: GridBreakPoints;
  cellSize?: number;
  cellGap?: number;
  gridHeight?: GridBreakPoints;
};

/**
 * @type Query Event type
 */
type IGQueryEvent = {
  rowIdx: number;
  colIdx: number;
} & IGCreateEvent;

type GridBreakPoints = 'half' | 'full';

type OutOfBoundRecord = Record<
  IGValue['id'],
  {
    lSpace: number;
    rSpace: number;
    hasLeftBorder: boolean;
    hasRightBorder: boolean;
  }
>;

/**
 * @argument content - Text to be shown
 * @argument colorCode - 'success' | 'active' | 'inactive' | 'draft' | 'warning'
 * @argument additionContent - Addition Text to be shown
 */
type ExtraGridInformation = {
  content?: string;
  additionContent?: string;
  colorCode?: FlagType;
  icons?: string[];
};

type ExtraGridInformationKeys = keyof ExtraGridInformation;
