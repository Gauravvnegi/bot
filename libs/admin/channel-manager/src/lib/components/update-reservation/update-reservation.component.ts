import { Component, OnInit } from '@angular/core';
import {
  IGKey,
  IGValue,
} from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

@Component({
  selector: 'hospitality-bot-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss'],
})
export class UpdateReservationComponent implements OnInit {
  gridRows: IGKey[] = [101, 102, 103, 104, 105];

  // gridCols = [Array.from({ length: 14 }, (_, index) => index + 1)];
  gridCols: IGKey[] = [
    '01Mon',
    '02Tue',
    '03Wed',
    '04Thu',
    '05Fri',
    '06Sat',
    '07Sun',
    '08Mon',
    '09Tue',
    '10Wed',
    '11Thu',
    '12Fri',
  ];

  data: IGValue[] = [
    {
      id: 'RES001',
      content: 'Dhruv 101',
      // startPos: 1,
      // endPos: 3,
      startPos: '01Mon',
      endPos: '03Wed',
      rowValue: 101,
    },
    {
      id: 'RES002',
      content: 'Akash 101',
      // startPos: 3,
      // endPos: 4,
      startPos: '03Wed',
      endPos: '04Thu',
      rowValue: 101,
    },
    {
      id: 'RES003',
      content: 'Jag 101',
      // startPos: 6,
      // endPos: 7,
      startPos: '06Sat',
      endPos: '08Mon',
      rowValue: 101,
    },
    {
      id: 'RES004',
      content: 'Tony Stark 102',
      // startPos: 6,
      // endPos: 7,
      startPos: '06Sat',
      endPos: '08Mon',
      rowValue: 102,
    },
    {
      id: 'RES006',
      content: 'Steve Rogers 103',
      // startPos: 3,
      // endPos: 6,
      startPos: '03Wed',
      endPos: '06Sat',
      rowValue: 103,
    },
    {
      id: 'RES007',
      content: 'Pradeep 104',
      // startPos: 2,
      // endPos: 5,
      startPos: '02Tue',
      endPos: '05Fri',
      rowValue: 104,
    },
    {
      id: 'RES008',
      content: 'Ayush 104',
      // startPos: 5,
      // endPos: 7,
      startPos: '05Fri',
      endPos: '07Sun',
      rowValue: 104,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  handleChange(event) {
    console.log(event, 'parent event');
  }
}
