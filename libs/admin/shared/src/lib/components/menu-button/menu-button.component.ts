import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss']
})
export class MenuButtonComponent implements OnInit {

  @Input() label: string;
  toggleIcon: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
