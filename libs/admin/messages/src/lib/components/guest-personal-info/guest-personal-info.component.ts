import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-personal-info',
  templateUrl: './guest-personal-info.component.html',
  styleUrls: ['./guest-personal-info.component.scss'],
})
export class GuestPersonalInfoComponent implements OnInit {
  @Input() data;
  constructor() {}

  ngOnInit(): void {}
}
