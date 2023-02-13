import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent {
  draftDate: string;

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

  @Input() label: string;
  @Input() set dateTime(value: number | undefined) {
    this.setDraftTime(value ? new Date() : new Date());
  }

  constructor(private location: Location) {}

  setDraftTime(date: Date) {
    const currentDate = date.getDate();
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    const fullDate = `${this.months[currentMonth]}, ${currentDate} ${currentYear}`;

    const currentTime = date.toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    this.draftDate = `${fullDate} ${currentTime}`;
  }

  back() {
    this.location.back();
  }
}
