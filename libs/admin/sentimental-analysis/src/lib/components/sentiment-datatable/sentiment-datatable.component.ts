import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { cols, title } from '../../constants/data-table';
import { colorConfig, MockData } from '../../constants/sentimental-mock-data';
import { SentimentDataTable } from '../../data-models/sentiment-datatable';

@Component({
  selector: 'hospitality-bot-sentiment-datatable',
  templateUrl: './sentiment-datatable.component.html',
  styleUrls: [
    './sentiment-datatable.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class SentimentDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  hotelId: string;
  tableName = title;
  cols = cols;
  iQuickFilters = true;
  subscription$ = new Subscription();
  colorsConfig = colorConfig;
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.dataSource = new SentimentDataTable().deserialize(
      MockData.sentiment.rowData
    ).records;
    this.totalRecords = this.dataSource.length;
    this.rowsPerPage = 10;
    this.loadInitialData();
  }

  search(event, field): void {
    this.handleFieldSearch({
      value: event.target.value,
      field,
      matchMode: 'contains',
    });
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
