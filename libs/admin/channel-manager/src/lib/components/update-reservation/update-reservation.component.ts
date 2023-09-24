import { Component, OnInit } from '@angular/core';
import {
  IGCreateEvent,
  IGChangeEvent,
  IGEditEvent,
  IGRow,
  IGCol,
  IGValue,
} from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

@Component({
  selector: 'hospitality-bot-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss'],
})
export class UpdateReservationComponent implements OnInit {
  heading = 'Update inventory';
  gridRows: IGRow[] = [101, 102, 103, 104, 105, 106, 107, 108, 109, 110];

  // gridCols = [Array.from({ length: 14 }, (_, index) => index + 1)];
  gridCols: IGCol[] = [10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  data: IGValue[] = [
    {
      id: 'RES000',
      content: 'Out left 105',
      startPos: 8,
      endPos: 10,
      rowValue: 105,
    },
    {
      id: 'RES01000',
      content: 'Out right 105',
      startPos: 19,
      endPos: 22,
      rowValue: 105,
    },
    {
      id: 'RES001',
      content: 'Dhruv 101',
      startPos: 14,
      endPos: 16,
      rowValue: 101,
    },
    {
      id: 'RES002',
      content: 'Akash 101',
      startPos: 17,
      endPos: 19,
      rowValue: 101,
    },
    {
      id: 'RES003',
      content: 'Jag 101',
      startPos: 20,
      endPos: 20,
      rowValue: 101,
    },
    {
      id: 'RES004',
      content: 'Tony Stark 102',
      startPos: 10,
      endPos: 15,
      rowValue: 102,
    },
    {
      id: 'RES006',
      content: 'Steve Rogers 103',
      startPos: 11,
      endPos: 15,
      rowValue: 103,
    },
    {
      id: 'RES0071',
      content: 'Pradeep 104',
      startPos: 11,
      endPos: 19,
      rowValue: 104,
    },
    {
      id: 'RES008',
      content: 'Ayush 104',
      startPos: 19,
      endPos: 20,
      rowValue: 104,
    },
    {
      id: 'RES007',
      content: 'Ayush 104',
      startPos: 21,
      endPos: 30,
      rowValue: 104,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  handleChange(event: IGChangeEvent) {
    console.log(event, 'onChange event');
  }

  handleCreate(event: IGCreateEvent) {
    console.log(event, 'onCreate event');
  }

  handleEdit(event: IGEditEvent) {
    console.log(event, 'onEdit event');
  }

  calculateSpace(value) {
    console.log('hello', value);
  }
}
