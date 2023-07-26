import { Component, OnInit } from '@angular/core';
import {
  EntitySubType,
  HotelDetailService,
} from '@hospitality-bot/admin/shared';
import { FormService } from '../../services/form.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { initial } from 'lodash';
import { SelectedEntity } from '../../types/reservation.type';

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
    private formService: FormService,
    private globalFilterService: GlobalFilterService,
    private hotelDetailService: HotelDetailService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.formService.getSelectedEntity().subscribe((value) => {
      this.selectedEntity = value ?? this.intitalEntity;
      this.selectedOutlet = value?.subType ?? this.initialSubType;
    });
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      this.getSelectedOutlet(
        data['filter'].value.property.entityName,
        data['filter'].value.property.brandName
      );
    });
  }

  getSelectedOutlet(branchId: string, brandId: string) {
    const brand = this.hotelDetailService.brands.find(
      (brand) => brand.id === brandId
    );

    const branch = brand.entities.find((branch) => branch.id === branchId);
    this.initialSubType = branch.type ? branch.type : EntitySubType.ROOM_TYPE;
    this.intitalEntity = {
      label: branch.name,
      type: branch.category,
      subType: branch.type,
      id: branch.id,
    };
  }
}
