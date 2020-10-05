import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { pipe, of, Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { FormGroup, FormBuilder } from '@angular/forms';

interface Import {
  name: string;
  code: string;
}

@Component({
  template: '',
})
export class BaseDatatableComponent implements OnInit {
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

  @Input() tableConfig = {
    styleClass: 'p-datatable-sm p-datatable-gridlines p-datatable-striped',
    striped: true,
    gridLines: true,
    size: 'lg',
    paginator: true,
  }; // table-config

  isResizableColumns = true;
  isAutoLayout = false;
  @Input() loading: boolean = false;

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

  documentActionTypes = [{ label: 'Export', value: 'export' }];
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    { label: 'EXCEL', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
  ];

  quickReplyTypes = [
    { label: 'All', icon: '', isSelected: true },
    { label: 'Check-In Pending (3)', icon: '', isSelected: false },
    { label: 'Check-In Completed (3)', icon: '', isSelected: false },
    { label: 'Express Check-In (10)', icon: '', isSelected: false },
  ];

  constructor(private _fb: FormBuilder) {
    this.initTableFG();
  }

  initTableFG() {
    this.tableFG = this._fb.group({
      documentActions: this._fb.group({
        documentActionType: ['export'],
        documentType: ['csv'],
      }),
      quickReplyActionFilters: [[]],
    });
  }

  ngOnInit(): void {
    this.loadInitialData();
    //this.values = [...this.dataSource];
  }

  //SelectItem API with label-value pairs this.cities1 = [ {label:'Select City', value:null}, {label:'New York', value:{id:1, name: 'New York', code: 'NY'}}, {label:'Rome', value:{id:2, name: 'Rome', code: 'RM'}}, {label:'London', value:{id:3, name: 'London', code: 'LDN'}}, {label:'Istanbul', value:{id:4, name: 'Istanbul', code: 'IST'}}, {label:'Paris', value:{id:5, name: 'Paris', code: 'PRS'}} ]; //An array of cities this.cities2 = [ {name: 'New York', code: 'NY'}, {name: 'Rome', code: 'RM'}, {name: 'London', code: 'LDN'}, {name: 'Istanbul', code: 'IST'}, {name: 'Paris', code: 'PRS'} ]; } }

  loadInitialData() {
    this.loading = true;
    this.fetchDataFrom().subscribe((data) => {
      this.values = data;
      this.loading = false;
      //setting pagination
      this.totalRecords = this.dataSource.length;
    });
  }

  private paginate(event) {
    //first - index of the first page to be displayed
    //rows - Number of rows to display per page.
    //event.page: Index of the new page
    //event.pageCount: Total number of pages
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
    debugger;
    let value = event.target.value && event.target.value.trim();
    this.table.filter(value, field, matchMode);
  }

  onDocumentActions() {
    //check for selected. if true pass an option
    this.tableFG.value;
    //this.table.exportCSV();
  }

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

  toggleQuickReplyFilter(quickReplyFilter) {}
}
