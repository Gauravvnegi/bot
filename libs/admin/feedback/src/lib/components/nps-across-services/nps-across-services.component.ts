import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-nps-across-services',
  templateUrl: './nps-across-services.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-services.component.scss'
  ]
})
export class NpsAcrossServicesComponent implements OnInit {

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    { label: 'PDF', value: 'pdf' },
  ];

  tabFilterIdx: number = 0;

  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [
        { label: 'Vallet Service', icon: '', value: 'VALLETSERVICE', total: 0, isSelected: true },
        {
          label: 'Luggage Service',
          icon: '',
          value: 'LUGGAGESERVICE',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Public Area Cleaning',
          icon: '',
          value: 'PUBLICAREACLEANING',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
        {
          label: 'Room Cleaning',
          icon: '',
          value: 'ROOMCLEANING',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Beverage',
          icon: '',
          value: 'BEVERAGE',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Spa',
          icon: '',
          value: 'SPA',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Salon',
          icon: '',
          value: 'SALON',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Gym',
          icon: '',
          value: 'GYM',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Music',
          icon: '',
          value: 'MUSIC',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
        {
          label: 'Overall Ambience',
          icon: '',
          value: 'OVERALLAMBIENCE',
          total: 0,
          isSelected: false,
          type: 'completed',
        },
      ],
    },
    {
      label: 'Front Office',
      content: '',
      value: 'FRONTOFFICE',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Housekeeping',
      content: '',
      value: 'HOUSEKEEPING',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Food & Beverage',
      content: '',
      value: 'FOODANDBEVERAGE',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Maintenance',
      content: '',
      value: 'MAINTENANCE',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Spa & Salon',
      content: '',
      value: 'SPAANDSALON',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];

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

  isOpened = false;
  progresses: any = [
    { label: 'Vallet Service', positive: 55, negative: 45 },
    { label: 'Luggage Service', positive: 18, negative: 65 },
    { label: 'Public area cleaning', positive: 45, negative: 58 },
    { label: 'Room cleaning', positive: 20, negative: 80 },
    { label: 'Beverage', positive: 55, negative: 45 },
    { label: 'Checkin', positive: 18, negative: 65 },
    { label: 'Checkout', positive: 45, negative: 58 },
    { label: 'Spa', positive: 20, negative: 80 },
    { label: 'Salon', positive: 55, negative: 45 },
    { label: 'Fragrance', positive: 18, negative: 65 },
    { label: 'Gym', positive: 45, negative: 58 },
    { label: 'Music', positive: 20, negative: 80 },
    { label: 'Overall Ambience', positive: 80, negative: 20 }
  ];

  progressValues = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['exportAll'],
      quickReplyActionFilters: [[]],
    })
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
    //toggle isSelected
    this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected;
  }

}
