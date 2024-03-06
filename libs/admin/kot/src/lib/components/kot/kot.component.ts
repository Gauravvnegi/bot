import { Component, OnInit } from '@angular/core';
import {
  EntityTabFilterResponse,
  NavRouteOption,
} from '@hospitality-bot/admin/shared';
import { KotService } from '../../services/kot.service';

@Component({
  selector: 'hospitality-bot-kot',
  templateUrl: './kot.component.html',
  styleUrls: ['./kot.component.scss'],
})
export class KotComponent implements OnInit {
  navRoutes: NavRouteOption[] = [
    {
      label: 'Manage KOT',
      link: './',
    },
  ];

  welcomeMessage: string = 'Welcome to KOT Dashboard';

  constructor(private kotService: KotService) {}

  ngOnInit(): void {}

  /**
   * @function onGlobalTabFilterChanges To listen to global tab filter changes
   * @param value
   */

  onGlobalTabFilterChanges(event: EntityTabFilterResponse) {
    this.kotService.initCustomHeaderConfig({ entityId: event.entityId[0] });
    this.kotService.OnGlobalFilterChange.next(event);
  }
}
