import { Component } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'hospitality-bot-unsubscribe-view',
  templateUrl: './unsubscribe-view.component.html',
  styleUrls: ['./unsubscribe-view.component.scss'],
})
export class UnsubscribeViewComponent {
  redirectToHomePage(): void {
    window.open(environment.guest_home, '_blank');
  }
}
