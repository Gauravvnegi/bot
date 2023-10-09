import { Component, OnInit } from '@angular/core';
import {
  IGCreateEvent,
  IGChangeEvent,
  IGEditEvent,
  IGRow,
  IGCol,
  IGValue,
} from 'libs/admin/shared/src/lib/components/interactive-grid/interactive-grid.component';

const data: IGValue[] = [
  {
    id: 'RES000',
    content: 'Out left 105',
    startPos: 8,
    endPos: 10,
    rowValue: 105,
    colorCode: 'warning',
    icons: ['assets/svg/View.svg', 'assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES01000',
    content: 'Out right 105',
    startPos: 19,
    endPos: 22,
    rowValue: 105,
    colorCode: 'active',
    icons: ['assets/svg/copy.svg'],
  },
  {
    id: 'RES001',
    content: 'Room not available',
    startPos: 14,
    endPos: 16,
    rowValue: 101,
    colorCode: 'draft',
    nonInteractive: true,
  },
  {
    id: 'RES002',
    content: 'Akash 101',
    startPos: 17,
    endPos: 19,
    rowValue: 101,
    colorCode: 'warning',
    icons: ['assets/svg/View.svg', 'assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES003',
    content: 'Jag 101',
    startPos: 20,
    endPos: 21,
    rowValue: 101,
    colorCode: 'success',
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES004',
    content: 'Tony Stark 102',
    startPos: 10,
    endPos: 15,

    rowValue: 102,
    colorCode: 'success',
    icons: ['assets/svg/copy.svg'],
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES006',
    content: 'Steve Rogers 103',
    startPos: 11,
    endPos: 15,
    rowValue: 103,
    colorCode: 'active',
  },

  {
    id: 'RES0071',
    content: 'Pradeep 104',
    startPos: 11,
    endPos: 19,
    rowValue: 104,
    colorCode: 'inactive',
    icons: ['assets/svg/copy.svg', 'assets/svg/View.svg'],

    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES008',
    content: 'Ayush 104',
    startPos: 19,
    endPos: 20,
    rowValue: 104,
    colorCode: 'active',
    additionContent: 'BigOh private ltd.',
  },
  {
    id: 'RES007',
    content: 'Ayush 104',
    startPos: 21,
    endPos: 30,
    rowValue: 104,
    colorCode: 'inactive',
  },
];

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

  data: IGValue[] = [];

  reset = true;
  loading = false;

  constructor() {}

  ngOnInit(): void {
    this.data = [...data];
  }

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

  handleReset() {
    this.loading = true;
    setTimeout(() => {
      this.data = [...data];
      this.loading = false;
    }, 1500);
  }

  handleReinitialize() {
    this.reset = !this.reset;
  }
}
