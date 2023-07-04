import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { get } from 'lodash';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Observable, of, Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import {
  defaultFilterChipValue,
  defaultRecordJson,
  quickReplyFilterDefaultConfig,
} from '../../constants/datatable';
import { TableService } from '../../services/table.service';
import {
  Chip,
  Cols,
  EntityState,
  EntityStateRecord,
  Filter,
  QuickReplyFilterConfig,
  TableFieldSearch,
} from '../../types/table.type';
import { convertToTitleCase } from '../../utils/valueFormatter';

interface Import {
  name: string;
  code: string;
}

@Component({
  template: '',
})
export class BaseDatatableComponent implements OnInit {
  isScrolledUp = false;
  currentPage = 0;
  @ViewChild('dt') table: Table; //reference to data-table
  tableName = 'Datatable'; //table name

  @Input() cols: Cols[] = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' },
  ]; // table columns in header

  /**
   * Action Buttons & filters visibility
   */
  isActionButtons = false;
  isQuickFilters = true;
  isTabFilters = true;
  isCustomSort = true;
  isSelectable = true;
  isSearchable = true;
  isEmpty = true;

  tableFG: FormGroup;

  isPaginator = false;
  rowsPerPage = 5;
  showCurrentPageReport = true;
  rowsPerPageOptions = [5, 10, 25, 50];
  first = 0; //index of the first page to show

  @Input() tableConfig = {
    styleClass: 'p-datatable-sm p-datatable-gridlines',
    striped: true,
    gridLines: true,
    size: 'lg',
    paginator: true,
  }; // table-config

  isResizableColumns = true;
  isAutoLayout = false;
  @Input() loading = false;
  initialLoading = true;

  tabFilterItems: Filter<string, string>[] | any = []; //any will be removed when implemented everywhere
  tabFilterIdx = 0;
  selectedTab: string;
  isAllTabFilterRequired = false;

  filterChips: Chip<string>[] | any = []; //Chips setting, When there is no tabItem
  selectedFilterChips = new Set<string>([defaultFilterChipValue.value]);

  values = [];

  TabItems: MenuItem[] = [];
  additionalActionItems = [];
  buttons = [];

  selectedExport1: Import;

  selectedExport2: Import;

  dataSource: Record<string, any>[] = [
    {
      vin: 1,
      year: 2020,
      brand: 'tata',
      color: 'red',
    },
    { vin: 2, year: 2021, brand: 'maruti', color: 'blue' },
    { vin: 3, year: 2022, brand: 'ford', color: 'green' },
    { vin: 4, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 5, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 6, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 7, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 8, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 9, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 10, year: 2023, brand: 'mg', color: 'yellow' },
    { vin: 11, year: 2023, brand: 'mg', color: 'yellow' },
  ]; // testing data-source

  totalRecords = 0;

  selectionMode = 'multiple';
  selectedRows = [];

  documentActionTypes = [
    {
      label: 'Export All',
      value: 'exportAll',
      type: '',
      defaultLabel: 'Export All',
    },
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];

  quickReplyTypes = [];

  reportTemplate = 'Showing {first} to {last} of {totalRecords} entries';
  tempFirst;
  tempRowsPerPage;
  isSearchSet = false;
  @ViewChild('paginator', { static: false }) paginator: Paginator;

  /** !!!!!! IMPORTANT
   * Use this to cancel api call when filter changes and the previous request is still in progress
   */
  subscriptionList$ = new Subscription();

  constructor(
    private _fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    this.initTableFG();
    document
      .getElementById('main-layout')
      ?.addEventListener('scroll', this.onScroll);
  }

  initTableFG() {
    this.tableFG = this._fb.group({
      documentActions: this._fb.group({
        documentActionType: ['exportAll'],
        documentType: ['csv'],
      }),
      quickReplyActionFilters: [[]],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    //this.values = [...this.dataSource];
  }

  loadInitialData() {
    this.loading = true;
    this.fetchDataFrom().subscribe((data) => {
      this.values = data;
      this.loading = false;
      //setting pagination
      this.totalRecords = this.dataSource.length;
    });
  }

  resetTableValues() {
    this.rowsPerPage = 5;
    this.first = 0;
    this.values = [];
    this.tabFilterItems = [];
    this.tabFilterIdx = 0;
    this.filterChips = [];
    this.selectedFilterChips = new Set<string>([defaultFilterChipValue.value]);
    this.totalRecords = 0;
  }

  getSubscribedFilters(module, table, tabFilters) {
    this.tabFilterItems = this.tabFilterService.getSubscribedFilters(
      module,
      table,
      tabFilters
    );
  }

  private paginate(event) {
    //first - index of the first page to be displayed
    //rows - Number of rows to display per page.
    //event.page: Index of the new page
    //event.pageCount: Total number of pages

    this.currentPage = event.page;
    this.updatePaginations(event);
    this.loadData(event);
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param event The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;

    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event: LazyLoadEvent): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  // will be overridden at parent file
  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.fetchDataFrom({ first: event.first, rows: event.rows }).subscribe(
      (data) => {
        this.values = data;
        this.loading = false;
        //setting pagination
        this.totalRecords = this.dataSource.length;
      }
    );
  }

  fetchDataFrom(
    config = { first: 0, rows: this.rowsPerPage }
  ): Observable<any> {
    return of(
      this.dataSource.slice(config.first, config.first + config.rows)
    ).pipe(delay(this.dataSource.length ? 2000 : 500));
  }

  // this will be replace with handleFieldSearch function
  onFilterTypeTextChange(event, field, matchMode = 'startsWith') {
    const value = event.target.value && event.target.value.trim();
    this.table.filter(value, field, matchMode);
  }

  /**
   * @function handleFieldSearch To filter the data with respect to fields
   * @param param0 has value field names and match mode for searching
   */
  handleFieldSearch({ value, field, matchMode }: TableFieldSearch) {
    const searchValue = value.trim();
    if (typeof field === 'string') {
      this.table.filter(searchValue, field, matchMode);
    } else {
      (this.table.globalFilterFields = field),
        this.table.filterGlobal(searchValue, matchMode);
    }
  }

  /**
   * @function resetTable To reset the table
   * @description This will reset the table to its initial state
   */
  resetTable() {
    this.table?.reset();
  }

  onDocumentActions() {
    //check for selected. if true pass an option
    this.tableFG.value;
    //this.table.exportCSV();
    switch (this.tableFG.get('documentActions').get('documentType').value) {
      case 'csv':
        this.exportCSV();
        break;
      default:
        break;
    }
  }

  exportCSV() {}

  exportPdf() {
    import('jspdf').then((jsPDF) => {
      import('jspdf-autotable').then((x) => {
        // const doc = new jsPDF.default(0, 0);
        //   doc.autoTable(this.exportColumns, this.values);
        // doc.save(`${this.tableName}.pdf`);
      });
    });
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.values);
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, `${this.tableName}`);
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then((FileSaver) => {
      const EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(
        data,
        fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
      );
    });
  }

  next() {
    this.first = this.first + this.rowsPerPage;
  }

  prev() {
    this.first = this.first - this.rowsPerPage;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.values
      ? this.first === this.values.length - this.rowsPerPage
      : true;
  }

  isFirstPage(): boolean {
    return this.values ? this.first === 0 : true;
  }

  isQuickReplyFilterSelected(quickReplyFilter) {
    // const index = this.quickReplyTypes.indexOf(offer);
    // return index >= 0;
    return true;
  }

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   */
  toggleQuickReplyFilter({
    chips,
    selectedChips,
  }: {
    chips: Chip<string>[];
    selectedChips: Set<string>;
  }): void {
    this.selectedFilterChips = selectedChips;

    // REMOVE
    // If multiple tab filter chips - remove
    if (this.tabFilterItems[this.tabFilterIdx])
      this.tabFilterItems[this.tabFilterIdx].chips = chips;

    // If no tab to switch (singleFilter) - remove
    if (this.filterChips) this.filterChips = chips;

    this.changePage(0);
  }

  // remove
  /**
   * @function calculateTotalChipsCount To calculate the total count of the chips.
   * @param chips The chips array.
   * @returns The total count of the chips.
   */
  calculateTotalChipsCount(chips) {
    return chips
      ?.filter((chip) => chip?.isSelected)
      ?.reduce((total, chip) => total + (chip?.total ?? 0), 0);
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent) {
    this.resetTable();
    this.tabFilterIdx = event.index;
    this.selectedTab = this.tabFilterItems[event.index].value;
    this.selectedFilterChips = new Set<string>([defaultFilterChipValue.value]);
    this.loadData({});
  }

  /**
   * Handle the value of tab filters and filter chips
   * @param entityTypeCounts Tab filters value
   * @param entityStateCounts Filter chips value
   * @param recordsJson Json data for label and type value against the key
   * @param totalMainCount total count of all data
   */
  initFilters<T extends string>(
    entityTypeCounts: EntityState<T>,
    entityStateCounts: EntityState<T>,
    totalMainCount: number,
    recordsJson?: EntityStateRecord<T>
  ) {
    const record = { ...defaultRecordJson, ...recordsJson };
    let totalCount = totalMainCount;

    const resEntityTypeCounts = {
      ...(this.isAllTabFilterRequired
        ? { [defaultFilterChipValue.value]: totalCount }
        : {}),
      ...entityTypeCounts,
    };

    if (resEntityTypeCounts && Object.keys(resEntityTypeCounts).length > 0) {
      this.tabFilterItems = Object.entries(resEntityTypeCounts).map(
        ([key, value]) => ({
          label: record[key]?.label ?? convertToTitleCase(key),
          value: key,
          total: value,
        })
      );

      const selectedTabIndex = this.tabFilterItems.findIndex(
        (item) => item.value === this.selectedTab
      );
      if (selectedTabIndex !== -1 && selectedTabIndex !== this.tabFilterIdx) {
        // changing the selected tab filter index as api response can give different order
        this.tabFilterIdx === selectedTabIndex;
      }

      totalCount = this.tabFilterItems[this.tabFilterIdx].total;
    } else this.isTabFilters = false;

    // Is empty is checked for tab filters only or main
    this.isEmpty = totalCount === 0;

    if (entityStateCounts && Object.keys(entityStateCounts).length > 0) {
      this.filterChips = Object.entries({
        [defaultFilterChipValue.value]: totalCount,
        ...entityStateCounts,
      }).map(([key, value]) => {
        const stateCount = {
          label: record[key]?.label ?? convertToTitleCase(key),
          value: key,
          total: value,
          type: record[key]?.type ?? 'active',
        } as Chip<T>;
        return stateCount;
      });

      if (!this.selectedFilterChips.has(defaultFilterChipValue.value)) {
        totalCount = this.filterChips.reduce((prev, curr) => {
          const isSelected = this.selectedFilterChips.has(curr.value);
          const res = prev + (isSelected ? curr.total : 0);
          return res;
        }, 0);
      }

      this.isQuickFilters = true;
    } else this.isQuickFilters = false;
    this.totalRecords = totalCount;
  }

  //- different version for
  getSelectedQuickReplyFiltersV2(config?: Partial<QuickReplyFilterConfig>) {
    const configSetting: QuickReplyFilterConfig = {
      ...quickReplyFilterDefaultConfig,
      ...(config ?? {}),
    };

    const { key, isAllAType, isStatusBoolean, activeStateKey } = configSetting;

    const chips = [...this.selectedFilterChips]?.filter(
      (item) => item !== defaultFilterChipValue.value && !isAllAType
    );

    if (chips.length + 1 === this.filterChips.length && !isAllAType) {
      return [];
    }
    return !isStatusBoolean
      ? chips.map((item) => ({ [key]: item }))
      : [
          chips.length !== 1
            ? { [key]: null }
            : { [key]: chips[0] === activeStateKey },
        ];
  }
  // -------------------------------------------

  // REMOVE
  /**
   * @function updateTotalRecords To update the total records count.
   * @param chips The chips array.
   */
  updateTotalRecords() {
    if (this.tabFilterItems[this.tabFilterIdx]?.chips?.length) {
      this.totalRecords = this.calculateTotalChipsCount(
        this.tabFilterItems[this.tabFilterIdx]?.chips
      );
    } else if (this.filterChips?.length) {
      this.totalRecords = this.calculateTotalChipsCount(this.filterChips);
    } else {
      this.totalRecords = this.tabFilterItems[this.tabFilterIdx]?.total;
    }
  }

  // REMOVE
  /**
   * @function updateTabFilterCount To update the count for the tabs.
   * @param countObj The object with count for all the tab.
   * @param currentTabCount The count for current selected tab.
   */
  updateTabFilterCount(countObj, currentTabCount: number): void {
    countObj = countObj ?? {};
    this.tabFilterItems?.forEach((tab) => {
      tab.value === defaultFilterChipValue.value
        ? (tab.total = currentTabCount ?? 0)
        : (tab.total = countObj[tab.value] ?? 0);
    });
  }

  // REMOVE
  /**
   * @function setFilterChips To set the total count for the chips.
   * @param chips The chips array.
   * @param countObj The object with count for all the chip.
   */
  setFilterChips(chips, countObj) {
    countObj = Object.entries(countObj).reduce((acc, [key, value]) => {
      acc[key.toUpperCase()] = value;
      return acc;
    }, {});
    chips.forEach((chip) => {
      chip.value === defaultFilterChipValue.value
        ? (chip.total =
            Number(
              Object.values(countObj).reduce((a: number, b: number) => a + b, 0)
            ) ?? 0)
        : (chip.total = countObj[chip.value] ?? 0);
    });
  }

  // REMOVE
  /**
   * @function updateQuickReplyFilterCount To update the count for chips.
   * @param countObj The object with count for all the chip.
   */
  updateQuickReplyFilterCount(countObj): void {
    if (countObj) {
      if (this.tabFilterItems[this.tabFilterIdx]?.chips?.length) {
        this.setFilterChips(
          this.tabFilterItems[this.tabFilterIdx]?.chips,
          countObj
        );
      } else if (this.filterChips?.length) {
        this.setFilterChips(this.filterChips, countObj);
      }
    }
  }

  // REMOVE
  /**
   * @function updateStatusAndCount To change the count without reloading the table
   */
  updateStatusAndCount = (prevStatus, currStatus) => {
    /* for single filterChips */

    if (this.filterChips) {
      this.filterChips.forEach((item) => {
        if (!isNaN(item.total)) {
          if (item.value === prevStatus) {
            item.total = item.total - 1;
          }
          if (item.value === currStatus) {
            item.total = item.total + 1;
          }
        }
      });
    }
    /* for multiple tab chip */
  };

  onRowSelect = (event) => {
    this.documentActionTypes.forEach((item) => {
      if (item.type === 'countType') {
        item.label = `Export (${this.selectedRows.length})`;
        this.tableFG
          .get('documentActions')
          .get('documentActionType')
          .patchValue('export');
      }
    });
  };

  onRowUnselect = (event?) => {
    this.documentActionTypes.forEach((item) => {
      if (item.type === 'countType') {
        item.label =
          this.selectedRows.length > 0
            ? `Export (${this.selectedRows.length})`
            : 'Export';

        if (!this.selectedRows.length) {
          this.tableFG
            .get('documentActions')
            .get('documentActionType')
            .patchValue('exportAll');
        }
      }
    });
  };

  onToggleSelectAll(event: { originalEvent: PointerEvent; checked: false }) {
    this.documentActionTypes.forEach((item) => {
      if (event.checked) {
        this.onRowSelect(event);
      } else {
        this.onRowUnselect(event);
      }
    });
  }

  sort(event: SortEvent, type: string) {
    event.data.sort((data1, data2) => {
      const value1 = data1[event.field];
      const value2 = data2[event.field];
      let result = null;

      if (value1 === null && value2 !== null) result = -1;
      else if (value1 !== null && value2 === null) result = 1;
      else if (value1 === null && value2 === null) result = 0;
      else if (
        typeof value1 === 'string' &&
        typeof value2 === 'string' &&
        type === 'string'
      ) {
        result = value1.localeCompare(value2);
      } else if (type === 'number') {
        result =
          Number(value1) < Number(value2)
            ? -1
            : Number(value1) > Number(value2)
            ? 1
            : 0;
      } else if (type === 'date') {
        result =
          moment(+value1) < moment(+value2)
            ? -1
            : moment(+value1) > moment(+value2)
            ? 1
            : 0;
      }

      return event.order * result;
    });
  }

  sortOrder(event, field, data1, data2, col) {
    const order = event.order;
    const rawData1 =
      event.field[event.field.length - 1] === ')'
        ? field
          ? get(data1, field)[
              event.field.substring(
                event.field.lastIndexOf('.') + 1,
                event.field.lastIndexOf('(')
              )
            ]()
          : data1[event.field.substring(0, event.field.lastIndexOf('('))]()
        : get(data1, field);
    const rawData2 =
      event.field[event.field.length - 1] === ')'
        ? field
          ? get(data2, field)[
              event.field.substring(
                event.field.lastIndexOf('.') + 1,
                event.field.lastIndexOf('(')
              )
            ]()
          : data2[event.field.substring(0, event.field.lastIndexOf('('))]()
        : get(data2, field);

    switch (col.sortType) {
      case 'number':
        return order * +rawData1 < +rawData2
          ? -1
          : +rawData1 > +rawData2
          ? 1
          : 0;
      case 'date':
        return order * moment(+rawData1).diff(moment(+rawData2));
      case 'string':
        return order * rawData1.localeCompare(rawData2);
      case 'array':
        return order * rawData1.length - rawData2.length;
    }
  }

  resetRowSelection() {
    this.selectedRows = [];
    this.onRowUnselect();
  }

  onCheckboxClicked(event) {
    event.stopPropagation();
  }

  onDataFilter(event?) {
    // this.first = this.tempFirst;
    // this.rowsPerPage = this.tempRowsPerPage;
  }

  changePage(pageNo?) {
    this.paginator?.changePage(pageNo || 0);
  }

  /**
   * @function onScroll Handle the scrolled to show changes is UI
   */
  onScroll = () => {
    if (this.table) {
      const { top } = this.table?.el?.nativeElement.getBoundingClientRect();
      this.isScrolledUp = top < 110;
    }
  };
}
