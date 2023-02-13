import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';
import { CreateWithService } from '../../services/create-with.service';

@Component({
  selector: 'hospitality-bot-create-with-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/page`;

  constructor(private createWithService: CreateWithService) {}

  get isLoaded() {
    return this.createWithService.$isCookiesLoaded.value;
  }

  ngOnInit(): void {}
}
