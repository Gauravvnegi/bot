import { Component, OnInit } from '@angular/core';
import { ManageReservationService } from '../../services/manage-reservation.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss'],
})
export class ReservationComponent implements OnInit {
  hotelId: string = '';
  tabFilterIdx = 0;
  tabFilterItems = [];

  selectedOutlet = this.tabFilterItems[0];
  navRoutes = [
    {
      label: 'Manage Reservation',
      link: '/admin',
    },
  ];

  constructor(
    private reservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;

    this.getTabFilterItems();
  }

  getTabFilterItems(): void {
    //api call to get the outlet list
    this.reservationService.getOutletList(this.hotelId).subscribe((res) => {
      console.log(res, 'response');
      res.records.forEach((element) => {
        this.tabFilterItems.push({
          label: element.name,
          value: element.id,
          type: element.type,
        });
      });
    });
  }

  onSelectedTabFilterChange(event): void {
    this.tabFilterIdx = event.index;
    this.selectedOutlet = this.tabFilterItems[event.index];
  }
}
