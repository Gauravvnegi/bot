import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'hospitality-bot-create-with-marketing-and-seo',
  templateUrl: './marketing-and-seo.component.html',
  styleUrls: ['./marketing-and-seo.component.scss'],
})
export class MarketingAndSeoComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/marketing-seo`;

  constructor() {}

  ngOnInit(): void {}
}
