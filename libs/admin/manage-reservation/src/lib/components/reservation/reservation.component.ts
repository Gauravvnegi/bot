import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
import {
  EntityType,
  EntitySubType,
  EntityTabFilterResponse,
} from '@hospitality-bot/admin/shared';

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

  constructor(private formService: FormService) {}

  ngOnInit(): void {}

  getFormServiceEntity(item: EntityTabFilterResponse) {
    return {
      id: item.entityId[0],
      label: item.label,
      type: item.outletType ? EntityType.OUTLET : EntityType.HOTEL,
      subType: item.outletType ? item.outletType : EntitySubType.ROOM_TYPE,
      value: item.entityId[0]
    };
  }

  onEntityTabFilterChanges(event: EntityTabFilterResponse): void {
    this.formService.selectedEntity.next(this.getFormServiceEntity(event));
  }
}
