import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';
import { CreateWithService } from '../../services/create-with.service';

@Component({
  selector: 'hospitality-bot-create-with-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/dashboard`;

  constructor(private createWithService: CreateWithService) {}

  get isLoaded() {
    return this.createWithService.$isCookiesLoaded.value;
  }

  ngOnInit(): void {}
}
