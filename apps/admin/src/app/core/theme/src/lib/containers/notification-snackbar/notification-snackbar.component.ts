import { Component, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-notification-snackbar',
  templateUrl: './notification-snackbar.component.html',
  styleUrls: ['./notification-snackbar.component.scss'],
})
export class NotificationSnackbarComponent {
  @Input() title: string | number = '';
  @Input() message: string = '';
}
