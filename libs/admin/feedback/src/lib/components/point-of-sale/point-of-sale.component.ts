import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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

  chips = [
    {
      label: 'Overall',
      icon: '',
      value: 'ALL',
      total: 0,
      isSelected: true,
    },
    {
      label: 'Staff',
      icon: '',
      value: 'STAFF',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Cleanliness ',
      icon: '',
      value: 'CLEANLINESS',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Pricing ',
      icon: '',
      value: 'PRICING',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
    {
      label: 'Quality ',
      icon: '',
      value: 'QUALITY',
      total: 0,
      isSelected: false,
      type: 'initiated',
    },
  ];

  tabFilterIdx: number = 0;

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: this.chips,
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

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }

  isQuickReplyFilterSelected(quickReplyFilter) {
    // const index = this.quickReplyTypes.indexOf(offer);
    // return index >= 0;
    return true;
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
    if (quickReplyTypeIdx == 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') {
          chip.isSelected = false;
        }
      });
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    } else {
      this.tabFilterItems[this.tabFilterIdx].chips[0].isSelected = false;
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    }
    this.updateQuickReplyActionFilters();
  }

  updateQuickReplyActionFilters(): void {
    let value = [];
    this.tabFilterItems[this.tabFilterIdx].chips
      .filter((chip) => chip.isSelected)
      .forEach((d) => {
        value.push(d.value);
      });
    this.quickReplyActionFilters.patchValue(value);
  }

  exportCSV() {}

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }
}
