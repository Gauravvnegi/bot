import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss'],
})
export class RequestComponent implements OnInit {
  @Input() guestId;
  constructor() {}

  ngOnInit(): void {}
}
