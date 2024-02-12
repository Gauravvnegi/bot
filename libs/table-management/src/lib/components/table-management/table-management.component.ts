import { Component, OnInit } from '@angular/core';
import { NavRouteOption } from '@hospitality-bot/admin/shared';
import { EntityTabFilterConfig } from 'libs/admin/global-shared/src/lib/types/entity-tab.type';
import { TableManagementService } from '../../services/table-management.service';

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
  constructor(private tableManagementService: TableManagementService) {}

  ngOnInit(): void {}

  onGlobalTabFilterChanges(event: EntityTabFilterConfig) {
    this.tableManagementService.onGlobalFilterChange.next(event);
  }
}
