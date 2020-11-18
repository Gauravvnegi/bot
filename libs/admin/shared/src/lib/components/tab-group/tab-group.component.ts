import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-tab-group',
  templateUrl: './tab-group.component.html',
  styleUrls: ['./tab-group.component.scss'],
})
export class TabGroupComponent implements OnInit {
  @Input() listItems = [];
  @Input() selectedIndex = 0;
  @Output() selectedTabChange = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  onSelectedTabChange(event) {
    this.selectedTabChange.next(event);
  }
}
