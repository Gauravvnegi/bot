import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { selectedOutlet } from '../../types/reservation.type';
import { EntityTabGroup } from '../../constants/reservation-table';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { BaseDatatableComponent, TableService } from '@hospitality-bot/admin/shared';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent extends BaseDatatableComponent
  implements OnInit {
  hotelId: string = '';
  tabFilterIdx = 0;
  tabFilterItems = [];
  selectedOutlet: EntityTabGroup;
  loading = false;
  navRoutes = [
    {
      label: 'Manage Reservation',
      link: '/admin',
    },
  ];

  constructor(
    public fb: FormBuilder,
    private reservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
    public tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.getTabFilterItems();
  }

  getTabFilterItems(): void {
    //api call to get the outlet list
    this.reservationService.getOutletList(this.hotelId).subscribe((res) => {
      res.records.forEach((element) => {
        this.tabFilterItems.push({
          label: element.name,
          value: element.id,
          type: element.type,
        });
      });
      this.selectedOutlet = this.tabFilterItems[0];
    });
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.selectedOutlet = this.tabFilterItems[event.index].type;
    this.reservationService.selectedOutlet.next(this.selectedOutlet);
  }
}
