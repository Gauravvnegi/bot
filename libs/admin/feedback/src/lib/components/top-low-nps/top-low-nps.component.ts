import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-top-low-nps',
  templateUrl: './top-low-nps.component.html',
  styleUrls: ['./top-low-nps.component.scss']
})
export class TopLowNpsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    this.initData();
  }

  progressItems = [
    { label: 'SPA & Salon', value: 80, color: '#1AB99F' },
    { label: 'Safety & Security', value: 20, color: '#1AB99F' },
    { label: 'Maintenance', value: 5, color: '#1AB99F' },
    { label: 'Reservations', value: -50, color: '#EF1D45' },
    { label: 'Front office', value: -10, color: '#EF1D45' },
    { label: 'Housekeeping', value: -5, color: '#EF1D45' }
  ]

  tabFilterItems = [
    { label: 'Department', icon: '', value: 'DEPARTMENT', total: 0, isSelected: true },
    { label: 'Service', icon: '', value: 'SERVICE', total: 0, isSelected: false },
    { label: 'Touchpoint', icon: '', value: 'TOUCHPOINT', total: 0, isSelected: false },
  ];

  tabFilterIdx: number = 0;

  initData() {}

  onSelectedTabFilterChange($event) {
    this.tabFilterIdx = $event.index;
  }

}
