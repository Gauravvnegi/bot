import { Component, OnInit } from '@angular/core';
import {
  EntityTabFilterResponse,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { KotService } from '../../services/kot.service';

@Component({
  selector: 'hospitality-bot-kot',
  templateUrl: './kot.component.html',
  styleUrls: ['./kot.component.scss'],
})
export class KotComponent implements OnInit {
  welcomeMessage = 'Welcome to KOT dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Manage KOT', link: './' }];

  constructor(private kotService: KotService) {}

  ngOnInit(): void {}

  onEntityTabFilterChanges(event: EntityTabFilterResponse): void {
    this.kotService.entityId = event.entityId[0];
  }
}
