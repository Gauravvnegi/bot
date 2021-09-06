import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-point-of-sale',
  templateUrl: './point-of-sale.component.html',
  styleUrls: [
    './point-of-sale.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class PointOfSaleComponent implements OnInit {
  npsFG: FormGroup;
  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];
  documentTypes = [{ label: 'CSV', value: 'csv' }];
  saleData = [
    {
      label: 'Outlet 1',
      data: [
        { color: '#f18533', percentage: 25, label: 'Staff' },
        { color: '#4974e0', percentage: 50, label: 'Cleanliness' },
        { color: '#3db76b', percentage: 13, label: 'Pricing' },
        { color: '#ffbf04', percentage: 12, label: 'Quality' },
      ],
    },
    {
      label: 'Outlet 2',
      data: [
        { color: '#f18533', percentage: 18, label: 'Staff' },
        { color: '#4974e0', percentage: 12, label: 'Cleanliness' },
        { color: '#3db76b', percentage: 40, label: 'Pricing' },
        { color: '#ffbf04', percentage: 30, label: 'Quality' },
      ],
    },
  ];

  percentValue = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['exportAll'],
      quickReplyActionFilters: [[]],
    });
  }

  exportCSV() {}
}
