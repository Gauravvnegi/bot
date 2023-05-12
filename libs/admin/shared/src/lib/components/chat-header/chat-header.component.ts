import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-chat-header',
  templateUrl: './chat-header.component.html',
  styleUrls: ['./chat-header.component.scss'],
})
export class ChatHeaderComponent implements OnInit {
  @Input() searchForm;
  constructor() {}

  ngOnInit(): void {}
}
