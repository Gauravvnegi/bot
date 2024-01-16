import { Component, Input, OnInit } from '@angular/core';
import { MenuItemCard } from '../../types/menu-order';

@Component({
  selector: 'hospitality-bot-menu-item-card',
  templateUrl: './menu-item-card.component.html',
  styleUrls: ['./menu-item-card.component.scss'],
})
export class MenuItemCardComponent implements OnInit {
  @Input() cardData: MenuItemCard;

  constructor() {}

  ngOnInit(): void {}

  addItem() {}
}
