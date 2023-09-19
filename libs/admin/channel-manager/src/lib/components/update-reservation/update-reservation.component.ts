import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-update-reservation',
  templateUrl: './update-reservation.component.html',
  styleUrls: ['./update-reservation.component.scss'],
})
export class UpdateReservationComponent implements OnInit {
  gridRows = [
    {
      label: '101',
      value: 101,
    },
    {
      label: '102',
      value: 102,
    },
    {
      label: '103',
      value: 103,
    },
    {
      label: '104',
      value: 104,
    },
    {
      label: '105',
      value: 105,
    },
  ];

  data = {
    101: {
      1: {
        id: '1011',
        cellOccupied: 3,
        name: 'Dhruv',
        hasNext: false,
        hasPrev: false,
      },
      6: {
        id: '1012',
        cellOccupied: 2,
        name: 'Jag',
        hasNext: true,
        hasPrev: false,
      },

      7: {
        id: '1013',
        cellOccupied: 3,
        name: 'Ayush',
        hasNext: false,
        hasPrev: true,
      },
    },
    102: {
      6: {
        id: '1021',
        cellOccupied: 5,
        name: 'Tony Stark',
        hasNext: false,
        hasPrev: false,
      },
    },
    104: {
      2: {
        id: '1041',
        cellOccupied: 4,
        name: 'Shivendra',
        hasNext: false,
        hasPrev: false,
      },
      6: {
        id: '1042',
        cellOccupied: 2,
        name: 'Satya',
        hasNext: false,
        hasPrev: false,
      },

      8: {
        id: '1043',
        cellOccupied: 3,
        name: 'Saurav',
        hasNext: false,
        hasPrev: false,
      },
      11: {
        id: '1044',
        cellOccupied: 3,
        name: 'Bruce',
        hasNext: false,
        hasPrev: false,
      },
    },
    105: {
      9: {
        id: '1051',
        cellOccupied: 3,
        name: 'Sanjay Singhania',
        hasNext: false,
        hasPrev: false,
      },
    },
  };

  constructor() {}

  ngOnInit(): void {}
}
