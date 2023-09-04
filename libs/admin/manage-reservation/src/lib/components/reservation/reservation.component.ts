import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  BaseDatatableComponent,
  EntityConfig,
  EntitySubType,
  EntityType,
  HotelDetailService,
  TableService,
} from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FormService } from '../../services/form.service';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent {

  constructor(
    public fb: FormBuilder,
    private formService: FormService,
    protected _hotelDetailService: HotelDetailService
  ) {}

  getFormServiceEntity(item) {
    return {
      id: item.value,
      label: item.label,
      type: item.outletType ? EntityType.OUTLET : EntityType.HOTEL,
      subType: item.outletType ? item.outletType : EntitySubType.ROOM_TYPE,
    };
  }

  onEntityTabFilterChanges(event): void {
    const index = event.tabFilterIdx ? event.tabFilterIdx : 0;
    this.formService.selectedEntity.next(
      this.getFormServiceEntity(event.tabFilterItems[index])
    );
  }
}

export enum Feedback {
  STAY = 'STAYFEEDBACK',
  TRANSACTIONAL = 'TRANSACTIONALFEEDBACK',
  BOTH = 'ALL',
}
