import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'complaint-disengagement',
  templateUrl: './complaint-disengagement.component.html',
  styleUrls: ['./complaint-disengagement.component.scss'],
})
export class ComplaintDisengagementComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  getPercentage(first: number, second: number, third: number) {
    return (first * 100) / (first + second + third);
  }
}
