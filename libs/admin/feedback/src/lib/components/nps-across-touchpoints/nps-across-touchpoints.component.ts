import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-nps-across-touchpoints',
  templateUrl: './nps-across-touchpoints.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-touchpoints.component.scss'
  ]
})
export class NpsAcrossTouchpointsComponent implements OnInit {

  isOpened = false;
  npsFG: FormGroup;
  progresses: any = [
    { label: 'Checkin', frontDesk: 23, roomCleaning: 35, luggageServices: 42 },
    { label: 'Checkout', frontDesk: 30, roomCleaning: 40, luggageServices: 30 }
  ];

  progressValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

  tabFilterIdx: number = 0;

  tabFilterItems = [
    {
      label: 'Front Office',
      content: '',
      value: 'FRONTOFFICE',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
      ],
    },
    {
      label: 'Housekeeping',
      content: '',
      value: 'HOUSEKEEPING',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
      ],
    },
    {
      label: 'Food & Beverage',
      content: '',
      value: 'FOODANDBEVERAGE',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
      ],
    },
    {
      label: 'Maintenance',
      content: '',
      value: 'MAINTENANCE',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
      ],
    },
    {
      label: 'Spa & Salon',
      content: '',
      value: 'SPAANDSALON',
      disabled: false,
      total: 0,
      chips: [
        { label: 'All', icon: '', value: 'ALL', total: 0, isSelected: true },
        {
          label: 'Checkin',
          icon: '',
          value: 'CHECKIN',
          total: 0,
          isSelected: false,
          type: 'pending',
        },
        {
          label: 'Checkout',
          icon: '',
          value: 'CHECKOUT',
          total: 0,
          isSelected: false,
          type: 'initiated',
        },
      ],
    },
  ];

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.initFG();
  }

  initFG(): void {
    this.npsFG = this.fb.group({
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
