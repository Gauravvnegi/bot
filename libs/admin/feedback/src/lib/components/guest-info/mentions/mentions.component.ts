import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-mentions',
  templateUrl: './mentions.component.html',
  styleUrls: ['./mentions.component.scss'],
})
export class MentionsComponent implements OnInit {
  @Input() guestId;
  constructor() {}

  ngOnInit(): void {}
}
