import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
import {
  EntityType,
  EntitySubType,
  EntityTabFilterResponse,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  navRoutes = [
    {
      label: 'Manage Reservation',
      link: '/admin',
    },
  ];
  showCalendarView: boolean = false;

  constructor(
    private formService: FormService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.globalFilterService.toggleFullView.subscribe((res: boolean) => {
      this.showCalendarView = res;
    });
  }

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
    this.formService.selectedEntity.next(this.getFormServiceEntity(event));
  }
}
