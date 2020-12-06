import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-nps-across-services',
  templateUrl: './nps-across-services.component.html',
  styleUrls: ['./nps-across-services.component.scss']
})
export class NpsAcrossServicesComponent implements OnInit {

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
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
      documentActionType: ['exportAll']
    })
  }

}
