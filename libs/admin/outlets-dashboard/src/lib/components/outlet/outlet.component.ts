import { Component, OnInit } from '@angular/core';
import {
  NavRouteOptions,
  EntityTabFilterResponse,
  EntityType,
  EntitySubType,
} from '@hospitality-bot/admin/shared';
import { OutletTableService } from '../../services/outlet-table.service';

@Component({
  selector: 'hospitality-bot-outlet',
  templateUrl: './outlet.component.html',
  styleUrls: ['./outlet.component.scss'],
})
export class OutletComponent implements OnInit {
  welcomeMessage = 'Welcome to your dashboard';
  navRoutes: NavRouteOptions = [{ label: 'Outlet Dashboard', link: './' }];

  selectedInterval: string;
  entityId: string;

  constructor(private outletTableService: OutletTableService) {}

  ngOnInit(): void {}

  getFormServiceEntity(item: EntityTabFilterResponse) {
    return {
      id: item.entityId[0],
      label: item.label,
      type: item.outletType ? EntityType.OUTLET : EntityType.HOTEL,
      subType: item.outletType ? item.outletType : EntitySubType.ROOM_TYPE,
      value: item.entityId[0],
    };
  }

  onEntityTabFilterChanges(event: EntityTabFilterResponse): void {
    this.outletTableService.selectedEntity.next(
      this.getFormServiceEntity(event)
    );
  }
}
