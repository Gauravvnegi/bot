import { Component, OnInit } from '@angular/core';
import {
  ModuleNames,
  TableNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-admin-packages-wrapper',
  templateUrl: './admin-packages-wrapper.component.html',
  styleUrls: ['./admin-packages-wrapper.component.scss'],
})
export class AdminPackagesWrapperComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  get featurePath() {
    return {
      category: [`${ModuleNames.PACKAGES}.tables.${TableNames.CATEGORY}`],
      package: [`${ModuleNames.PACKAGES}.tables.${TableNames.PACKAGE}`],
    };
  }
}
