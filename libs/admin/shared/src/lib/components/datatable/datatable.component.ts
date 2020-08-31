import { Component, OnInit, Input } from '@angular/core';

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

  @Input() loading = false;

  cars = [
    {
      vin: 1,
      year: 2020,
      brand: 'tata',
      color: 'red',
    },
    { vin: 2, year: 2021, brand: 'maruti', color: 'blue' },
    { vin: 3, year: 2022, brand: 'ford', color: 'green' },
    { vin: 4, year: 2023, brand: 'mg', color: 'yellow' },
  ];

  // only field property is used by table rest are dummy
  constructor() {}

  ngOnInit(): void {}
}
