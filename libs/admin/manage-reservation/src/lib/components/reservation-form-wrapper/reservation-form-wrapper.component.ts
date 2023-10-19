import { Component, OnInit } from '@angular/core';
import {
  EntitySubType,
  HotelDetailService,
} from '@hospitality-bot/admin/shared';
import { SelectedEntity } from '../../types/reservation.type';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-reservation-form-wrapper',
  templateUrl: './reservation-form-wrapper.component.html',
  styleUrls: ['./reservation-form-wrapper.component.scss'],
})
export class ReservationFormWrapperComponent implements OnInit {
  selectedOutlet: EntitySubType;
  initialSubType: EntitySubType;

  intitalEntity: SelectedEntity;
  selectedEntity: SelectedEntity;

  constructor(
    private hotelDetailService: HotelDetailService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getSelectedEntity();
  }

  getSelectedEntity() {
    const outletId = this.route.snapshot.queryParams.entityId;
    const properties = this.hotelDetailService.getPropertyList();
    const selectedOutlet = properties.filter((item) => item.value === outletId);
    this.selectedOutlet = selectedOutlet[0].type;
  }
}
