import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit {
  @Input() label: string;
  @Input() dateTime: number;

  constructor(private location: Location) {}

  updatedAt: string;

  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  ngOnInit(): void {
    this.dateTime
      ? this.getCurrentDateAndTime(new Date(this.dateTime))
      : this.getCurrentDateAndTime(new Date());
  }

  getCurrentDateAndTime(date: Date) {
    const currentDate = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const fullDate = `${this.months[currentMonth]}, ${currentDate} ${currentYear}`;

    const currentTime = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    this.updatedAt = `${fullDate} ${currentTime}`;
  }

  back() {
    this.location.back();
  }
}
