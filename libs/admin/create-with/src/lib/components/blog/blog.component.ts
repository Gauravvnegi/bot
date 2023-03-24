import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';
import { CookiesSettingsService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-create-with-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/blog`;
  isLoaded: boolean;

  constructor(private cookiesSettingService: CookiesSettingsService) {}

  ngOnInit(): void {
    this.cookiesSettingService.$isPlatformCookiesLoaded.subscribe((res) => {
      this.isLoaded = res;
    });
  }
}
