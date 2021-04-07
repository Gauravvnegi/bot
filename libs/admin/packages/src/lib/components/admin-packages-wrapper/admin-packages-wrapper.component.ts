import { Component, OnInit } from '@angular/core';
import { TableNames } from 'libs/shared/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-admin-packages-wrapper',
  templateUrl: './admin-packages-wrapper.component.html',
  styleUrls: ['./admin-packages-wrapper.component.scss'],
})
export class AdminPackagesWrapperComponent implements OnInit {
  tables = TableNames;
  constructor() {}

  ngOnInit(): void {}
}
