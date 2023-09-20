import { Component, OnInit } from '@angular/core';
import { IGValue } from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

@Component({
  selector: 'hospitality-bot-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss'],
})
export class UpdateReservationComponent implements OnInit {
  gridRows = [101, 102, 103, 104, 105];
  girdCols = Array.from({ length: 14 }, (_, index) => index + 1);

  data: IGValue[] = [
    {
      id: 'RES001',
      content: 'Dhruv 101',
      startPos: 1,
      endPos: 3,
      rowValue: 101,
    },
    {
      id: 'RES002',
      content: 'Akash 101',
      startPos: 3,
      endPos: 4,
      rowValue: 101,
    },
    {
      id: 'RES003',
      content: 'Jag 101',
      startPos: 6,
      endPos: 7,
      rowValue: 101,
    },
    {
      id: 'RES004',
      content: 'Tony Stark 102',
      startPos: 6,
      endPos: 7,
      rowValue: 102,
    },
    {
      id: 'RES006',
      content: 'Steve Rogers 103',
      startPos: 3,
      endPos: 6,
      rowValue: 103,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  handleChange(event) {
    console.log(event, 'parent event');
  }
}
