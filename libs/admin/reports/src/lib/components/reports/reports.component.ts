import { Component, OnInit } from '@angular/core';
import { ReportsService } from '../../services/reports.service';

@Component({
  selector: 'hospitality-bot-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  openMenu = false;
  reportTitle = 'Reservation';
  selectedReport = 'arrivalReport';
  reportsMenuOptions = [
    {
      label: 'Arrival',
      value: 'arrivalReport',
    },
    {
      label: 'Departure',
      value: 'departureReport',
    },
    {
      label: 'No Show',
      value: 'noShowReport',
    },
  ];
  constructor(private reportsService: ReportsService) {}

  ngOnInit(): void {
    this.registerListener();
  }

  registerListener() {
    this.reportsService.showMenu.subscribe((res) => {
      this.openMenu = res;
    });
  }

  toggleMenu() {
    this.reportsService.toggleMenu();
  }

  selectReport() {}
}
