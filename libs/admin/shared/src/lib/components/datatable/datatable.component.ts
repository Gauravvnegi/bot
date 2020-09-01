import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { delay } from 'rxjs/operators';
import { pipe, of } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api/public_api';
import { Table } from 'primeng/table';

@Component({
  selector: 'hospitality-bot-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
})
export class DatatableComponent implements OnInit {
  @Input() cols = [
    { field: 'vin', header: 'Vin' },
    { field: 'year', header: 'Year' },
    { field: 'brand', header: 'Brand' },
    { field: 'color', header: 'Color' },
  ];

  @Input() tableConfig = {
    styleClass: 'p-datatable-lg p-datatable-gridlines p-datatable-striped',
    striped: true,
    gridLines: true,
    size: 'lg',
    paginator: true,
  };

  @Input() loading: boolean = false;

  values = [];

  isPaginaton: boolean = false;
  rowsPerPage = 5;
  showCurrentPageReport: boolean = true;
  rowsPerPageOptions = [5, 10, 25, 50];
  first = 0; //index of the first page to show

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
  ];

  // only field property is used by table rest are dummy

  totalRecords = 20;
  @ViewChild('dt') table: Table;

  selectionMode = 'multiple';
  selectedRows = [];

  constructor() {}

  ngOnInit(): void {
    this.loadInitialData();
    //this.values = [...this.dataSource];
  }

  loadInitialData() {
    this.loading = true;
    of(this.dataSource.slice(0, this.rowsPerPage))
      .pipe(delay(2000))
      .subscribe((data) => {
        this.values = data;
        this.loading = false;

        //setting pagination
        this.totalRecords = this.dataSource.length;
      });
  }

  private paginate(event) {
    this.loadData(event);
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    of(this.dataSource.slice(event.first, event.first + event.rows))
      .pipe(delay(2000))
      .subscribe((data) => {
        this.values = data;
        this.loading = false;
        //setting pagination
        this.totalRecords = this.dataSource.length;
      });
  }

  onFilterTypeTextChange(event, field, matchMode = 'startsWith') {
    let value = event.target.value && event.target.value.trim();
    this.table.filter(value, field, matchMode);
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
}
