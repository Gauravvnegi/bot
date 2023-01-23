import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-pre-arrival',
  templateUrl: './pre-arrival.component.html',
  styleUrls: ['./pre-arrival.component.scss'],
})
export class PreArrivalComponent implements OnInit {
  @Input() requestConfiguration;
  constructor() {}

  ngOnInit(): void {}
}
