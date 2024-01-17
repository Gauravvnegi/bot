import { Component, OnInit } from '@angular/core';
import { NavRouteOption } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-table-management',
  templateUrl: './table-management.component.html',
  styleUrls: ['./table-management.component.scss'],
})
export class TableManagementComponent implements OnInit {
  navRoutes: NavRouteOption[] = [
    {
      label: 'Table / Area Management',
      link: './',
    },
  ];

  welcomeMessage: string = 'Welcome to Table Management';
  constructor() {}

  ngOnInit(): void {}
}
