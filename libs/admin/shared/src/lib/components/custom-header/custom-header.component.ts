import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-custom-header',
  templateUrl: './custom-header.component.html',
  styleUrls: ['./custom-header.component.scss'],
})
export class CustomHeaderComponent implements OnInit {
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
    if (value) this.setDraftTime(new Date(value));
  }

  constructor(private location: Location) {}

  ngOnInit(): void {
    if (!this.draftDate) this.setDraftTime(new Date());
  }

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
