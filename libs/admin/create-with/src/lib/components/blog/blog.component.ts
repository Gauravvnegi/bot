import { Component, OnInit } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';
import { CreateWithService } from '../../services/create-with.service';

@Component({
  selector: 'hospitality-bot-create-with-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
})
export class BlogComponent implements OnInit {
  onboardingUrl = `${environment.createWithUrl}/admin/blog`;

  constructor(private createWithService: CreateWithService) {}

  get isLoaded() {
    return this.createWithService.$isCookiesLoaded.value;
  }

  ngOnInit(): void {}
}
