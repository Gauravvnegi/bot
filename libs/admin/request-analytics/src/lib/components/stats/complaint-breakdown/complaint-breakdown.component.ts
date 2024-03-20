import { Component, OnInit } from '@angular/core';
type HotelService = {
  label: string;
  score: number;
  positive: number;
  negative: number;
  neutral: number;
  minScore: number;
  maxScore: number;
  colorCode: string;
};
@Component({
  selector: 'complaint-breakdown',
  templateUrl: './complaint-breakdown.component.html',
  styleUrls: ['./complaint-breakdown.component.scss'],
})
export class ComplaintBreakdownComponent implements OnInit {
  constructor() {}

  label: string = 'Complaint Breakdown';

  performance = {
    label: 'Top/Low NPS',
    performances: [
      {
        label: 'Wifi Services',
        score: 41.2,
        positive: 381,
        negative: 100,
        neutral: 201,
        minScore: -100,
        maxScore: 100,
        colorCode: '#4BC0C0',
      },
      {
        label: 'Maintenance',
        score: 40.83,
        positive: 1102,
        negative: 269,
        neutral: 669,
        minScore: -100,
        maxScore: 100,
        colorCode: '#FF6384',
      },
      {
        label: 'Front Office',
        score: 40.41,
        positive: 1108,
        negative: 282,
        neutral: 654,
        minScore: -100,
        maxScore: 100,
        colorCode: '#4BC0C0',
      },
      {
        label: 'Food & Beverage',
        score: 39.79,
        positive: 371,
        negative: 100,
        neutral: 210,
        minScore: -100,
        maxScore: 100,
        colorCode: '#FF6384',
      },
      {
        label: 'House Keeping',
        score: 35.36,
        positive: 696,
        negative: 214,
        neutral: 453,
        minScore: -100,
        maxScore: 100,
        colorCode: '#FF6384',
      },
      {
        label: 'Reservations',
        score: 7.95,
        positive: 266,
        negative: 213,
        neutral: 188,
        minScore: -100,
        maxScore: 100,
        colorCode: '#FF6384',
      },
    ],
  };

  ngOnInit(): void {}
}
