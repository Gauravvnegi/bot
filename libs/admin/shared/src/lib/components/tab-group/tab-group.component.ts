import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
})
export class TabGroupComponent implements OnInit {
  @Input() listItems = [];

  constructor() {}

  ngOnInit(): void {}
}
