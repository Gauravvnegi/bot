import { Component, OnInit } from '@angular/core';
import { FormService } from '../../services/form.service';
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
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.globalFilterService.toggleFullView.subscribe((res: boolean) => {
      this.showCalendarView = res;
    });
  }
}
