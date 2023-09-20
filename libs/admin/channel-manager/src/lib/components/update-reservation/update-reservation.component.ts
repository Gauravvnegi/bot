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

  data = [
    {
      content: 'Dhruv 101',
      startPos: 1,
      endPos: 3,
      rowValue: 101,
    },
    {
      content: 'Akash 101',
      startPos: 3,
      endPos: 4,
      rowValue: 101,
    },
    {
      content: 'Jag 101',
      startPos: 6,
      endPos: 7,
      rowValue: 101,
    },
    {
      content: 'Tony Stark 102',
      startPos: 6,
      endPos: 7,
      rowValue: 102,
    },
    {
      content: 'Steve Rogers 103',
      startPos: 3,
      endPos: 6,
      rowValue: 103,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
