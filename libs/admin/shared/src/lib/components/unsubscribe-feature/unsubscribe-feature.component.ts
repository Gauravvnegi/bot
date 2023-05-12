import { Component } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'hospitality-bot-unsubscribe-feature',
  templateUrl: './unsubscribe-feature.component.html',
  styleUrls: ['./unsubscribe-feature.component.scss'],
})
export class UnsubscribeFeatureComponent {
  redirectToHomePage(): void {
    window.open(environment.guest_home, '_blank');
  }
}
