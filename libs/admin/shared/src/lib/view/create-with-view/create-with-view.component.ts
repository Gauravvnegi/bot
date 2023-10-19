import { Component, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-create-with-view',
  templateUrl: './create-with-view.component.html',
  styleUrls: ['./create-with-view.component.scss'],
})
export class CreateWithViewComponent {
  @Input() isLoaded: boolean;
  @Input() onboardingUrl: string;
}
