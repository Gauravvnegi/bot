import { Component } from '@angular/core';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    private channelManagerFormService: ChannelManagerFormService,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if (
      !(
        this.router.url.includes('update-inventory') ||
        this.router.url.includes('update-rates')
      )
    )
      this.channelManagerFormService.reset();
  }
}
