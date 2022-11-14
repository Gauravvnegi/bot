import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-inhouse',
  templateUrl: './inhouse.component.html',
  styleUrls: ['./inhouse.component.scss'],
})
export class InhouseComponent implements OnInit {
  @Input() requestConfiguration;
  constructor() {}

  ngOnInit(): void {}
}
