import { Component, Input, OnInit } from '@angular/core';
import { ModuleNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-inhouse',
  templateUrl: './inhouse.component.html',
  styleUrls: ['./inhouse.component.scss'],
})
export class InhouseComponent implements OnInit {
  @Input() requestConfiguration;
  constructor() {}

  ngOnInit(): void {}

  get featurePath() {
    return [ModuleNames.REQUEST_DASHBOARD];
  }
}
