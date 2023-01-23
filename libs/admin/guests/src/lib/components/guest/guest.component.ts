import { Component, OnInit } from '@angular/core';
import { ModuleNames, TableNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-guest',
  templateUrl: './guest.component.html',
  styleUrls: ['./guest.component.scss'],
})
export class GuestComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get featurePath() {
    return [`${ModuleNames.GUESTS_DASHBOARD}.tables.${TableNames.GUEST}`];
  }
}
