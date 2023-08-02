import { Component, OnDestroy } from '@angular/core';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(private channelManagerFormService: ChannelManagerFormService) {}

  ngOnDestroy(): void {
    this.channelManagerFormService.reset();
  }
}
