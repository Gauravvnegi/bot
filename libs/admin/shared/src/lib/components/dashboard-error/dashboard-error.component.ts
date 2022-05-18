import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-dashboard-error',
  templateUrl: './dashboard-error.component.html',
  styleUrls: ['./dashboard-error.component.scss'],
})
export class DashboardErrorComponent implements OnInit {
  constructor(private _router: Router) {}

  ngOnInit(): void {}
  redirectToDashboard() {
    this._router.navigate(['/pages/dashboard']);
  }
}
