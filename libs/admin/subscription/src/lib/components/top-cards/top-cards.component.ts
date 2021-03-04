import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-top-cards',
  templateUrl: './top-cards.component.html',
  styleUrls: ['./top-cards.component.scss']
})
export class TopCardsComponent implements OnInit {

  @Input() data;
  constructor() { }

  ngOnInit(): void {
  }

}
