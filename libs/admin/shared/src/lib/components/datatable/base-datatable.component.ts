import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { get } from 'lodash';
import * as moment from 'moment';
import { MenuItem } from 'primeng/api';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { Paginator } from 'primeng/paginator';
import { Table } from 'primeng/table';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TableService } from '../../services/table.service';
interface Import {
  name: string;
  code: string;
}

@Component({
  template: '',
})
export class BaseDatatableComponent implements OnInit {
  currentPage = 0;
  @ViewChild('dt') table: Table; //reference to data-table
  tableName = 'Datatable'; //table name

  @Input() cols = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' },
  ]; // table columns in header

  /**
   * Action Buttons & filters visibility
   */
  isActionButtons: boolean = false;
  isQuickFilters: boolean = false;
  isTabFilters = true;
  isCustomSort = true;

  tableFG: FormGroup;

  isPaginaton: boolean = false;
  rowsPerPage = 5;
  showCurrentPageReport: boolean = true;
  rowsPerPageOptions = [5, 10, 25, 50];
  first = 0; //index of the first page to show
  currentPage = 0;

  @Input() tableConfig = {
    styleClass: 'p-datatable-sm p-datatable-gridlines',
    striped: true,
    gridLines: true,
    size: 'lg',
    paginator: true,
  }; // table-config

  isResizableColumns = true;
  isAutoLayout = false;
  @Input() loading: boolean = false;
  initialLoading: boolean = true;

  tabFilterItems = [
    { label: 'Inhouse', content: '', value: 'INHOUSE' },
    { label: 'Arrival', content: '', value: 'ARRIVAL' },
    { label: 'Departure', content: '', value: 'DEPARTURE' },
  ];

  values = [];

  TabItems: MenuItem[];

  buttons = [];

  selectedExport1: Import;

  selectedExport2: Import;

  dataSource = [
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

  totalRecords = 20;

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

  quickReplyTypes = [
    { label: 'All', icon: '', isSelected: true },
    { label: 'Check-In Pending (3)', icon: '', isSelected: false },
    { label: 'Check-In Completed (3)', icon: '', isSelected: false },
    { label: 'Express Check-In (10)', icon: '', isSelected: false },
  ];

  tempFirst;
  tempRowsPerPage;
  isSearchSet = false;
  @ViewChild('paginator', { static: false }) paginator: Paginator;

  constructor(
    private _fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    this.initTableFG();
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

  getSubscribedFilters(module, table, tabFilters) {
    this.tabFilterItems = this.tabFilterService.getSubscribedFilters(
      module,
      table,
      tabFilters
    );
  }

  private paginate(event) {
    this.currentPage = event.page;
    //first - index of the first page to be displayed
    //rows - Number of rows to display per page.
    //event.page: Index of the new page
    //event.pageCount: Total number of pages
    this.currentPage = event.page;
    this.loadData(event);
  }

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
    ).pipe(delay(2000));
  }

  onFilterTypeTextChange(event, field, matchMode = 'startsWith') {
    let value = event.target.value && event.target.value.trim();
    this.table.filter(value, field, matchMode);
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
      let EXCEL_TYPE =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
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

  // toggleQuickReplyFilter(quickReplyFilter) {}

  onRowSelect(event) {
    this.documentActionTypes.forEach((item) => {
      if (item.type == 'countType') {
        item.label = `Export (${this.selectedRows.length})`;
        this.tableFG
          .get('documentActions')
          .get('documentActionType')
          .patchValue('export');
      }
    });
  }

  onRowUnselect(event?) {
    this.documentActionTypes.forEach((item) => {
      if (item.type == 'countType') {
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
  }

  sort(event: SortEvent, type: string) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
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
    this.paginator.changePage(pageNo || 0);
  }
}
