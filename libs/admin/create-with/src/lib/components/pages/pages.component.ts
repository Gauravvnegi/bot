import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'hospitality-bot-create-with-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/page`;

  constructor() {}

  ngOnInit(): void {}
}
